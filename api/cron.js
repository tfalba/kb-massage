export default function handler(req, res) {
  const authHeader = req.headers?.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end('Unauthorized');
  }

  const serverUrl = process.env.GCAL_SERVER_URL;
  if (!serverUrl) {
    return res.status(500).end('Missing GCAL_SERVER_URL');
  }

  fetch(`${serverUrl.replace(/\\/$/, '')}/gcal/cron/refresh`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GCAL_CRON_SECRET}`,
    },
  })
    .then(async (resp) => {
      const body = await resp.text();
      if (!resp.ok) {
        return res.status(resp.status).end(body || 'Cron refresh failed');
      }
      return res.status(200).end(body || 'OK');
    })
    .catch((err) => {
      return res.status(500).end(`Cron refresh error: ${err?.message || err}`);
    });
}
