// Netlify Function (v2 format).
// Runs on Netlify's server only — never in the visitor's browser —
// so the API key stays hidden. Set as TD_KEY in
// Project configuration -> Environment variables (never in this file).

export default async (req, context) => {
  const key = process.env.TD_KEY;

  if (!key) {
    return new Response(JSON.stringify({ status: "error", message: "TD_KEY environment variable is not set on the server." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  const url = new URL(req.url);
  const symbols = url.searchParams.get("symbols");

  if (!symbols) {
    return new Response(JSON.stringify({ status: "error", message: "Missing symbols query parameter." }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const tdUrl = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbols)}&apikey=${encodeURIComponent(key)}`;

  try {
    const r = await fetch(tdUrl);
    const data = await r.json();
    return new Response(JSON.stringify(data), {
      status: r.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ status: "error", message: "Upstream fetch failed: " + err.message }), {
      status: 502,
      headers: { "Content-Type": "application/json" }
    });
  }
};
