/* =========================================================
   IMPAC2 — admin.js (v1.2 PRO / COMPLETO / ACTUALIZADO)
   - ✅ Compatible con tu admin.html actual (IDs iguales)
   - ✅ Sin login / sin PIN
   - ✅ Guarda en localStorage: "impac2_admin_db_v1" (MISMO que app.js)
   - ✅ NO permite guardar productos “vacíos” (evita que “se borre todo” en el catálogo)
   - ✅ Habilita/Deshabilita Eliminar según selección
   - ✅ Status pill (usa window.__adminStatus si existe)
   - ✅ Importa JSON en formatos:
        1) { categories:[], products:[] }
        2) { products:[] }
        3) [ ...products ]
   - ✅ Exporta siempre { categories, products }
   ========================================================= */

const LS_ADMIN = "impac2_admin_db_v1";

/* ---------- helpers ---------- */
const $ = (id) => document.getElementById(id);

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function status(text, type = "") {
  try {
    if (typeof window.__adminStatus === "function") window.__adminStatus(text, type);
  } catch {}
}

function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function clampStr(s, max = 1200) {
  const v = String(s ?? "");
  return v.length > max ? v.slice(0, max) : v;
}

/* ---------- state ---------- */
let DB = { categories: ["Todo"], products: [] };
let selectedId = null;

/* ---------- DOM ---------- */
const tbody = $("tbody");
const qInput = $("q");
const filterCat = $("filterCat");

const formTitle = $("formTitle");

const fId = $("id");
const fName = $("name");
const fCategory = $("category");
const fDesc = $("desc");
const fUses = $("uses");
const fTag = $("tag");
const fWidth = $("width");
const fComp = $("comp");

const vName = $("vName");
const vImg = $("vImg");
const varsBox = $("vars");

const btnSave = $("btnSave");
const btnNew = $("btnNew");
const btnDelete = $("btnDelete");
const btnExport = $("btnExport");
const btnReset = $("btnReset");
const fileImport = $("fileImport");
const btnAddVar = $("btnAddVar");

/* ---------- storage ---------- */
function saveDB() {
  try {
    localStorage.setItem(LS_ADMIN, JSON.stringify(DB));
    status("✅ Guardado", "ok");
  } catch {
    status("⚠️ No se pudo guardar (storage)", "warn");
  }
}

function loadDB() {
  const raw = safeJsonParse(localStorage.getItem(LS_ADMIN) || "null");
  if (raw && typeof raw === "object") {
    DB = sanitizeDB(raw);
    status("🧠 Cargado desde este navegador", "ok");
  } else {
    DB = { categories: ["Todo"], products: [] };
    status("🧠 Listo", "");
  }
}

/* ---------- normalize import formats ---------- */
function normalizeIncomingJson(json) {
  // formats:
  // 1) {categories, products}
  // 2) {products}
  // 3) [ ...products ]
  if (Array.isArray(json)) return { categories: ["Todo"], products: json };
  if (json && typeof json === "object") {
    if (Array.isArray(json.products)) return { categories: json.categories || ["Todo"], products: json.products };
    if (Array.isArray(json.items)) return { categories: json.categories || ["Todo"], products: json.items };
    // fallback
    return { categories: json.categories || ["Todo"], products: [] };
  }
  return { categories: ["Todo"], products: [] };
}

/* ---------- sanitize ---------- */
function sanitizeDB(raw) {
  const normalized = normalizeIncomingJson(raw);

  let products = Array.isArray(normalized.products) ? normalized.products : [];

  products = products
    .filter((p) => p && typeof p === "object")
    .map((p) => {
      const name = String(p.name || "").trim();
      const baseId = String(p.id || "").trim();

      // Si no hay id, lo armamos con name
      const id = slugify(baseId || name);

      const category = String(p.category || "Todo").trim() || "Todo";

      const variants = Array.isArray(p.variants)
        ? p.variants
            .filter((v) => v && typeof v === "object")
            .map((v) => {
              const vname = String(v.name || "").trim();
              const vid = String(v.id || "").trim() || (vname ? `${id}-${slugify(vname)}` : `${id}-var`);
              return {
                id: slugify(vid),
                name: vname,
                img: String(v.img || "").trim(),
              };
            })
            // evita variantes sin nombre e id raros
            .filter((v) => v.id)
        : [];

      return {
        id,
        name: name || "Producto",
        category,
        desc: clampStr(p.desc || ""),
        uses: Array.isArray(p.uses) ? p.uses.map((x) => String(x).trim()).filter(Boolean) : [],
        tag: String(p.tag || "IMPAC2").trim() || "IMPAC2",
        width: String(p.width || "").trim(),
        comp: String(p.comp || "").trim(),
        variants,
      };
    })
    // evitar ids vacíos
    .filter((p) => p.id);

  // dedupe ids (se queda el primero)
  const seen = new Set();
  products = products.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  // categorías
  const cats = new Set(["Todo"]);
  // incluir categorías recibidas, pero limpias
  (Array.isArray(normalized.categories) ? normalized.categories : [])
    .map((c) => String(c || "").trim())
    .filter(Boolean)
    .forEach((c) => cats.add(c));

  products.forEach((p) => cats.add(p.category || "Todo"));

  return {
    categories: Array.from(cats),
    products,
  };
}

