const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const TOKEN = process.env.CALENDLY_TOKEN;

if (!TOKEN) {
    console.warn("Warning: CALENDLY_TOKEN is not set in environment variables.");
}
console.log("CALENDLY_TOKEN:", TOKEN?.length);

app.get("/api/health", (req, res) => {
    res.json({ ok: true });
});

app.get("/api/user", async (req, res) => {
    try {
        const resp = await fetch("https://api.calendly.com/users/me", {
            headers: { Authorization: `Bearer ${TOKEN}` },
        });
        const data = await resp.json();

        res.json({ scheduling_url: data.resource.scheduling_url });
    } catch (err) {
        console.error("Calendly user fetch failed:", err);
        res.status(500).json({ error: "Failed to fetch Calendly user info" });
    }
});

app.get("/api/event-types", async (req, res) => {
    if (!TOKEN) {
        return res.status(500).json({ error: "CALENDLY_TOKEN is not set" });
    }

    if (!global.userUri) {
        const u = await fetch("https://api.calendly.com/users/me", {

            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        });
        const userData = await u.json();
        console.log("Fetched user data:", userData);
        global.userUri = userData.resource.uri;
                // global.userUri = userData.resource.scheduling_url;

    }
    const url = `https://api.calendly.com/event_types?user=${encodeURIComponent(global.userUri)}`;
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        });
        const ct = response.headers.get("content-type") || "";
        const body = ct.includes("application/json") ? await response.json() : response.text();

        if (!response.ok) {
            console.log("Failed to fetch event types:", response.statusText);
            throw new Error("Failed to fetch event types");
        }

        return res.status(response.ok ? 200 : response.status).json(response.ok ? body : typeof body === 'string' ? { error: body } : body);

        // const data = await response.json();
        // res.status(response.ok ? 200 : response.status).json(data);
        // res.json(data);
    } catch (error) {
        console.error("Error fetching event types:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/api/availability", async (req, res) => {
    try {
        if (!TOKEN) {
            return res.status(500).json({ error: "Server misconfig: CALENDLY_TOKEN missing" });
        }

        let { eventType, tz, start, end, weeks, debug } = req.query;
        if (!eventType) {
            return res.status(400).json({ error: "Missing required query param 'eventType'" });
        }

        // Accept ID or full URI
        const eventTypeUri = String(eventType).startsWith("http")
            ? String(eventType)
            : `https://api.calendly.com/event_types/${eventType}`;

        const timezone = tz || "America/New_York";

        // Build time window
        const now = new Date();
        const bumpMs = 60 * 1000;
        let startDate = start ? new Date(String(start)) : new Date(now.getTime() + bumpMs);
        if (isNaN(startDate.getTime())) {
            return res.status(400).json({ error: "Invalid 'start' datetime" });
        }

        let endDate;
        if (end) {
            endDate = new Date(String(end));
            if (isNaN(endDate.getTime())) {
                return res.status(400).json({ error: "Invalid 'end' datetime" });
            }
            // } else {
            //   const d = Math.max(1, Math.min(7, parseInt(String(days || 7), 10) || 7)); // clamp 1..7
            //   endDate = new Date(startDate.getTime() + d * 24 * 60 * 60 * 1000);
            // }

            if (endDate <= startDate) {
                return res.status(400).json({ error: "'end' must be after 'start'" });
            }

            // Calendly requires <= 7-day window
            const maxEnd = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            if (endDate > maxEnd) endDate = maxEnd;

            const url = new URL("https://api.calendly.com/event_type_available_times");
            url.searchParams.set("event_type", eventTypeUri);
            url.searchParams.set("start_time", startDate.toISOString());
            url.searchParams.set("end_time", endDate.toISOString());
            url.searchParams.set("timezone", String(timezone));

            // helpful server-side log
            console.log("[availability] →", url.toString());

            const r = await fetch(url.toString(), {
                headers: { Authorization: `Bearer ${TOKEN}` },
            });

            const ct = r.headers.get("content-type") || "";
            const isJson = ct.includes("application/json");
            const body = isJson ? await r.json() : await r.text();

            if (!r.ok) {
                console.error("[Calendly availability error]", r.status, body);
                // Forward Calendly’s error so you see the real reason in the browser
                return res
                    .status(r.status)
                    .json(
                        debug === "1"
                            ? { status: r.status, url: url.toString(), calendly: body }
                            : (isJson ? body : { error: String(body).slice(0, 1000) })
                    );
            }

            return res.json(body); // { collection: [...] }
        }
        // Otherwise: multi-week batching (N windows, each ≤7 days)
    const nWeeks = Math.max(1, parseInt(String(weeks || 1), 10) || 1);
    const requests = [];
    let windowStart = startDate;

    for (let i = 0; i < nWeeks; i++) {
      const windowEnd = new Date(windowStart.getTime() + 7 * 24 * 60 * 60 * 1000);

      const url = new URL("https://api.calendly.com/event_type_available_times");
      url.searchParams.set("event_type", eventTypeUri);
      url.searchParams.set("start_time", windowStart.toISOString());
      url.searchParams.set("end_time", windowEnd.toISOString());
      url.searchParams.set("timezone", timezone);

      requests.push(fetch(url.toString(), { headers: { Authorization: `Bearer ${TOKEN}` } })
        .then(async (r) => {
          const ct = r.headers.get("content-type") || "";
          const body = ct.includes("application/json") ? await r.json() : await r.text();
          if (!r.ok) {
            throw new Error(
              debug === "1"
                ? JSON.stringify({ status: r.status, url: url.toString(), calendly: body })
                : typeof body === "string" ? body : JSON.stringify(body)
            );
          }
          return body;
        }));

      // Next window begins where the last ended
      windowStart = windowEnd;
    }

    const results = await Promise.all(requests);
    const merged = results.flatMap(r => (r?.collection || []));
    return res.json({ collection: merged });
    } catch (err) {
        console.error("🔥 Availability handler crashed:", err);
        return res.status(500).json({ error: "Internal Server Error", detail: String(err) });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
