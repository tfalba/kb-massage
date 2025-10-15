// server/index.js
const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const tz = require("dayjs/plugin/timezone");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
require("dotenv").config();
dayjs.extend(utc); dayjs.extend(tz);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

require("dotenv").config();

const app = express();
const allowedOrigins = [
  "http://localhost:5173",               // local dev
  "https://kb-massage.vercel.app", // your live frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // allow REST tools like curl or Postman (no Origin header)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
// app.use(cors());
app.use(express.json());

const {
  PORT = process.env.PORT || 4001,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  GOOGLE_CALENDAR_ID = "primary",
  TIMEZONE = "America/New_York",
  SLOT_DURATION_MIN = "60",
    SLOT_STEP_MIN = "30",
  BUFFER_BEFORE_MIN = "0",
  BUFFER_AFTER_MIN = "10",

  SLOT_PADDING_MIN = "10",
  BUSINESS_HOURS_JSON = "[]",
} = process.env;


const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

const TOKENS_PATH = process.env.TOKENS_PATH || path.resolve(__dirname, "tokens.json");

// async function saveTokens(tokens) {
//   // Keep minimal set; include refresh_token if present
//   const current = await loadTokens().catch(() => ({}));
//   const merged = { ...current, ...tokens }; // preserve existing refresh_token if not re-sent
//   await fsp.writeFile(TOKENS_PATH, JSON.stringify(merged, null, 2), { mode: 0o600 });
// }

// async function loadTokens() {
//   const raw = await fsp.readFile(TOKENS_PATH, "utf-8");
//   return JSON.parse(raw);
// }

// function tokensFileExists() {
//   try { fs.accessSync(TOKENS_PATH, fs.constants.F_OK); return true; } catch { return false; }
// }


// // Load tokens at boot (if saved previously)
// (async () => {
//   if (tokensFileExists()) {
//     try {
//       const tokens = await loadTokens();
//       oauth2Client.setCredentials(tokens);
//       console.log("✅ Loaded saved Google tokens.");
//     } catch (e) {
//       console.warn("⚠️ Could not load saved tokens:", e.message);
//     }
//   } else {
//     console.log("ℹ️ No saved tokens yet. Visit /gcal/auth/url to connect.");
//   }
// })();


/** ensure parent directory exists (important if TOKENS_PATH is under /data/subdir/...) */
async function ensureDirFor(filePath) {
  const dir = path.dirname(filePath);
  await fsp.mkdir(dir, { recursive: true });
}

/** read tokens.json safely (return {} if missing/bad) */
async function loadTokens() {
  try {
    const raw = await fsp.readFile(TOKENS_PATH, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return {}; // no file yet or invalid JSON
  }
}

/** atomic save to avoid partial writes on crash */
async function saveTokens(tokens) {
  const current = await loadTokens();
  // Preserve an existing refresh_token if Google didn’t send a new one
  const merged = {
    ...current,
    ...tokens,
    refresh_token: tokens.refresh_token || current.refresh_token || undefined,
  };

  await ensureDirFor(TOKENS_PATH);
  const tmp = `${TOKENS_PATH}.tmp`;
  await fsp.writeFile(tmp, JSON.stringify(merged, null, 2), { mode: 0o600 });
  await fsp.rename(tmp, TOKENS_PATH);
  return merged;
}

// Load on boot (non-fatal if missing)
(async () => {
  const saved = await loadTokens();
  if (saved && (saved.refresh_token || saved.access_token)) {
    oauth2Client.setCredentials(saved);
    console.log("✅ Loaded saved Google tokens.");
  } else {
    console.log("ℹ️ No saved tokens yet. Visit /gcal/auth/url to connect.");
  }
})();

// Whenever Google refreshes access tokens, persist them
oauth2Client.on("tokens", async (tokens) => {
  try {
    await saveTokens(tokens);
    if (tokens.refresh_token) console.log("🔐 Refresh token saved.");
    else console.log("🔄 Access token refreshed.");
  } catch (e) {
    console.error("Failed to save tokens:", e);
  }
});

function getAuthedCalendar() {
  // If you want, guard here for missing tokens:
  if (!oauth2Client.credentials?.refresh_token) throw new Error("Not authorized with Google.");
  return google.calendar({ version: "v3", auth: oauth2Client });
}
// In-memory token storage for demo — replace with DB in prod.
// let TOKENS = null;

// ----- Auth endpoints -----
// const SCOPES = ["https://www.googleapis.com/auth/calendar"];

app.get("/gcal/auth/url", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",     // needed for refresh_token
    prompt: "consent",          // force Google to send refresh_token at least once
    scope: ["https://www.googleapis.com/auth/calendar"],
  });
  res.json({ url });
});

