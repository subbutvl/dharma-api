function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildAdminHtml() {
  const samples = [
    ["deities.sample.csv", "Deities"],
    ["slokas.sample.csv", "Slokas"],
    ["temples.sample.csv", "Temples"],
    ["avatars.sample.csv", "Avatars"],
    ["songs.sample.csv", "Songs"],
    ["festivals.sample.csv", "Festivals"],
    ["mythical-beings.sample.csv", "Mythical beings"],
  ];
  const sampleLinks = samples
    .map(
      ([file, label]) =>
        `<li><a href="/admin/samples/${escapeHtml(file)}" download>${escapeHtml(label)}</a> — <code>${escapeHtml(file)}</code></li>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Dharma API — Data admin</title>
  <style>
    :root {
      --bg: #f1f5f9;
      --surface: #fff;
      --border: #e2e8f0;
      --text: #0f172a;
      --muted: #64748b;
      --accent: #2563eb;
      --warn-bg: #fef3c7;
      --warn: #92400e;
      --font: "Segoe UI", system-ui, sans-serif;
      --mono: ui-monospace, Consolas, monospace;
    }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: var(--font); font-size: 14px; color: var(--text); background: var(--bg); line-height: 1.45; }
    a { color: var(--accent); }
    header {
      background: #0f172a; color: #e2e8f0; padding: 0.75rem 1.25rem;
      display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;
    }
    header h1 { margin: 0; font-size: 1rem; font-weight: 600; }
    header a { color: #93c5fd; }
    .wrap { max-width: 900px; margin: 0 auto; padding: 1rem 1.25rem 2rem; }
    #token-banner {
      display: none; margin-bottom: 1rem; padding: 0.65rem 0.85rem; border-radius: 8px;
      background: var(--warn-bg); color: var(--warn); font-size: 13px;
    }
    #token-banner.show { display: block; }
    .token-row { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; margin-bottom: 1rem; }
    .token-row input { flex: 1; min-width: 200px; padding: 0.45rem 0.6rem; border: 1px solid var(--border); border-radius: 6px; font-family: var(--mono); font-size: 12px; }
    .token-row button { padding: 0.45rem 0.85rem; border-radius: 6px; border: 1px solid var(--border); background: var(--surface); cursor: pointer; }
    .tabs { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 1rem; }
    .tabs button {
      padding: 0.4rem 0.75rem; border: 1px solid var(--border); border-radius: 8px; background: var(--surface);
      cursor: pointer; font-size: 13px;
    }
    .tabs button.active { background: #1e293b; color: #f8fafc; border-color: #1e293b; }
    .panel { display: none; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 1rem 1.1rem; }
    .panel.active { display: block; }
    .panel h2 { margin: 0 0 0.5rem; font-size: 15px; }
    .panel h3 { margin: 1rem 0 0.4rem; font-size: 13px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em; }
    .panel h3:first-of-type { margin-top: 0; }
    .hint { font-size: 12px; color: var(--muted); margin: 0 0 0.75rem; }
    .hint code { font-size: 11px; background: #f1f5f9; padding: 0.1rem 0.35rem; border-radius: 4px; }
    form.grid { display: grid; gap: 0.5rem; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); align-items: end; }
    label { display: flex; flex-direction: column; gap: 0.2rem; font-size: 12px; color: var(--muted); }
    label.full { grid-column: 1 / -1; }
    input, textarea, select { padding: 0.4rem 0.5rem; border: 1px solid var(--border); border-radius: 6px; font: inherit; }
    textarea { min-height: 72px; resize: vertical; }
    .actions { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; }
    .actions button { padding: 0.45rem 1rem; border-radius: 6px; border: none; background: var(--accent); color: #fff; cursor: pointer; font-weight: 500; }
    .actions button.secondary { background: #334155; }
    .out { margin-top: 0.75rem; padding: 0.75rem; background: #0f172a; color: #e2e8f0; border-radius: 8px; font-family: var(--mono); font-size: 11px; white-space: pre-wrap; max-height: 220px; overflow: auto; display: none; }
    .out.show { display: block; }
    .samples { margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border); }
    .samples ul { margin: 0.35rem 0 0; padding-left: 1.2rem; font-size: 13px; }
  </style>
</head>
<body>
  <header>
    <h1>Data admin</h1>
    <a href="/">← Dashboard</a>
  </header>
  <div class="wrap">
    <div id="token-banner"></div>
    <div class="token-row">
      <label style="flex:1;min-width:220px">
        Admin token (<code>x-admin-token</code>)
        <input type="password" id="admin-token" autocomplete="off" placeholder="Set if ADMIN_TOKEN is in .env" />
      </label>
      <button type="button" id="save-token">Remember in browser</button>
    </div>

    <div class="tabs" id="tabs"></div>

    <section class="panel active" data-panel="deities">
      <h2>Deities</h2>
      <p class="hint">CSV columns: <code>slug,name,title,category,aliases,description,description_en,description_ta,affiliation,abode,primary_image_url,attributes_json,relationships_json,worship_json,media_json</code> — use <code>|</code> in <code>aliases</code>. JSON columns optional.</p>
      <h3>Add one</h3>
      <form class="single" data-json="/api/admin/deities">
        <div class="grid">
          <label>slug *<input name="slug" required /></label>
          <label>name *<input name="name" required /></label>
          <label>title<input name="title" /></label>
          <label>category<input name="category" placeholder="deva" /></label>
          <label class="full">aliases (pipe |)<input name="aliases" placeholder="Name1|Name2" /></label>
          <label class="full">description<textarea name="description"></textarea></label>
        </div>
        <div class="actions"><button type="submit">Create deity</button></div>
      </form>
      <h3>Bulk CSV</h3>
      <form class="import" data-import="/api/admin/deities/import" enctype="multipart/form-data">
        <input type="file" name="file" accept=".csv,text/csv" required />
        <div class="actions"><button type="submit">Import CSV</button></div>
      </form>
      <pre class="out"></pre>
    </section>

    <section class="panel" data-panel="slokas">
      <h2>Slokas</h2>
      <p class="hint">CSV: <code>deity_slug,title,sanskrit,transliteration,meaning</code></p>
      <h3>Add one</h3>
      <form class="single" data-json="/api/admin/slokas">
        <div class="grid">
          <label>deitySlug *<select name="deitySlug" id="sloka-deity" required></select></label>
          <label>title<input name="title" /></label>
          <label class="full">sanskrit *<textarea name="sanskrit" required></textarea></label>
          <label class="full">transliteration<textarea name="transliteration"></textarea></label>
          <label class="full">meaning<textarea name="meaning"></textarea></label>
        </div>
        <div class="actions"><button type="submit">Create sloka</button></div>
      </form>
      <h3>Bulk CSV</h3>
      <form class="import" data-import="/api/admin/slokas/import"><input type="file" name="file" accept=".csv,text/csv" required /><div class="actions"><button type="submit">Import CSV</button></div></form>
      <pre class="out"></pre>
    </section>

    <section class="panel" data-panel="temples">
      <h2>Temples</h2>
      <p class="hint">CSV: <code>deity_slug,name,location,significance,latitude,longitude</code></p>
      <h3>Add one</h3>
      <form class="single" data-json="/api/admin/temples">
        <div class="grid">
          <label>deitySlug *<select name="deitySlug" class="deity-select" required></select></label>
          <label>name *<input name="name" required /></label>
          <label>location *<input name="location" required /></label>
          <label class="full">significance<textarea name="significance"></textarea></label>
          <label>latitude<input name="latitude" type="number" step="any" /></label>
          <label>longitude<input name="longitude" type="number" step="any" /></label>
        </div>
        <div class="actions"><button type="submit">Create temple</button></div>
      </form>
      <h3>Bulk CSV</h3>
      <form class="import" data-import="/api/admin/temples/import"><input type="file" name="file" accept=".csv,text/csv" required /><div class="actions"><button type="submit">Import CSV</button></div></form>
      <pre class="out"></pre>
    </section>

    <section class="panel" data-panel="avatars">
      <h2>Avatars</h2>
      <p class="hint">CSV: <code>deity_slug,name,description,tradition</code></p>
      <h3>Add one</h3>
      <form class="single" data-json="/api/admin/avatars">
        <div class="grid">
          <label>deitySlug *<select name="deitySlug" class="deity-select" required></select></label>
          <label>name *<input name="name" required /></label>
          <label>tradition<input name="tradition" /></label>
          <label class="full">description<textarea name="description"></textarea></label>
        </div>
        <div class="actions"><button type="submit">Create avatar</button></div>
      </form>
      <h3>Bulk CSV</h3>
      <form class="import" data-import="/api/admin/avatars/import"><input type="file" name="file" accept=".csv,text/csv" required /><div class="actions"><button type="submit">Import CSV</button></div></form>
      <pre class="out"></pre>
    </section>

    <section class="panel" data-panel="songs">
      <h2>Songs</h2>
      <p class="hint">CSV: <code>deity_slug,title,credit,external_url,license_note</code> — leave deity_slug empty for unlinked songs.</p>
      <h3>Add one</h3>
      <form class="single" data-json="/api/admin/songs">
        <div class="grid">
          <label>deitySlug (optional)<select name="deitySlug" class="deity-select-optional"><option value="">— none —</option></select></label>
          <label>title *<input name="title" required /></label>
          <label>credit<input name="credit" /></label>
          <label class="full">externalUrl *<input name="externalUrl" required placeholder="https://..." /></label>
          <label class="full">licenseNote<textarea name="licenseNote"></textarea></label>
        </div>
        <div class="actions"><button type="submit">Create song</button></div>
      </form>
      <h3>Bulk CSV</h3>
      <form class="import" data-import="/api/admin/songs/import"><input type="file" name="file" accept=".csv,text/csv" required /><div class="actions"><button type="submit">Import CSV</button></div></form>
      <pre class="out"></pre>
    </section>

    <section class="panel" data-panel="festivals">
      <h2>Festivals</h2>
      <p class="hint">CSV: <code>slug,name,description,deity_slugs</code> — <code>deity_slugs</code> uses <code>|</code> between existing deity slugs.</p>
      <h3>Add one</h3>
      <form class="single" data-json="/api/admin/festivals">
        <div class="grid">
          <label>slug *<input name="slug" required /></label>
          <label>name *<input name="name" required /></label>
          <label class="full">description<textarea name="description"></textarea></label>
          <label class="full">deitySlugs (pipe |)<input name="deitySlugs" placeholder="shiva|ganesha" /></label>
        </div>
        <div class="actions"><button type="submit">Create festival</button></div>
      </form>
      <h3>Bulk CSV</h3>
      <form class="import" data-import="/api/admin/festivals/import"><input type="file" name="file" accept=".csv,text/csv" required /><div class="actions"><button type="submit">Import CSV</button></div></form>
      <pre class="out"></pre>
    </section>

    <section class="panel" data-panel="mythical">
      <h2>Mythical beings</h2>
      <p class="hint">CSV: <code>slug,name,kind,description,lore_json</code></p>
      <h3>Add one</h3>
      <form class="single" data-json="/api/admin/mythical-beings">
        <div class="grid">
          <label>slug *<input name="slug" required /></label>
          <label>name *<input name="name" required /></label>
          <label>kind *<input name="kind" required placeholder="asura / naga / yaksha …" /></label>
          <label class="full">description<textarea name="description"></textarea></label>
          <label class="full">lore JSON (optional)<textarea name="lore_json" placeholder="{&quot;k&quot;:&quot;v&quot;}"></textarea></label>
        </div>
        <div class="actions"><button type="submit">Create mythical being</button></div>
      </form>
      <h3>Bulk CSV</h3>
      <form class="import" data-import="/api/admin/mythical-beings/import"><input type="file" name="file" accept=".csv,text/csv" required /><div class="actions"><button type="submit">Import CSV</button></div></form>
      <pre class="out"></pre>
    </section>

    <div class="samples">
      <h2 style="font-size:14px;margin:0 0 0.35rem">Sample CSV files</h2>
      <p class="hint">Use UTF-8. For JSON inside CSV, double quotes per RFC 4180 (<code>""</code> for a quote).</p>
      <ul>${sampleLinks}</ul>
    </div>
  </div>
  <script>
(function () {
  var tabsEl = document.getElementById("tabs");
  var panels = [].slice.call(document.querySelectorAll(".panel"));
  var tabDefs = [
    { id: "deities", label: "Deities" },
    { id: "slokas", label: "Slokas" },
    { id: "temples", label: "Temples" },
    { id: "avatars", label: "Avatars" },
    { id: "songs", label: "Songs" },
    { id: "festivals", label: "Festivals" },
    { id: "mythical", label: "Mythical" }
  ];
  tabDefs.forEach(function (t, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = t.label;
    b.setAttribute("data-tab", t.id);
    if (i === 0) b.classList.add("active");
    b.addEventListener("click", function () {
      [].forEach.call(tabsEl.querySelectorAll("button"), function (x) {
        x.classList.toggle("active", x === b);
      });
      panels.forEach(function (p) {
        p.classList.toggle("active", p.getAttribute("data-panel") === t.id);
      });
    });
    tabsEl.appendChild(b);
  });

  var TOKEN_KEY = "dharma_admin_token";
  var inp = document.getElementById("admin-token");
  inp.value = localStorage.getItem(TOKEN_KEY) || "";
  document.getElementById("save-token").addEventListener("click", function () {
    localStorage.setItem(TOKEN_KEY, inp.value.trim());
  });

  function headersJson() {
    var h = { "Content-Type": "application/json" };
    var t = inp.value.trim();
    if (t) h["x-admin-token"] = t;
    return h;
  }
  function headersForm() {
    var h = {};
    var t = inp.value.trim();
    if (t) h["x-admin-token"] = t;
    return h;
  }

  function showOut(panel, text) {
    var pre = panel.querySelector(".out");
    pre.textContent = text;
    pre.classList.add("show");
  }

  fetch("/api/admin/status")
    .then(function (r) {
      return r.json();
    })
    .then(function (j) {
      var need = j && j.data && j.data.tokenRequired;
      var el = document.getElementById("token-banner");
      if (need) {
        el.textContent = "Server has ADMIN_TOKEN set — paste the same value above and click Remember, or add x-admin-token on each request.";
        el.classList.add("show");
      }
    })
    .catch(function () {});

  function fillDeitySelects(rows) {
    var opts = rows
      .map(function (d) {
        return '<option value="' + d.slug.replace(/"/g, "&quot;") + '">' + d.name + " (" + d.slug + ")</option>";
      })
      .join("");
    document.querySelectorAll(".deity-select, #sloka-deity").forEach(function (sel) {
      sel.innerHTML = '<option value="">— pick —</option>' + opts;
    });
    document.querySelectorAll(".deity-select-optional").forEach(function (sel) {
      sel.innerHTML = '<option value="">— none —</option>' + opts;
    });
  }

  fetch("/api/deities?limit=500")
    .then(function (r) {
      return r.json();
    })
    .then(function (j) {
      if (j && j.success && Array.isArray(j.data)) fillDeitySelects(j.data);
    })
    .catch(function () {});

  document.querySelectorAll("form.single").forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var panel = form.closest(".panel");
      var url = form.getAttribute("data-json");
      var fd = new FormData(form);
      var body = {};
      fd.forEach(function (v, k) {
        if (k === "deitySlug" && v === "") return;
        body[k] = v;
      });
      if (body.aliases && typeof body.aliases === "string") {
        body.aliases = body.aliases.split("|").map(function (s) {
          return s.trim();
        }).filter(Boolean);
      }
      fetch(url, { method: "POST", headers: headersJson(), body: JSON.stringify(body) })
        .then(function (r) {
          return r.text().then(function (t) {
            return { ok: r.ok, t: t };
          });
        })
        .then(function (x) {
          try {
            showOut(panel, JSON.stringify(JSON.parse(x.t), null, 2));
          } catch (e) {
            showOut(panel, x.t);
          }
        })
        .catch(function (e) {
          showOut(panel, String(e.message || e));
        });
    });
  });

  document.querySelectorAll("form.import").forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var panel = form.closest(".panel");
      var url = form.getAttribute("data-import");
      var fd = new FormData(form);
      fetch(url, { method: "POST", headers: headersForm(), body: fd })
        .then(function (r) {
          return r.text().then(function (t) {
            return { ok: r.ok, t: t };
          });
        })
        .then(function (x) {
          try {
            showOut(panel, JSON.stringify(JSON.parse(x.t), null, 2));
          } catch (e) {
            showOut(panel, x.t);
          }
        })
        .catch(function (e) {
          showOut(panel, String(e.message || e));
        });
    });
  });
})();
  </script>
</body>
</html>`;
}

module.exports = { buildAdminHtml };
