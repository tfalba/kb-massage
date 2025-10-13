export const API_GCAL =
  import.meta.env.PROD
    // Production: hit your Render server (already includes /gcal prefix)
    ? import.meta.env.VITE_API_GCAL
    // Dev: rely on your Vite proxy mapping /gcal -> localhost server
    : "/gcal";