// app.get("/gcal/oauth2callback", async (req, res) => {
//   try {
//     const { code } = req.query;
//     const { tokens } = await oauth2Client.getToken(code);
//     oauth2Client.setCredentials(tokens);
//     await saveTokens(tokens);
//     res.send("Google Calendar connected ✅ You can close this tab.");
//   } catch (e) {
//     console.error("OAuth error", e);
//     res.status(500).send("OAuth failed");
//   }
// });

app.get("/gcal/oauth2callback", async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).send("Missing code");
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    await saveTokens(tokens);
    res.send("Google Calendar connected ✅ You can close this tab.");
  } catch (e) {
    console.error("OAuth error", e);
    res.status(500).send("OAuth failed");
  }
});

// ----- helpers -----

/** expand each busy block by buffers (pre/post) */
function expandBusy(busy, beforeMin, afterMin) {
  const before = Number(beforeMin) || 0;
  const after = Number(afterMin) || 0;
  return busy.map(b => ({
    start: dayjs(b.start).subtract(before, "minute"),
    end:   dayjs(b.end).add(after, "minute"),
  }));
}

/** subtract an array of (possibly overlapping) blocks from a single free segment */
function subtractBlocks(freeSeg, blocks) {
  // Normalize and merge blocks first (to simplify subtraction)
  const merged = mergeIntervals(
    blocks.map(b => ({ start: dayjs(b.start), end: dayjs(b.end) }))
  );
  // Start with the free seg, carve out merged busy one by one
  let segs = [freeSeg];
  for (const b of merged) {
    const next = [];
    for (const seg of segs) {
      // no overlap
      if (b.end.isSameOrBefore(seg.start) || b.start.isSameOrAfter(seg.end)) {
        next.push(seg);
        continue;
      }
      // overlap: maybe left piece
      if (b.start.isAfter(seg.start)) next.push({ start: seg.start, end: b.start });
      // maybe right piece
      if (b.end.isBefore(seg.end))   next.push({ start: b.end, end: seg.end });
    }
    segs = next;
  }
  return segs.filter(s => s.end.isAfter(s.start));
}

/** merge overlapping intervals (expects {start:dayjs, end:dayjs}) */
function mergeIntervals(intervals) {
  if (!intervals.length) return [];
  const sorted = intervals.slice().sort((a, b) => a.start.valueOf() - b.start.valueOf());
  const out = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const prev = out[out.length - 1];
    const cur = sorted[i];
    if (cur.start.isSameOrBefore(prev.end)) {
      // overlap/contiguous -> extend
      if (cur.end.isAfter(prev.end)) prev.end = cur.end;
    } else {
      out.push({ start: cur.start, end: cur.end });
    }
  }
  return out;
}

/** iterate candidate starts aligned to a step (e.g. 30min) */
function* iterateSteppedStarts(freeSeg, stepMin, durationMin) {
  const step = Number(stepMin);
  const dur = Number(durationMin);
  // Align to the next step tick from start-of-day
  const base = freeSeg.start.startOf("day");
  const minsFromBase = freeSeg.start.diff(base, "minute");
  const alignedMins = Math.ceil(minsFromBase / step) * step;
  let t = base.add(alignedMins, "minute");

  while (true) {
    const end = t.add(dur, "minute");
    if (end.isAfter(freeSeg.end)) break;
    // ensure start >= freeSeg.start (could happen if ceil pushed backwards due to DST etc.)
    if (t.isSameOrAfter(freeSeg.start)) {
      yield { start: t, end };
    }
    t = t.add(step, "minute");
  }
}

/** build working windows (same as you had; simplified snippet) */
function workingWindows(fromISO, toISO, windowsDef) {
  // windowsDef is your BUSINESS_HOURS_JSON parsed
  const out = [];
  let d = dayjs.tz(fromISO, TIMEZONE).startOf("day");
  const end = dayjs.tz(toISO, TIMEZONE).endOf("day");

  while (d.isSameOrBefore(end)) {
    const jsDow = d.day();             // 0..6 (Sun..Sat)
    const isoDow = jsDow === 0 ? 7 : jsDow; // 1..7
    for (const w of windowsDef) {
      if (w.dow.includes(isoDow)) {
        const ws = dayjs.tz(`${d.format("YYYY-MM-DD")}T${w.start}`, TIMEZONE);
        const we = dayjs.tz(`${d.format("YYYY-MM-DD")}T${w.end}`, TIMEZONE);
        if (we.isAfter(ws)) out.push({ start: ws, end: we });
      }
    }
    d = d.add(1, "day");
  }
  return out;
}

