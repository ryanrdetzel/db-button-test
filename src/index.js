import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) =>
  c.html(
    `<!doctype html><title>db-button-test</title><h1>db-button-test</h1><p>Hono on Node, scaffolded by deploymill.</p>`
  )
);

app.get("/healthz", (c) => c.json({ ok: true }));

const port = Number(process.env.PORT) || 3000;
serve({ fetch: app.fetch, port });
console.log(`Listening on :${port}`);
