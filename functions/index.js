// Cloudflare Pages Function — the launch gate for "/".
//
// Serves the teaser before launch and the full site once the clock passes
// 2026-09-29 00:00 IST — decided on Cloudflare's edge (server time), so a
// visitor's device clock can't reveal it early. Same URL either way; no redirect.
//
// Files in this project:
//   functions/index.js   <- this gate (handles "/")
//   teaser.html          <- pre-launch invitation page
//   site.html            <- full product site
export async function onRequest(context) {
  const LAUNCH = Date.parse("2026-09-29T00:00:00+05:30");
  const url = new URL(context.request.url);
  const target = Date.now() >= LAUNCH ? "/site.html" : "/teaser.html";
  const res = await context.env.ASSETS.fetch(new URL(target, url));
  // Re-wrap so we can force no-store: without it, an edge-cached "/" could keep
  // serving the teaser for a while after launch.
  const out = new Response(res.body, res);
  out.headers.set("Cache-Control", "no-store");
  return out;
}