// ----- your availability route (core change is the slot generation) -----
app.get("/gcal/availability", async (req, res) => {
  try {
    const { start, end, duration } = req.query;
    if (!start || !end) return res.status(400).json({ error: "start and end ISO strings required" });

    const calendar = getAuthedCalendar(); // your existing function

    // 1) freebusy from Google
    const fb = await calendar.freebusy.query({
      requestBody: {
        timeMin: new Date(start).toISOString(),
        timeMax: new Date(end).toISOString(),
        items: [{ id: process.env.GOOGLE_CALENDAR_ID || "primary" }],
        timeZone: TIMEZONE,
      },
    });

    const rawBusy = (fb.data.calendars?.[process.env.GOOGLE_CALENDAR_ID || "primary"]?.busy || [])
      .map(b => ({ start: b.start, end: b.end }));

    // 2) Expand busy by buffers
    const expandedBusy = expandBusy(rawBusy, BUFFER_BEFORE_MIN, BUFFER_AFTER_MIN);

    // 3) Build working windows from env JSON
    const BH = JSON.parse(process.env.BUSINESS_HOURS_JSON || "[]"); // [{dow:[1..7], start:"09:00", end:"17:00"}]
    const windows = workingWindows(start, end, BH);

    // 4) Subtract busy from each window -> free segments
    const freeSegments = [];
    for (const w of windows) {
      const segs = subtractBlocks({ start: w.start, end: w.end }, expandedBusy);
      freeSegments.push(...segs);
    }

    // 5) Generate candidate slots: 1h duration, 30min step
    // const durationMin = Number(SLOT_DURATION_MIN);
    const durationMin = Number(duration);
    const stepMin = Number(SLOT_STEP_MIN);
    const now = dayjs();

    const slots = [];
    for (const seg of freeSegments) {
      for (const { start: s, end: e } of iterateSteppedStarts(seg, stepMin, durationMin)) {
        // keep only future starts
        if (s.isAfter(now)) {
          slots.push({ start: s.toISOString(), end: e.toISOString() });
        }
      }
    }

    // sort and return
    slots.sort((a, b) => new Date(a.start) - new Date(b.start));
    res.json({
      slots,
      timezone: TIMEZONE,
      durationMin,
      stepMin,
      bufferBeforeMin: Number(BUFFER_BEFORE_MIN),
      bufferAfterMin: Number(BUFFER_AFTER_MIN),
    });
  } catch (e) {
    console.error("availability error", e);
    res.status(500).json({ error: "Failed to compute availability", detail: String(e.message || e) });
  }
});



// See whether we’re authorized
app.get("/gcal/auth/status", async (_req, res) => {
  const saved = await loadTokens();
  res.json({
    path: TOKENS_PATH,
    hasFile: fs.existsSync(TOKENS_PATH),
    hasRefreshToken: Boolean(saved.refresh_token),
    expiryISO: saved.expiry_date ? new Date(saved.expiry_date).toISOString() : null,
  });
});

// app.get("/gcal/auth/status", async (req, res) => {
//   const hasFile = tokensFileExists();
//   const creds = oauth2Client.credentials || {};
//   res.json({
//     savedTokensFile: hasFile,
//     hasRefreshToken: Boolean(creds.refresh_token),
//     tokenExpiry: creds.expiry_date ? new Date(creds.expiry_date).toISOString() : null,
//   });
// });

// Disconnect (revoke) and delete tokens
app.post("/gcal/auth/disconnect", async (req, res) => {
  try {
    const creds = oauth2Client.credentials;
    if (creds?.access_token) {
      await oauth2Client.revokeToken(creds.access_token);
    }
    if (creds?.refresh_token) {
      await oauth2Client.revokeToken(creds.refresh_token);
    }
    try { await fsp.unlink(TOKENS_PATH); } catch {}
    oauth2Client.setCredentials({});
    res.json({ ok: true });
  } catch (e) {
    console.error("Revoke error:", e);
    res.status(500).json({ error: "Failed to revoke tokens" });
  }
});

// ----- Booking: create an event -----
app.post("/gcal/book", async (req, res) => {
  try {
    const { start, end, guestName, guestEmail, guestPhone, typeDuration} = req.body;
    if (!start || !end || !guestName || !guestEmail) {
      return res.status(400).json({ error: "start, end, guest.email required" });
    }
    const calendar = getAuthedCalendar();

    const event = {
      summary: `${guestName} ${typeDuration}min Massage Session`,
      description: `Booked via site.\nGuest: ${guestName || ""}\nEmail: ${guestEmail}\nPhone: ${guestPhone}`,
      start: { dateTime: new Date(start).toISOString(), timeZone: TIMEZONE },
      end:   { dateTime: new Date(end).toISOString(), timeZone: TIMEZONE },
      attendees: [{ email: guestEmail, displayName: guestName}],
      // Optional: Google Meet
      conferenceData: { createRequest: { requestId: `req-${Date.now()}` } },
      reminders: { useDefault: true },
    };

    const resp = await calendar.events.insert({
      calendarId: GOOGLE_CALENDAR_ID,
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: "all", // emails guest
    });

    res.json({ ok: true, event: resp.data });
  } catch (e) {
    console.error("book error", e);
    res.status(500).json({ error: "Failed to book", detail: String(e.message || e) });
  }
});

// ----- Quick health + start -----
app.get("/gcal/health", (_, res) => res.json({ ok: true }));
app.get("/", (_, res) => res.send("Booking server up"));

// app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