/* ---------- UI helpers ---------- */
function setDeleteEnabled(on) {
  if (!btnDelete) return;
  btnDelete.disabled = !on;
}

function setFormMode(mode) {
  // mode: "new" | "edit"
  if (!formTitle) return;
  formTitle.textContent = mode === "edit" ? "Editar producto" : "Nuevo producto";
}

/* ---------- render list ---------- */
function renderList() {
  if (!tbody) return;

  const q = String(qInput?.value || "").trim().toLowerCase();
  const cat = String(filterCat?.value || "Todo");

  let items = DB.products.slice();

  if (cat && cat !== "Todo") items = items.filter((p) => p.category === cat);

  if (q) {
    items = items.filter((p) => `${p.name} ${p.category} ${p.tag}`.toLowerCase().includes(q));
  }

  tbody.innerHTML = items
    .map(
      (p) => `
    <tr data-id="${escapeHtml(p.id)}">
      <td><b>${escapeHtml(p.name)}</b></td>
      <td>${escapeHtml(p.category)}</td>
      <td>${Number(p.variants?.length || 0)}</td>
      <td><span class="pill">${escapeHtml(p.tag || "IMPAC2")}</span></td>
      <td class="actions">
        <button class="btn" data-edit="${escapeHtml(p.id)}" type="button">Editar</button>
      </td>
    </tr>
  `
    )
    .join("");

  tbody.querySelectorAll("[data-edit]").forEach((b) =>
    b.addEventListener("click", () => selectProduct(b.dataset.edit))
  );
}

/* ---------- categories filter ---------- */
function renderCategories() {
  if (!filterCat) return;

  const cats = Array.isArray(DB.categories) ? DB.categories.slice() : ["Todo"];
  if (!cats.includes("Todo")) cats.unshift("Todo");

  // orden simple (Todo primero)
  const rest = cats.filter((c) => c !== "Todo").sort((a, b) => a.localeCompare(b));
  const ordered = ["Todo", ...rest];

  filterCat.innerHTML = ordered.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
}

/* ---------- form ---------- */
function clearForm() {
  selectedId = null;
  if (fId) fId.value = "";
  if (fName) fName.value = "";
  if (fCategory) fCategory.value = "";
  if (fDesc) fDesc.value = "";
  if (fUses) fUses.value = "";
  if (fTag) fTag.value = "IMPAC2";
  if (fWidth) fWidth.value = "";
  if (fComp) fComp.value = "";
  if (varsBox) varsBox.innerHTML = "";
  if (vName) vName.value = "";
  if (vImg) vImg.value = "";

  setDeleteEnabled(false);
  setFormMode("new");
}

function selectProduct(id) {
  const p = DB.products.find((x) => x.id === id);
  if (!p) return;

  selectedId = id;

  if (fId) fId.value = p.id;
  if (fName) fName.value = p.name;
  if (fCategory) fCategory.value = p.category;
  if (fDesc) fDesc.value = p.desc;
  if (fUses) fUses.value = (p.uses || []).join(", ");
  if (fTag) fTag.value = p.tag || "IMPAC2";
  if (fWidth) fWidth.value = p.width || "";
  if (fComp) fComp.value = p.comp || "";

  renderVariants(p.variants || []);
  setDeleteEnabled(true);
  setFormMode("edit");
}

function renderVariants(vars) {
  if (!varsBox) return;

  varsBox.innerHTML = (Array.isArray(vars) ? vars : [])
    .map(
      (v, i) => `
    <div class="pill">
      ${escapeHtml(v.name || v.id || "—")}
      <button type="button" data-del-var="${i}" aria-label="Eliminar variante">✕</button>
    </div>
  `
    )
    .join("");

  varsBox.querySelectorAll("[data-del-var]").forEach((b) =>
    b.addEventListener("click", () => {
      if (!selectedId) return;
      const p = DB.products.find((x) => x.id === selectedId);
      if (!p) return;

      const idx = Number(b.dataset.delVar);
      if (!Number.isFinite(idx)) return;

      p.variants.splice(idx, 1);

      DB = sanitizeDB(DB);
      saveDB();
      renderCategories();
      renderList();
      selectProduct(selectedId);
    })
  );
}

/* ---------- validations ---------- */
function validateBeforeSave(data) {
  // Reglas para evitar “catálogo vacío”:
  // - name obligatorio
  // - id obligatorio (lo generamos si no viene)
  // - category default Todo
  const name = String(data.name || "").trim();
  if (!name) return { ok: false, msg: "Poné un nombre de producto (obligatorio)." };

  const id = slugify(String(data.id || "").trim() || name);
  if (!id) return { ok: false, msg: "ID inválido. Probá con otro nombre." };

  return { ok: true, id };
}

