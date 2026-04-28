/**
 * Ten Wasp Brewing — Cloudflare Worker entry point
 *
 * Routes:
 *   POST /api/save  → handleSave()  (commits data.json to GitHub)
 *   everything else → static assets (index.html, css, js, data.json, etc.)
 *
 * Secrets set in Cloudflare dashboard (Settings → Variables and Secrets):
 *   ADMIN_PASSWORD  — e.g. wasp2024
 *   GITHUB_TOKEN    — fine-grained PAT with Contents: Read & Write
 */

const GH_OWNER  = 'krugerco';
const GH_REPO   = 'ten-wasp-brewing';
const GH_BRANCH = 'main';
const GH_FILE   = 'data.json';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    /* ── Route /api/save to the save handler ── */
    if (url.pathname === '/api/save') {
      if (request.method === 'OPTIONS') return handleCors();
      if (request.method === 'POST')    return handleSave(request, env);
      return respond({ ok: false, msg: 'Method not allowed.' }, 405);
    }

    /* ── Everything else → serve static files ── */
    return env.ASSETS.fetch(request);
  },
};

/* ────────────────────────────────────────────────────────── */

async function handleSave(request, env) {
  /* Parse body */
  let body;
  try {
    body = await request.json();
  } catch {
    return respond({ ok: false, msg: 'Invalid request.' }, 400);
  }

  /* Verify admin password */
  const expectedPw = env.ADMIN_PASSWORD || 'wasp2024';
  if (!body.password || body.password !== expectedPw) {
    return respond({ ok: false, msg: 'Incorrect password.' }, 401);
  }

  /* Ensure GitHub token is configured */
  const ghToken = env.GITHUB_TOKEN;
  if (!ghToken) {
    return respond({
      ok: false,
      msg: 'GITHUB_TOKEN is not set in Cloudflare environment variables.',
    }, 500);
  }

  /* Push data.json to GitHub */
  const apiUrl = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_FILE}`;
  const headers = {
    Authorization: `Bearer ${ghToken}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': 'TenWasp-CMS/1.0',
  };

  try {
    /* Step 1 — get current file SHA (required by GitHub for updates) */
    const metaRes = await fetch(apiUrl, { headers });
    if (!metaRes.ok) {
      const e = await metaRes.json().catch(() => ({}));
      return respond({ ok: false, msg: `GitHub error ${metaRes.status}: ${e.message || 'check your token'}` }, 502);
    }
    const { sha } = await metaRes.json();

    /* Step 2 — base64-encode the new JSON */
    const jsonStr   = JSON.stringify(body.data, null, 2);
    const content   = btoa(unescape(encodeURIComponent(jsonStr)));
    const commitMsg = `Update site content — ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CT`;

    /* Step 3 — commit the update */
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ message: commitMsg, content, sha, branch: GH_BRANCH }),
    });

    if (putRes.ok) {
      return respond({ ok: true, msg: '✓ Saved! All visitors will see the update in ~30 seconds.' });
    }

    const err = await putRes.json().catch(() => ({}));
    return respond({ ok: false, msg: `Save failed (${putRes.status}): ${err.message || 'unknown error'}` }, 502);

  } catch (e) {
    return respond({ ok: false, msg: `Server error: ${e.message}` }, 500);
  }
}

function handleCors() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function respond(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
