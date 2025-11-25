# KB Massage Studio

Book authentic bodywork sessions, browse the full menu of services, and request calendar slots directly from Google Calendar without ever leaving the browser.

## TL;DR (Short Version)

- Scroll the storytelling homepage to meet Kara, preview services, and watch the accordion galleries glide open.
- Tap the floating “Book Now” tab to open the Event Types drawer, choose 60 or 90 minutes, then pick any available slot from a live Google Calendar feed.
- Booking confirmation hits Google instantly via the embedded server; the experience never leaves the site.
- Built with Vite, React 19, TypeScript, React-Router, Tailwind CSS, and a companion Node/Express Google Calendar microservice. Run `npm install` then `npm run dev`.

## Long Version

### What the App Does

KB Massage Studio is a full booking funnel:

1. **Hero + Storytelling Sections** – Tailwind-powered hero, About, Services, and galleries explain Kara’s philosophy and specialties using responsive cards and accordion imagery.
2. **Event Types Drawer** – A simple button on every page opens the right-side booking drawer. Visitors can toggle between 60- or 90-minute sessions without losing context.
3. **Calendar With Live Slots** – Selecting an event type triggers the availability hook, which fetches `/gcal/availability` from the Express backend. The slot list updates instantly with future openings only.
4. **Booking Modal** – Clicking a slot opens a side modal to capture name, email, and phone. The form posts to `/gcal/book`, and upon success the user sees an alert containing the Google Calendar link.

### Key Features

- **Full Google Calendar integration**: Availability and bookings are synced straight to Kara’s Google Calendar through OAuth2.
- **Retry-aware availability hook**: If the Render server takes a second to wake up, the hook catches the error, waits a moment, and retries automatically with a “waking” experience.
- **Accessibility-friendly modals**: Both Event Types and Booking modals lock focus, set `Modal.setAppElement`, and work on touch/mouse.
- **Mobile-first layout** with Tailwind gradients, animations, and custom keyframes (hero slide, accordion fades, etc.).

### How It Was Built

- **Frontend:** React 19 + Vite + TypeScript for fast iteration, with React Router handling routes (Home, About, Services).
- **Styling:** Tailwind CSS using a custom brand palette (`brand.forest`, `brand.sage`, etc.) plus animation extensions for accordions, reviews, hero banner, and booking panels.
- **State & Hooks:** Custom `useAvailability` hook handles fetching, errors, and retry logic; a simple React context tracks modal state.
- **Backend:** `server-gcal` is an Express app that handles:
  - `/gcal/auth/url` + `/gcal/oauth2callback` for OAuth2 consent.
  - `/gcal/availability` which wraps Google’s `freebusy.query`, applies business-hour rules, buffer windows, and generates stepped slots.
  - `/gcal/book` which creates the calendar event (with summary, attendees, description) and returns Google’s event link.
  - Tokens are persisted to `tokens.json`; the server loads them on boot so requests work immediately.
- **Tooling:** ESLint, TypeScript strictness, PostCSS/Tailwind build pipeline, and `npm run dev` / `npm run server-gcal` for local dual-server dev.

### Getting Started

1. **Install dependencies**

```bash
npm install
```

2. **Configure environment variables**

Frontend (`.env`):

```bash
VITE_API_GCAL=http://localhost:4001/gcal
```

Backend (`server-gcal/.env`):

```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:4001/gcal/oauth2callback
GOOGLE_CALENDAR_ID=your_calendar_id
TIMEZONE=America/New_York
BUSINESS_HOURS_JSON=[{"dow":[1,2,3,4,5],"start":"09:00","end":"17:00"}]
```

3. **Run both servers locally**

```bash
npm run dev
# in another terminal
npm run server-gcal
```

4. **Authorize Google Calendar**
   - Visit `http://localhost:4001/gcal/auth/url` in the browser, follow the Google consent flow, and the backend saves tokens to `server-gcal/tokens.json`.

### Development Notes

- The availability hook automatically retries once with a short delay; this handles Render’s cold-start behavior gracefully.
- All Tailwind classes are inlined across the app to avoid standalone CSS, except for the DayPicker override file (`src/day-picker.css`) and font-face declarations.
- Accordion galleries use custom keyframes for spin and fade animations; ReviewGallery reuses the same structure with Tailwind utilities.
- Booking modal background/gradient matches the Event Types slide-out for brand consistency.

### Roadmap Ideas

- Add move/click counters or timers per session request.
- Hook up transactional emails/SMS after booking via a webhook.
- Allow clients to reschedule directly from the booking modal.
- Extend business hours configuration with a UI inside the dashboard (instead of `.env` JSON).

Enjoy the streamlined Google Calendar booking experience! Feel free to open issues or PRs if you expand the service menu. 