/* ---------- save ---------- */
btnSave?.addEventListener("click", () => {
  const draft = {
    id: (fId?.value || "").trim(),
    name: (fName?.value || "").trim(),
    category: (fCategory?.value || "").trim() || "Todo",
    desc: clampStr(fDesc?.value || ""),
    uses: String(fUses?.value || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean),
    tag: (fTag?.value || "IMPAC2").trim() || "IMPAC2",
    width: (fWidth?.value || "").trim(),
    comp: (fComp?.value || "").trim(),
    variants: [],
  };

  const vr = validateBeforeSave(draft);
  if (!vr.ok) {
    status("⚠️ " + vr.msg, "warn");
    alert(vr.msg);
    return;
  }

  // id final
  const finalId = vr.id;
  draft.id = finalId;

  if (selectedId) {
    const idx = DB.products.findIndex((p) => p.id === selectedId);
    if (idx >= 0) {
      // conservar variantes existentes (si estás editando)
      draft.variants = DB.products[idx].variants || [];
      DB.products[idx] = draft;
    } else {
      DB.products.push(draft);
    }
  } else {
    // si estás creando y el id ya existe, lo editamos en vez de duplicar
    const idx = DB.products.findIndex((p) => p.id === finalId);
    if (idx >= 0) {
      draft.variants = DB.products[idx].variants || [];
      DB.products[idx] = draft;
    } else {
      DB.products.push(draft);
    }
  }

  DB = sanitizeDB(DB);
  saveDB();
  renderCategories();
  renderList();
  selectProduct(finalId);
});

/* ---------- new / delete ---------- */
btnNew?.addEventListener("click", () => {
  clearForm();
  status("🧠 Listo", "");
});

btnDelete?.addEventListener("click", () => {
  if (!selectedId) return;
  if (!confirm("¿Eliminar producto?")) return;

  DB.products = DB.products.filter((p) => p.id !== selectedId);
  DB = sanitizeDB(DB);
  saveDB();
  clearForm();
  renderCategories();
  renderList();
});

/* ---------- variants ---------- */
btnAddVar?.addEventListener("click", () => {
  if (!selectedId) {
    status("⚠️ Guardá el producto primero", "warn");
    alert("Guardá el producto primero");
    return;
  }

  const name = String(vName?.value || "").trim();
  const img = String(vImg?.value || "").trim();

  if (!name) {
    status("⚠️ Poné el nombre del color", "warn");
    return;
  }

  const p = DB.products.find((x) => x.id === selectedId);
  if (!p) return;

  const vid = `${p.id}-${slugify(name)}`;

  // evita duplicados por id de variante
  if ((p.variants || []).some((v) => v.id === vid)) {
    status("⚠️ Ese color ya existe", "warn");
    return;
  }

  p.variants = Array.isArray(p.variants) ? p.variants : [];
  p.variants.push({
    id: vid,
    name,
    img,
  });

  if (vName) vName.value = "";
  if (vImg) vImg.value = "";

  DB = sanitizeDB(DB);
  saveDB();
  renderCategories();
  renderList();
  selectProduct(selectedId);
});

/* ---------- search & filter live ---------- */
qInput?.addEventListener("input", () => renderList());
filterCat?.addEventListener("change", () => renderList());

/* ---------- export ---------- */
btnExport?.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(DB, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "products.json";
  a.click();
  status("⬇️ Exportado", "ok");
});

/* ---------- import ---------- */
fileImport?.addEventListener("change", () => {
  const f = fileImport.files && fileImport.files[0];
  if (!f) return;

  const r = new FileReader();
  r.onload = () => {
    const json = safeJsonParse(String(r.result || ""));
    if (!json) {
      status("⚠️ JSON inválido", "warn");
      alert("El JSON está inválido (no se pudo parsear).");
      return;
    }

    const incoming = normalizeIncomingJson(json);
    DB = sanitizeDB(incoming);
    saveDB();
    renderCategories();
    renderList();
    clearForm();

    status("✅ Importado", "ok");
  };
  r.readAsText(f);

  // permitir reimportar mismo archivo sin refrescar
  try {
    fileImport.value = "";
  } catch {}
});

/* ---------- reset ---------- */
btnReset?.addEventListener("click", () => {
  if (!confirm("¿Borrar todo lo cargado en este navegador y volver al JSON original (catálogo)?")) return;

  try {
    localStorage.removeItem(LS_ADMIN);
  } catch {}

  status("♻️ Reseteado", "ok");
  location.reload();
});

/* ---------- boot ---------- */
(function boot() {
  loadDB();
  renderCategories();
  renderList();
  clearForm();
})();
