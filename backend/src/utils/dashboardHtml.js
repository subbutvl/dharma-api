/**
 * @param {{ paths?: Record<string, Record<string, { summary?: string }>>, info?: { title?: string, version?: string } }} spec
 */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildDashboardHtml(spec) {
  const title =
    spec && spec.info && typeof spec.info.title === "string"
      ? spec.info.title
      : "Dharma API";
  const version =
    spec && spec.info && typeof spec.info.version === "string"
      ? spec.info.version
      : "—";

  const rows = [];
  if (spec && typeof spec.paths === "object") {
    for (const [p, methods] of Object.entries(spec.paths)) {
      if (!methods || typeof methods !== "object") {
        continue;
      }
      for (const [method, def] of Object.entries(methods)) {
        if (method === "parameters" || typeof def !== "object") {
          continue;
        }
        if (String(method).toLowerCase() !== "get") {
          continue;
        }
        const summary = typeof def.summary === "string" ? def.summary : "";
        rows.push({ path: p, summary });
      }
    }
    rows.sort((a, b) => a.path.localeCompare(b.path));
  }

  const routeRows =
    rows.length > 0
      ? rows
          .map((r) => {
            const pathEsc = escapeHtml(r.path);
            const summaryEsc = escapeHtml(r.summary);
            const hasTemplate = /\{[^}]+\}/.test(r.path);
            const pathCell = hasTemplate
              ? `<span class="mono" title="Path parameters — use Swagger or substitute values (e.g. a deity slug).">${pathEsc}</span>`
              : `<a class="route-fetch mono" href="${pathEsc}">${pathEsc}</a>`;
            return `<tr><td>${pathCell}</td><td class="muted">${summaryEsc}</td></tr>`;
          })
          .join("")
      : `<tr><td colspan="2" class="muted">No OpenAPI paths loaded.</td></tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${escapeHtml(title)} — Dashboard</title>
  <style>
    :root {
      color-scheme: only light;
      --bg: #f1f5f9;
      --surface: #ffffff;
      --topbar: #0f172a;
      --topbar-muted: #94a3b8;
      --border: #e2e8f0;
      --text: #0f172a;
      --muted: #64748b;
      --accent: #2563eb;
      --accent-hover: #1d4ed8;
      --success: #16a34a;
      --success-bg: #dcfce7;
      --danger: #dc2626;
      --danger-bg: #fee2e2;
      --shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
      --shadow-md: 0 4px 14px rgba(15, 23, 42, 0.08);
      --radius: 10px;
      --font: "Segoe UI", system-ui, -apple-system, Roboto, sans-serif;
      --mono: ui-monospace, "Cascadia Code", "SF Mono", Consolas, monospace;
      --drawer-w: 700px;
    }
    * { box-sizing: border-box; }
    html { height: 100%; }
    body {
      margin: 0; font-family: var(--font); font-size: 14px; line-height: 1.5; color: var(--text);
      background: var(--bg); height: 100%; overflow: hidden;
      display: flex; flex-direction: column;
    }
    a { color: var(--accent); text-decoration: none; }
    a:hover { color: var(--accent-hover); text-decoration: underline; }

    .topbar {
      background: var(--topbar);
      color: #f8fafc;
      padding: 0 1.5rem;
      height: 52px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: var(--shadow-md);
    }
    .topbar-brand { display: flex; align-items: center; gap: 0.65rem; font-weight: 600; letter-spacing: -0.02em; }
    .topbar-brand .mark {
      width: 8px; height: 8px; border-radius: 50%; background: var(--success);
      box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.35);
    }
    .topbar-meta { font-size: 12px; color: var(--topbar-muted); }
    .topbar-meta strong { color: #e2e8f0; font-weight: 500; }

    .wrap {
      flex: 1;
      min-height: 0;
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;
      padding: 1.25rem 1.5rem 1rem;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .page-title {
      font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;
      color: var(--muted); margin: 0 0 1rem;
      flex-shrink: 0;
    }

    .stats { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.25rem; flex-shrink: 0; }
    .stat {
      background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
      padding: 0.65rem 1rem; box-shadow: var(--shadow); display: flex; align-items: center; gap: 0.5rem;
    }
    .stat-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em; }
    .stat-value { font-weight: 600; color: var(--text); }
    .pill {
      display: inline-flex; align-items: center; gap: 0.35rem; font-size: 12px; font-weight: 600;
      color: var(--success); background: var(--success-bg); padding: 0.2rem 0.55rem; border-radius: 999px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 0.85rem;
      margin-bottom: 1rem;
      flex-shrink: 0;
    }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1rem 1.1rem;
      box-shadow: var(--shadow);
      transition: box-shadow 0.15s, border-color 0.15s;
      text-align: left;
      font: inherit;
      color: inherit;
      cursor: pointer;
      width: 100%;
    }
    .card:hover { box-shadow: var(--shadow-md); border-color: #cbd5e1; }
    .card:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    a.card.card-link {
      display: block;
      text-decoration: none;
      color: inherit;
    }
    a.card.card-link:hover { color: inherit; text-decoration: none; }
    .card-title {
      font-weight: 600; font-size: 15px; margin: 0 0 0.25rem;
      display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;
    }
    .card-title .arrow { color: var(--muted); font-size: 18px; font-weight: 400; }
    .card-desc { font-size: 12px; color: var(--muted); margin: 0; line-height: 1.45; }
    .card-path { margin-top: 0.5rem; font-family: var(--mono); font-size: 11px; color: var(--accent); word-break: break-all; }

    .panel {
      background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
      box-shadow: var(--shadow); overflow: hidden;
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }
    .panel-head {
      padding: 0.75rem 1rem; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.35rem 1rem;
      background: linear-gradient(180deg, #fafbfc 0%, #f8fafc 100%);
      flex-shrink: 0;
    }
    .panel-head h2 { margin: 0; font-size: 14px; font-weight: 600; }
    .panel-head .sub { font-size: 11px; color: var(--muted); }
    .table-wrap {
      flex: 1;
      min-height: 120px;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
    }
    table.routes { width: 100%; border-collapse: collapse; font-size: 13px; }
    table.routes th {
      text-align: left; padding: 0.5rem 1rem; font-size: 11px; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.05em; color: var(--muted); background: #f8fafc; border-bottom: 1px solid var(--border);
      position: sticky; top: 0; z-index: 1;
      box-shadow: 0 1px 0 var(--border);
    }
    table.routes td { padding: 0.55rem 1rem; border-bottom: 1px solid var(--border); vertical-align: top; }
    table.routes tr:last-child td { border-bottom: none; }
    table.routes tr:hover td { background: #fafbfc; }
    table.routes a.route-fetch {
      font-weight: 500; color: var(--accent); text-decoration: none; word-break: break-all;
    }
    table.routes a.route-fetch:hover { color: var(--accent-hover); text-decoration: underline; }
    .mono { font-family: var(--mono); font-size: 12px; color: #0f172a; }
    .muted { color: var(--muted); }
    .dashboard-hint { flex-shrink: 0; margin: -0.5rem 0 0.75rem; font-size: 12px; }

    .foot {
      flex-shrink: 0;
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border);
      font-size: 12px; color: var(--muted); text-align: center;
    }
    .foot a.link {
      color: var(--accent);
      font-weight: 500;
    }
    .foot a.link:hover { color: var(--accent-hover); }

    /* Drawer */
    .drawer-backdrop {
      position: fixed; inset: 0; background: rgba(15, 23, 42, 0.45);
      opacity: 0; pointer-events: none; transition: opacity 0.2s ease;
      z-index: 1000;
    }
    .drawer-backdrop.open { opacity: 1; pointer-events: auto; }
    .drawer {
      position: fixed; top: 0; right: 0; bottom: 0; width: var(--drawer-w); max-width: 100vw;
      background: #fff; box-shadow: -12px 0 32px rgba(15, 23, 42, 0.15);
      transform: translateX(100%); transition: transform 0.28s ease;
      z-index: 1001;
      display: flex; flex-direction: column;
      border-left: 1px solid var(--border);
    }
    .drawer.open { transform: translateX(0); }
    .drawer-head {
      flex-shrink: 0; padding: 0.65rem 1rem;
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;
      background: linear-gradient(180deg, #fff 0%, #f8fafc 100%);
    }
    .drawer-head h2 { margin: 0; font-size: 15px; font-weight: 600; }
    .drawer-head .hint { font-size: 11px; color: var(--muted); }
    .drawer-close {
      border: 1px solid var(--border); background: #fff; border-radius: 8px;
      width: 36px; height: 36px; cursor: pointer; font-size: 18px; line-height: 1; color: var(--muted);
    }
    .drawer-close:hover { background: #f1f5f9; color: var(--text); }
    .drawer-body { flex: 1; min-height: 0; position: relative; background: #fafafa; }
    .drawer-body pre.json-view {
      position: absolute; inset: 0; margin: 0; overflow: auto; padding: 1rem 1.1rem;
      font-family: var(--mono); font-size: 12px; line-height: 1.45; color: #0f172a; background: #f8fafc;
      border: none; white-space: pre;
    }

    /* Modal */
    .modal-backdrop {
      position: fixed; inset: 0; background: rgba(15, 23, 42, 0.45);
      opacity: 0; pointer-events: none; transition: opacity 0.2s ease;
      z-index: 1100; display: flex; align-items: center; justify-content: center; padding: 1rem;
    }
    .modal-backdrop.open { opacity: 1; pointer-events: auto; }
    .modal {
      background: #fff; border-radius: var(--radius); max-width: 440px; width: 100%;
      box-shadow: 0 20px 50px rgba(15, 23, 42, 0.2); border: 1px solid var(--border);
      max-height: min(80vh, 520px); display: flex; flex-direction: column;
    }
    .modal-head {
      padding: 0.75rem 1rem; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;
    }
    .modal-head h2 { margin: 0; font-size: 16px; font-weight: 600; }
    .modal-body { padding: 1rem; overflow: auto; flex: 1; }
    table.kv { width: 100%; border-collapse: collapse; font-size: 14px; }
    table.kv th {
      text-align: left; font-weight: 600; color: var(--muted); width: 42%;
      padding: 0.4rem 0.5rem 0.4rem 0; vertical-align: top; border: none;
    }
    table.kv td { padding: 0.4rem 0; vertical-align: top; border: none; }
    .badge-ok { display: inline-block; padding: 0.15rem 0.5rem; border-radius: 6px; font-size: 12px; font-weight: 600; background: var(--success-bg); color: var(--success); }
    .badge-bad { display: inline-block; padding: 0.15rem 0.5rem; border-radius: 6px; font-size: 12px; font-weight: 600; background: var(--danger-bg); color: var(--danger); }
    .modal-msg { margin: 0.5rem 0 0; font-size: 13px; color: var(--muted); }
  </style>
</head>
<body>
  <header class="topbar">
    <div class="topbar-brand">
      <span class="mark" aria-hidden="true"></span>
      <span>${escapeHtml(title)}</span>
    </div>
    <div class="topbar-meta">OpenAPI <strong>${escapeHtml(version)}</strong> · Backend dashboard</div>
  </header>

  <div class="wrap">
    <p class="page-title">Overview</p>

    <div class="stats">
      <div class="stat">
        <span class="pill"><span aria-hidden="true">●</span> Online</span>
        <div>
          <div class="stat-label">Process</div>
          <div class="stat-value">HTTP server</div>
        </div>
      </div>
      <div class="stat">
        <div>
          <div class="stat-label">Spec</div>
          <div class="stat-value">${rows.length} GET routes</div>
        </div>
      </div>
    </div>

    <p class="page-title" style="margin-top:0.25rem">Shortcuts</p>
    <p class="muted dashboard-hint">Swagger opens in a <strong>new tab</strong>. OpenAPI JSON and <strong>route responses</strong> (click a path in the table below) use the side panel. Health &amp; meta use readable dialogs.</p>
    <div class="grid">
      <a class="card card-link" href="/api-docs" target="_blank" rel="noopener noreferrer">
        <div class="card-title">Swagger UI <span class="arrow">↗</span></div>
        <p class="card-desc">Full interactive docs (default Swagger UI) in a new browser tab.</p>
        <div class="card-path">/api-docs</div>
      </a>
      <button type="button" class="card" id="btn-openapi" data-action="openapi">
        <div class="card-title">OpenAPI JSON <span class="arrow">→</span></div>
        <p class="card-desc">Pretty-printed spec in the side panel (same width).</p>
        <div class="card-path">/openapi.json</div>
      </button>
      <button type="button" class="card" id="btn-health" data-action="health">
        <div class="card-title">Database health <span class="arrow">→</span></div>
        <p class="card-desc">Connection status in a short summary dialog.</p>
        <div class="card-path">/health/db</div>
      </button>
      <button type="button" class="card" id="btn-meta" data-action="meta">
        <div class="card-title">Runtime meta <span class="arrow">→</span></div>
        <p class="card-desc">Storage and config fields in a readable dialog.</p>
        <div class="card-path">/api/meta</div>
      </button>
      <a class="card card-link" href="/admin">
        <div class="card-title">Data admin <span class="arrow">→</span></div>
        <p class="card-desc">Add deities, slokas, temples, and more — one record or CSV bulk. Sample CSVs under <code>/admin/samples/</code>.</p>
        <div class="card-path">/admin</div>
      </a>
    </div>

    <div class="panel">
      <div class="panel-head">
        <h2>API routes</h2>
        <span class="sub">GET only · click a path (without <code>{params}</code>) to load the response in the side drawer · <a href="/v1/deities">/v1/*</a> mirrors <code>/api</code></span>
      </div>
      <div class="table-wrap">
        <table class="routes">
          <thead><tr><th style="width:42%">Path</th><th>Summary</th></tr></thead>
          <tbody>${routeRows}</tbody>
        </table>
      </div>
    </div>

    <footer class="foot">
      ${escapeHtml(title)} · Light dashboard ·
      <a class="link" href="/api-docs" target="_blank" rel="noopener noreferrer">Open Swagger in new tab</a>
    </footer>
  </div>

  <div class="drawer-backdrop" id="drawer-backdrop" aria-hidden="true"></div>
  <aside class="drawer" id="drawer" aria-hidden="true" aria-labelledby="drawer-title-text">
    <div class="drawer-head">
      <div>
        <h2 id="drawer-title-text">Panel</h2>
        <div class="hint" id="drawer-hint">700px · light mode</div>
      </div>
      <button type="button" class="drawer-close" id="drawer-close" aria-label="Close panel">×</button>
    </div>
    <div class="drawer-body">
      <pre class="json-view" id="drawer-json" hidden></pre>
    </div>
  </aside>

  <div class="modal-backdrop" id="modal-backdrop" aria-hidden="true">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title-text">
      <div class="modal-head">
        <h2 id="modal-title-text">Dialog</h2>
        <button type="button" class="drawer-close" id="modal-close" aria-label="Close dialog">×</button>
      </div>
      <div class="modal-body" id="modal-body"></div>
    </div>
  </div>

  <script>
(function () {
  var drawer = document.getElementById("drawer");
  var drawerBackdrop = document.getElementById("drawer-backdrop");
  var drawerJson = document.getElementById("drawer-json");
  var drawerTitle = document.getElementById("drawer-title-text");
  var drawerHint = document.getElementById("drawer-hint");
  var drawerClose = document.getElementById("drawer-close");

  var modalBackdrop = document.getElementById("modal-backdrop");
  var modalBody = document.getElementById("modal-body");
  var modalTitle = document.getElementById("modal-title-text");
  var modalClose = document.getElementById("modal-close");

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    drawerBackdrop.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    drawerBackdrop.setAttribute("aria-hidden", "true");
    drawerJson.hidden = true;
    drawerJson.textContent = "";
  }

  function openOpenApiDrawer() {
    drawerBackdrop.classList.add("open");
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    drawerBackdrop.setAttribute("aria-hidden", "false");
    drawerHint.textContent = "700px side panel";
    drawerTitle.textContent = "OpenAPI JSON";
    drawerJson.hidden = false;
    drawerJson.textContent = "Loading…";
    fetch("/openapi.json")
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (j) {
        drawerHint.textContent = "700px · OpenAPI 3";
        drawerJson.textContent = JSON.stringify(j, null, 2);
      })
      .catch(function (e) {
        drawerHint.textContent = "Could not load spec";
        drawerJson.textContent = "Could not load spec: " + String(e.message || e);
      });
  }

  function openRouteDrawer(path) {
    drawerBackdrop.classList.add("open");
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    drawerBackdrop.setAttribute("aria-hidden", "false");
    drawerHint.textContent = "Loading…";
    drawerTitle.textContent = "GET " + path;
    drawerJson.hidden = false;
    drawerJson.textContent = "Loading…";

    fetch(path, { credentials: "same-origin" })
      .then(function (r) {
        var ct = (r.headers.get("content-type") || "").split(";")[0].trim();
        return r.text().then(function (text) {
          return { ok: r.ok, status: r.status, ct: ct, text: text };
        });
      })
      .then(function (x) {
        drawerHint.textContent = x.status + (x.ct ? " · " + x.ct : "");
        var body = x.text;
        var trimmed = body.replace(/^\\s+/, "");
        var looksJson =
          x.ct.indexOf("json") !== -1 || trimmed.charAt(0) === "{" || trimmed.charAt(0) === "[";
        if (looksJson) {
          try {
            drawerJson.textContent = JSON.stringify(JSON.parse(body), null, 2);
            return;
          } catch (e) {}
        }
        drawerJson.textContent = body || (x.ok ? "(empty body)" : "");
      })
      .catch(function (e) {
        drawerHint.textContent = "Request failed";
        drawerJson.textContent = String(e.message || e);
      });
  }

  function closeModal() {
    modalBackdrop.classList.remove("open");
    modalBackdrop.setAttribute("aria-hidden", "true");
    modalBody.innerHTML = "";
  }

  function kvTable(rows) {
    var html = '<table class="kv">';
    for (var i = 0; i < rows.length; i++) {
      html += "<tr><th>" + esc(rows[i][0]) + "</th><td>" + rows[i][1] + "</td></tr>";
    }
    html += "</table>";
    return html;
  }

  function formatHealthHtml(data) {
    var rows = [];
    if (data && data.ok === true) {
      rows.push(["Overall", '<span class="badge-ok">Healthy</span>']);
      rows.push(["Database", esc(data.database || "connected")]);
      rows.push(["Meaning", "The API can run SQL against your Postgres database."]);
      return kvTable(rows);
    }
    rows.push(["Overall", '<span class="badge-bad">Problem</span>']);
    rows.push(["Database state", esc((data && data.database) || "error")]);
    if (data && data.message) {
      rows.push(["Detail", esc(data.message)]);
    }
    rows.push(["What to check", "DATABASE_URL / DIRECT_URL, Supabase status, and network access."]);
    return kvTable(rows);
  }

  function formatMetaHtml(data) {
    var rows = [];
    if (!data) {
      rows.push(["Result", '<span class="badge-bad">No response</span>']);
      return kvTable(rows);
    }
    if (data.success !== true) {
      rows.push(["Result", '<span class="badge-bad">Unexpected shape</span>']);
      rows.push([
        "Raw",
        '<pre class="mono" style="white-space:pre-wrap;font-size:11px">' +
          esc(JSON.stringify(data)) +
          "</pre>",
      ]);
      return kvTable(rows);
    }
    var d = data.data || {};
    var bucket = d.storageBucket;
    rows.push(["Storage bucket", bucket == null ? '<span class="muted">Not configured</span> (set <code>SUPABASE_STORAGE_BUCKET</code> in <code>.env</code>)' : esc(bucket)]);
    rows.push(["Note", "This endpoint exposes non-secret public config only."]);
    return kvTable(rows);
  }

  function openModal(title, innerHtml) {
    modalTitle.textContent = title;
    modalBody.innerHTML = innerHtml;
    modalBackdrop.classList.add("open");
    modalBackdrop.setAttribute("aria-hidden", "false");
  }

  function openHealthDialog() {
    modalTitle.textContent = "Database health";
    modalBody.innerHTML = '<p class="muted modal-msg">Checking…</p>';
    modalBackdrop.classList.add("open");
    modalBackdrop.setAttribute("aria-hidden", "false");
    fetch("/health/db")
      .then(function (r) {
        return r.json().then(function (j) {
          return { ok: r.ok, status: r.status, body: j };
        });
      })
      .then(function (x) {
        var body = x.body || {};
        if (!x.ok) {
          modalBody.innerHTML = formatHealthHtml(body);
          return;
        }
        modalBody.innerHTML = formatHealthHtml(body);
      })
      .catch(function (e) {
        modalBody.innerHTML = kvTable([
          ["Overall", '<span class="badge-bad">Request failed</span>'],
          ["Detail", esc(String(e.message || e))],
        ]);
      });
  }

  function openMetaDialog() {
    modalTitle.textContent = "Runtime meta";
    modalBody.innerHTML = '<p class="muted modal-msg">Loading…</p>';
    modalBackdrop.classList.add("open");
    modalBackdrop.setAttribute("aria-hidden", "false");
    fetch("/api/meta")
      .then(function (r) {
        return r.json();
      })
      .then(function (j) {
        modalBody.innerHTML = formatMetaHtml(j);
      })
      .catch(function (e) {
        modalBody.innerHTML = kvTable([
          ["Result", '<span class="badge-bad">Request failed</span>'],
          ["Detail", esc(String(e.message || e))],
        ]);
      });
  }

  function onShortcut(ev) {
    var t = ev.currentTarget;
    var action = t.getAttribute("data-action");
    if (action === "openapi") openOpenApiDrawer();
    else if (action === "health") openHealthDialog();
    else if (action === "meta") openMetaDialog();
  }

  document.getElementById("btn-openapi").addEventListener("click", onShortcut);
  document.getElementById("btn-health").addEventListener("click", onShortcut);
  document.getElementById("btn-meta").addEventListener("click", onShortcut);

  var routesTbody = document.querySelector("table.routes tbody");
  if (routesTbody) {
    routesTbody.addEventListener("click", function (ev) {
      var a = ev.target.closest("a.route-fetch");
      if (!a || !routesTbody.contains(a)) return;
      if (ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey) return;
      if (typeof ev.button === "number" && ev.button !== 0) return;
      ev.preventDefault();
      var path = a.getAttribute("href");
      if (!path) return;
      openRouteDrawer(path);
    });
  }

  drawerClose.addEventListener("click", closeDrawer);
  drawerBackdrop.addEventListener("click", closeDrawer);
  modalClose.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", function (e) {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeDrawer();
      closeModal();
    }
  });
})();
  </script>
</body>
</html>`;
}

module.exports = { buildDashboardHtml };
