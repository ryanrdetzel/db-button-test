import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { query } from "./db.js";

const app = new Hono();

const page = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>DB Button Test</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 480px; margin: 4rem auto; padding: 0 1rem; }
    button { font-size: 1.25rem; padding: 0.75rem 1.5rem; cursor: pointer; }
    #count { margin-top: 1rem; color: #555; }
    ul { padding-left: 1.2rem; }
    li { font-family: ui-monospace, monospace; font-size: 0.85rem; }
  </style>
</head>
<body>
  <h1>DB Button Test</h1>
  <button id="btn">Add entry</button>
  <p id="count">loading…</p>
  <h2>Recent entries</h2>
  <ul id="list"></ul>
  <script>
    const btn = document.getElementById('btn');
    const countEl = document.getElementById('count');
    const list = document.getElementById('list');
    async function refresh() {
      const r = await fetch('/entries').then(r => r.json());
      countEl.textContent = r.total + ' total';
      list.innerHTML = r.recent.map(e => '<li>#' + e.id + ' — ' + e.created_at + '</li>').join('');
    }
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      await fetch('/click', { method: 'POST' });
      await refresh();
      btn.disabled = false;
    });
    refresh();
  </script>
</body>
</html>`;

app.get("/", (c) => c.html(page));
app.get("/healthz", (c) => c.json({ ok: true }));

app.get("/db", async (c) => {
  try {
    const r = await query("SELECT 1 AS ok");
    return c.json({ ok: true, result: r.rows[0] });
  } catch (e) {
    return c.json({ ok: false, error: String(e) }, 500);
  }
});

app.post("/click", async (c) => {
  const r = await query(
    "INSERT INTO clicks DEFAULT VALUES RETURNING id, created_at"
  );
  return c.json({ ok: true, entry: r.rows[0] });
});

app.get("/entries", async (c) => {
  const totalR = await query("SELECT count(*)::int AS n FROM clicks");
  const recentR = await query(
    "SELECT id, created_at FROM clicks ORDER BY id DESC LIMIT 10"
  );
  return c.json({
    total: totalR.rows[0].n,
    recent: recentR.rows,
  });
});

const port = Number(process.env.PORT ?? 3000);
serve({ fetch: app.fetch, port });
console.log(`Listening on :${port}`);
