/* =========================================================
   IMPAC2 — app.js (COMPLETO / ACTUALIZADO PRO v1.0.7 FIX)
   - ✅ FIX: si el HTML NO trae los <dialog>, los inyecta (producto + carrito)
   - ✅ FIX: el color elegido se muestra ARRIBA (mSub + mHeroName + badge)
   - ✅ FIX: carrito abre siempre (btnBasket + mCart + toast action)
   - ✅ FIX: variantes clickeables siempre (delegación + render correcto)
   - ✅ FIX REAL: LS admin inválido NO pisa products.json (merge)
   ========================================================= */

/* ========= CONFIG ========= */
const APP_VERSION = "1.0.7";
const WHATSAPP_NUMBER = "5491140751630";

const PDF_CANDIDATES = ["./catalogo-impac2.pdf", "./catalogo.pdf"];
const DATA_PRODUCTS = "./data/products.json";
const DATA_PAGES = "./data/pages.json";

/* ========= HOME IMAGES (LOCAL) ========= */
const HOME_USE_IMAGES = {
  tapiceria: "./assets/home/tapiceria.jpeg",
  cortinas: "./assets/home/cortinas.jpeg",
  marroquineria: "./assets/home/marroquineria.jpeg",
};

/* ========= STORAGE KEYS ========= */
const LS_ADMIN_DB = "impac2_admin_db_v1"; // panel admin (localStorage)
const LS_PAGE = "impac2_mag_page";
const LS_MODE = "impac2_mag_mode";
const LS_VER = "impac2_ver";

/* ========= i18n (EMBEBIDO / OCULTO) ========= */
const LS_LANG = "impac2_lang";
const SUPPORTED_LANGS = ["es", "en"];

const I18N = {
  es: {
    "home.title": "Elegí la tela",
    "home.subtitle": "¿Para qué la necesitás?",
    "home.cta.category": "Ver categoría",
    "home.cta.mag": "Ver revista",
    "home.tip": "Tip: tocá una tela → elegí el color → “Agregar a mi lista”.",
    "home.featured": "Destacados",
    "home.noFeatured": "No hay destacados todavía.",
    "home.pdf": "Catálogo (PDF)",
    "home.cart": "Carrito 🛒",
    "home.wa": "WhatsApp",

    "products.title": "Productos",
    "products.subtitle": "Buscá por tela, uso o color",
    "products.noResults.title": "Sin resultados",
    "products.noResults.text": "Probá otra palabra, otra categoría o sacá el filtro de favoritos.",
    "products.details": "Ver detalles",
    "products.colors": "{n} colores",
    "products.sort.az": "Orden: A → Z",
    "products.sort.za": "Orden: Z → A",
    "products.sort.cat": "Orden: Categoría",
    "products.sort.colors": "Orden: Más colores",
    "products.fav.on": "Favoritos",
    "products.fav.off": "Todos",

    "mag.aria": "Revista",
    "mag.prev": "Anterior",
    "mag.next": "Siguiente",
    "mag.cover": "Portada",
    "mag.home": "Inicio",
    "mag.noPages": "Todavía no hay páginas cargadas en pages.json",

    "modal.colors": "Colores",
    "modal.noColors": "Este producto no tiene colores cargados.",
    "modal.add": "Agregar a mi lista",
    "modal.ask": "Consultar stock y mínimos",
    "modal.colorLabel": "Color elegido",
    "toast.pickColor.title": "Falta el color",
    "toast.pickColor.text": "Elegí un color antes de agregar 🙏",
    "toast.productAdded.title": "Producto agregado",
    "toast.productAdded.action": "Ver 🛒",
    "toast.productNotFound": "Producto no encontrado.",

    "toast.fav.title": "Favoritos",
    "toast.fav.add": "Agregado a favoritos ⭐",
    "toast.fav.remove": "Quitado de favoritos",

    "basket.title": "Carrito",
    "basket.send": "Enviar por WhatsApp",
    "basket.clear": "Vaciar",
    "basket.empty.title": "Vacío",
    "basket.empty.text": "Agregá productos tocando una tela y eligiendo color.",
    "basket.remove": "Quitar",
    "basket.cleared.title": "Listo",
    "basket.cleared.text": "Carrito vaciado",

    "cats.title": "Categorías",
    "cats.subtitle": "Explorá por tipo de tela",
    "cats.none.title": "Sin categorías",
    "cats.none.text": "Todavía no hay productos cargados por categoría.",
    "cats.view": "Ver productos de {c}",
    "cats.explore": "Explorar",

    "contact.title": "Contacto",
    "contact.subtitle": "Hacé tu pedido por WhatsApp",
    "contact.wa.title": "WhatsApp",
    "contact.wa.text": "Catálogo mayorista, stock, mínimos y tiempos.",
    "contact.wa.btn": "Escribir",
    "contact.send.title": "Qué enviar",
    "contact.send.text": "Tela · Color · Uso · Localidad · Cantidad.",
    "contact.cart.title": "Carrito 🛒",
    "contact.cart.text": "Armá tu lista y enviala con un click.",
    "contact.cart.btn": "Abrir carrito 🛒",

    "pdf.title": "PDF",
    "pdf.missing": "No encuentro el PDF. Revisá el nombre y la ubicación.",

    "toast.ok": "OK",

    "debug.noProducts.title": "Datos",
    "debug.noProducts.text":
      "No se cargaron productos. Revisá /data/products.json (Network → 404 o JSON inválido).",
  },

  en: {
    "home.title": "Choose your fabric",
    "home.subtitle": "What do you need it for?",
    "home.cta.category": "View category",
    "home.cta.mag": "View magazine",
    "home.tip": "Tip: tap a fabric → choose a color → “Add to my list”.",
    "home.featured": "Featured",
    "home.noFeatured": "No featured items yet.",
    "home.pdf": "Catalog (PDF)",
    "home.cart": "Cart 🛒",
    "home.wa": "WhatsApp",

    "products.title": "Products",
    "products.subtitle": "Search by fabric, use or color",
    "products.noResults.title": "No results",
    "products.noResults.text": "Try another word/category or disable favorites filter.",
    "products.details": "View details",
    "products.colors": "{n} colors",
    "products.sort.az": "Sort: A → Z",
    "products.sort.za": "Sort: Z → A",
    "products.sort.cat": "Sort: Category",
    "products.sort.colors": "Sort: Most colors",
    "products.fav.on": "Favorites",
    "products.fav.off": "All",

    "mag.aria": "Magazine",
    "mag.prev": "Previous",
    "mag.next": "Next",
    "mag.cover": "Cover",
    "mag.home": "Home",
    "mag.noPages": "No pages loaded yet (pages.json).",

    "modal.colors": "Colors",
    "modal.noColors": "This product has no colors loaded.",
    "modal.add": "Add to my list",
    "modal.ask": "Ask stock & minimums",
    "modal.colorLabel": "Selected color",
    "toast.pickColor.title": "Missing color",
    "toast.pickColor.text": "Pick a color before adding 🙏",
    "toast.productAdded.title": "Added",
    "toast.productAdded.action": "View 🛒",
    "toast.productNotFound": "Product not found.",

    "toast.fav.title": "Favorites",
    "toast.fav.add": "Added to favorites ⭐",
    "toast.fav.remove": "Removed from favorites",

    "basket.title": "Cart",
    "basket.send": "Send on WhatsApp",
    "basket.clear": "Clear",
    "basket.empty.title": "Empty",
    "basket.empty.text": "Add products by opening an item and choosing a color.",
    "basket.remove": "Remove",
    "basket.cleared.title": "Done",
    "basket.cleared.text": "Cart cleared",

    "cats.title": "Categories",
    "cats.subtitle": "Browse by fabric type",
    "cats.none.title": "No categories",
    "cats.none.text": "No products by category yet.",
    "cats.view": "View products in {c}",
    "cats.explore": "Explore",

    "contact.title": "Contact",
    "contact.subtitle": "Order via WhatsApp",
    "contact.wa.title": "WhatsApp",
    "contact.wa.text": "Wholesale catalog, stock, minimums and lead times.",
    "contact.wa.btn": "Message",
    "contact.send.title": "What to send",
    "contact.send.text": "Fabric · Color · Use · City · Quantity.",
    "contact.cart.title": "Cart 🛒",
    "contact.cart.text": "Build your list and send it in one tap.",
    "contact.cart.btn": "Open cart 🛒",

    "pdf.title": "PDF",
    "pdf.missing": "PDF not found. Check name and location.",

    "toast.ok": "OK",

    "debug.noProducts.title": "Data",
    "debug.noProducts.text":
      "Products not loaded. Check /data/products.json (Network → 404 or invalid JSON).",
  },
};

function normalizeLang(lang) {
  const l = String(lang || "").toLowerCase();
  if (SUPPORTED_LANGS.includes(l)) return l;
  const base = l.split("-")[0];
  return SUPPORTED_LANGS.includes(base) ? base : "es";
}

function getLang() {
  try {
    const sp = new URL(window.location.href).searchParams;
    const fromUrl = sp.get("lang");
    if (fromUrl) return normalizeLang(fromUrl);
  } catch {}

  try {
    const saved = localStorage.getItem(LS_LANG);
    if (saved) return normalizeLang(saved);
  } catch {}

  return normalizeLang(navigator.language || "es");
}

let LANG = getLang();
function setLang(lang) {
  LANG = normalizeLang(lang);
  try {
    localStorage.setItem(LS_LANG, LANG);
  } catch {}
}

function t(key, vars = {}) {
  const dict = I18N[LANG] || I18N.es;
  let out = dict[key] ?? I18N.es[key] ?? String(key);
  out = String(out).replace(/\{(\w+)\}/g, (_, k) =>
    vars[k] != null ? String(vars[k]) : `{${k}}`
  );
  return out;
}

/* ========= TEXT NORMALIZE (NO TILDES) ========= */
function normText(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/* ========= SEARCH INDEX ========= */
let SEARCH_INDEX = new Map();
function buildSearchIndex() {
  SEARCH_INDEX = new Map();
  for (const p of DB.products || []) {
    const variants = normalizeVariants(p);
    const blob = normText(
      [
        p.name,
        p.category,
        p.desc,
        ...(p.uses || []),
        ...(p.colors || []),
        ...(variants.map((v) => v.name) || []),
        p.comp || "",
        p.width || "",
        p.tag || "",
      ].join(" ")
    );
    SEARCH_INDEX.set(p.id, blob);
  }
}

/* ========= RAF + DEBOUNCE ========= */
function rafRender() {
  cancelAnimationFrame(rafRender._id);
  rafRender._id = requestAnimationFrame(render);
}
function debounce(fn, ms = 140) {
  let tmr;
  return (...args) => {
    clearTimeout(tmr);
    tmr = setTimeout(() => fn(...args), ms);
  };
}

/* ========= STATE ========= */
let DB = { categories: ["Todo"], products: [] };
let PAGES = [];

let currentView = "revista"; // revista | productos | categorias | contacto
let currentCat = "Todo";
let query = "";

let sortMode = "az"; // az | za | cat | colors
let favOnly = false;
let favs = loadFavs(); // Set<string>

/**
 * basket item shape:
 * { id, name, category, variantId, variantName, variantImg, qty }
 */
let basket = loadBasket();

let modalState = {
  productId: null,
  selectedVariantId: null,
  selectedVariantName: null,
  selectedVariantImg: null,
};

/* ========= REVISTA STATE ========= */
let pageIndex = loadMagPage();
let revistaMode = loadMagMode();

/* ========= DOM HELPERS ========= */
const $ = (id) => document.getElementById(id);

/* ========= REQUIRED MODALS (INJECT IF MISSING) ========= */
function ensureModalsExist() {
  // Producto
  if (!$("productModal")) {
    const dlg = document.createElement("dialog");
    dlg.id = "productModal";
    dlg.className = "modal";

    dlg.innerHTML = `
      <div class="modal__sheet">
        <div class="modal__top">
          <div class="modal__head">
            <div class="modal__title" id="mTitle">—</div>
            <div class="modal__sub" id="mSub">—</div>
            <div class="modal__badge" id="mColorBadge" style="display:none"></div>
          </div>

          <div class="modal__topActions">
            <button class="basket" id="mCart" type="button" aria-label="Carrito">
              🛒 <span class="basket__count" id="mCartCount">0</span>
            </button>
            <button class="iconbtn" id="mClose" type="button" aria-label="Cerrar">✕</button>
          </div>
        </div>

        <div class="modal__body">
          <div class="modal__hero">
            <div class="modal__heroImg" id="mHeroWrap">
              <div class="mph" style="font-weight:1000;opacity:.85">IMPAC2</div>
            </div>
            <div class="modal__heroName" id="mHeroName">—</div>
          </div>

          <div id="mSpecs"></div>

          <div class="modal__section" id="mColors"></div>

          <div class="modal__actions">
            <button class="btn btn--primary" id="btnAdd" type="button">${escapeHtml(
              t("modal.add")
            )}</button>
            <a class="btn" id="btnAsk" href="#" target="_blank" rel="noopener">${escapeHtml(
              t("modal.ask")
            )}</a>
          </div>

          <div class="muted" style="font-size:12px; opacity:.75; margin-top:12px;">
            *Stock y mínimos se confirman por canal comercial.
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(dlg);
  }

  // Carrito
  if (!$("basketModal")) {
    const dlg = document.createElement("dialog");
    dlg.id = "basketModal";
    dlg.className = "modal";

    dlg.innerHTML = `
      <div class="modal__sheet">
        <div class="modal__top">
          <div class="modal__head">
            <div class="modal__title">${escapeHtml(t("basket.title"))}</div>
            <div class="modal__sub muted" style="opacity:.8">Lista para enviar</div>
          </div>
          <div class="modal__topActions">
            <button class="iconbtn" id="bClose" type="button" aria-label="Cerrar">✕</button>
          </div>
        </div>

        <div class="modal__body">
          <div id="basketList"></div>

          <div class="modal__actions" style="margin-top:14px;">
            <button class="btn" id="bClear" type="button">${escapeHtml(t("basket.clear"))}</button>
            <a class="btn btn--primary" id="bSend" href="#" target="_blank" rel="noopener">${escapeHtml(
              t("basket.send")
            )}</a>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(dlg);
  }
}

/* ========= TOPBAR HEIGHT (MOBILE FIX) ========= */
function syncTopbarHeight() {
  const topbar = document.querySelector(".topbar");
  if (!topbar) return;
  const h = Math.ceil(topbar.getBoundingClientRect().height);
  document.documentElement.style.setProperty("--topbar-h", `${h}px`);
}

/* ========= DIALOG BACKDROP CLICK ========= */
function enableDialogBackdropClose(dialog) {
  if (!dialog) return;

  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });

  dialog.addEventListener("cancel", (e) => {
    e.preventDefault();
    dialog.close();
  });
}

/* ========= Animación “pop” ========= */
function popBtn(el) {
  if (!el) return;
  el.classList.remove("iconbtn-pop");
  void el.offsetWidth;
  el.classList.add("iconbtn-pop");
  setTimeout(() => el.classList.remove("iconbtn-pop"), 280);
}

/* ========= PUSH/FX al sumar ========= */
function pushBasketFX(btnEl) {
  try {
    if (navigator.vibrate) navigator.vibrate(25);
  } catch {}

  if (basketCount) {
    basketCount.classList.remove("is-boom");
    void basketCount.offsetWidth;
    basketCount.classList.add("is-boom");
    setTimeout(() => basketCount.classList.remove("is-boom"), 520);
  }
  if (mCartCount) {
    mCartCount.classList.remove("is-boom");
    void mCartCount.offsetWidth;
    mCartCount.classList.add("is-boom");
    setTimeout(() => mCartCount.classList.remove("is-boom"), 520);
  }

  if (btnBasket) {
    btnBasket.classList.remove("is-push");
    void btnBasket.offsetWidth;
    btnBasket.classList.add("is-push");
    setTimeout(() => btnBasket.classList.remove("is-push"), 650);
  }
  if (mCart) {
    mCart.classList.remove("is-push");
    void mCart.offsetWidth;
    mCart.classList.add("is-push");
    setTimeout(() => mCart.classList.remove("is-push"), 650);
  }

  if (btnEl) {
    btnEl.classList.remove("btn-pop");
    void btnEl.offsetWidth;
    btnEl.classList.add("btn-pop");
    setTimeout(() => btnEl.classList.remove("btn-pop"), 380);
  }
}

/* =========================================================
   URL STATE
   ========================================================= */
function readUrlState() {
  try {
    const u = new URL(window.location.href);
    const sp = u.searchParams;

    const v = (sp.get("view") || "").trim();
    const cat = (sp.get("cat") || "").trim();
    const q = (sp.get("q") || "").trim();
    const fav = (sp.get("fav") || "").trim();
    const sort = (sp.get("sort") || "").trim();
    const mode = (sp.get("mode") || "").trim();
    const page = sp.get("page");

    return {
      view: ["revista", "productos", "categorias", "contacto"].includes(v) ? v : null,
      cat: cat || null,
      q: q || null,
      favOnly: fav === "1",
      sort: ["az", "za", "cat", "colors"].includes(sort) ? sort : null,
      mode: mode === "mag" ? "mag" : mode === "home" ? "home" : null,
      pageIndex: page != null ? clampInt(Number(page), 0, 9999) : null,
    };
  } catch {
    return {
      view: null,
      cat: null,
      q: null,
      favOnly: false,
      sort: null,
      mode: null,
      pageIndex: null,
    };
  }
}

function writeUrlState({ replace = true } = {}) {
  try {
    const u = new URL(window.location.href);
    u.hash = "";

    u.searchParams.delete("view");
    u.searchParams.delete("cat");
    u.searchParams.delete("q");
    u.searchParams.delete("fav");
    u.searchParams.delete("sort");
    u.searchParams.delete("mode");
    u.searchParams.delete("page");

    u.searchParams.set("view", currentView);

    if (currentView === "productos") {
      if (currentCat && currentCat !== "Todo") u.searchParams.set("cat", currentCat);
      if (query) u.searchParams.set("q", query);
      if (favOnly) u.searchParams.set("fav", "1");
      if (sortMode && sortMode !== "az") u.searchParams.set("sort", sortMode);
    }

    if (currentView === "revista") {
      u.searchParams.set("mode", revistaMode);
      if (revistaMode === "mag") u.searchParams.set("page", String(pageIndex || 0));
    }

    const next = u.toString();
    if (replace) history.replaceState(null, "", next);
    else history.pushState(null, "", next);
  } catch {}
}

function setView(view, { push = false } = {}) {
  const ok = ["revista", "productos", "categorias", "contacto"].includes(view);
  currentView = ok ? view : "revista";
  if (currentView === "revista" && !["home", "mag"].includes(revistaMode)) revistaMode = "home";
  writeUrlState({ replace: !push });
  rafRender();
}

/* =========================================================
   HOTSPOTS UX
   ========================================================= */
function attachHotspotUX() {
  if (!hotspotsEl) return;

  hotspotsEl.addEventListener(
    "touchstart",
    (e) => {
      const hs = e.target.closest(".hotspot");
      if (!hs) return;

      hs.classList.add("is-tap");
      clearTimeout(hs._tapT);
      hs._tapT = setTimeout(() => hs.classList.remove("is-tap"), 220);

      hs.classList.add("is-peek");
      clearTimeout(hs._peekT);
      hs._peekT = setTimeout(() => hs.classList.remove("is-peek"), 900);
    },
    { passive: true }
  );

  hotspotsEl.addEventListener("mousedown", (e) => {
    const hs = e.target.closest(".hotspot");
    if (!hs) return;
    hs.classList.add("is-tap");
    clearTimeout(hs._tapT);
    hs._tapT = setTimeout(() => hs.classList.remove("is-tap"), 220);
  });
}

/* =========================================================
   HOTSPOTS FILTER
   ========================================================= */
function applyHotspotFilter(h) {
  const q = String(h?.q || h?.query || h?.search || h?.use || "").trim();
  const cat = String(h?.cat || h?.category || "").trim();

  if (cat && (DB.categories || []).includes(cat)) {
    currentCat = cat;
    query = "";
    if (searchInput) searchInput.value = "";
  } else {
    const finalQ = q || String(h?.label || "").trim();
    query = finalQ;
    if (searchInput) searchInput.value = finalQ;
    currentCat = "Todo";
  }

  favOnly = false;
  currentView = "productos";
  writeUrlState({ replace: true });
  rafRender();
}

/* ========= VERSION BUMP ========= */
function bumpVersion() {
  try {
    const v = localStorage.getItem(LS_VER);
    if (v !== APP_VERSION) localStorage.setItem(LS_VER, APP_VERSION);
  } catch {}
}

/* ========= DOM (after injection) ========= */
let drawer,
  btnMenu,
  btnClose,
  navItems,
  btnHome,
  btnCategories,
  searchInput,
  clearSearch,
  btnDownload,
  menuDownload,
  btnWhatsApp,
  pageCanvas,
  hotspotsEl,
  productModal,
  mClose,
  mTitle,
  mSub,
  mSpecs,
  mColors,
  mHeroWrap,
  mHeroName,
  mColorBadge,
  btnAdd,
  btnAsk,
  mCart,
  mCartCount,
  basketModal,
  btnBasket,
  basketCount,
  bClose,
  basketList,
  bClear,
  bSend,
  pdfViewer,
  pdfFrame,
  btnClosePdf,
  toast;

function bindDomRefs() {
  drawer = $("drawer");
  btnMenu = $("btnMenu");
  btnClose = $("btnClose");
  navItems = Array.from(document.querySelectorAll(".nav__item[data-view]"));

  btnHome = $("btnHome");
  btnCategories = $("btnCategories");
  searchInput = $("searchInput");
  clearSearch = $("clearSearch");
  btnDownload = $("btnDownload");
  menuDownload = $("menuDownload");
  btnWhatsApp = $("btnWhatsApp");

  pageCanvas = $("pageCanvas");
  hotspotsEl = $("hotspots");

  productModal = $("productModal");
  mClose = $("mClose");
  mTitle = $("mTitle");
  mSub = $("mSub");
  mSpecs = $("mSpecs");
  mColors = $("mColors");
  mHeroWrap = $("mHeroWrap");
  mHeroName = $("mHeroName");
  mColorBadge = $("mColorBadge");
  btnAdd = $("btnAdd");
  btnAsk = $("btnAsk");

  mCart = $("mCart");
  mCartCount = $("mCartCount");

  basketModal = $("basketModal");
  btnBasket = $("btnBasket");
  basketCount = $("basketCount");
  bClose = $("bClose");
  basketList = $("basketList");
  bClear = $("bClear");
  bSend = $("bSend");

  pdfViewer = $("pdfViewer");
  pdfFrame = $("pdfFrame");
  btnClosePdf = $("btnClosePdf");

  toast = $("toast");
}

/* ========= INIT ========= */
document.addEventListener("DOMContentLoaded", boot);
window.addEventListener("resize", syncTopbarHeight);
window.addEventListener("orientationchange", syncTopbarHeight);
window.addEventListener("load", syncTopbarHeight);

window.addEventListener("popstate", () => {
  LANG = getLang();

  const st = readUrlState();

  if (st.view) currentView = st.view;

  if (st.view === "productos") {
    if (st.cat && (DB.categories || []).includes(st.cat)) currentCat = st.cat;
    else currentCat = "Todo";
    query = st.q || "";
    favOnly = !!st.favOnly;
    sortMode = st.sort || "az";
    if (searchInput) searchInput.value = query;
  }

  if (st.view === "revista") {
    revistaMode = st.mode || "home";
    if (st.pageIndex != null) pageIndex = st.pageIndex;
  }

  rafRender();
});

async function boot() {
  bumpVersion();

  // lang from URL if present
  try {
    const sp = new URL(window.location.href).searchParams;
    const fromUrl = sp.get("lang");
    if (fromUrl) setLang(fromUrl);
  } catch {}

  // ✅ Ensure modals exist even if HTML didn't include them
  ensureModalsExist();
  bindDomRefs();

  // Drawer
  btnMenu?.addEventListener("click", () => openDrawer(true));
  btnClose?.addEventListener("click", () => openDrawer(false));
  drawer?.addEventListener("click", (e) => {
    if (e.target === drawer) openDrawer(false);
  });

  // close modals on backdrop
  enableDialogBackdropClose(productModal);
  enableDialogBackdropClose(basketModal);

  productModal?.addEventListener("close", () => {
    modalState = {
      productId: null,
      selectedVariantId: null,
      selectedVariantName: null,
      selectedVariantImg: null,
    };
    if (mColorBadge) mColorBadge.style.display = "none";
  });

  basketModal?.addEventListener("close", () => updateBasketCount());

  // Delegation: open products / filters
  hotspotsEl?.addEventListener("click", (e) => {
    if (e.target.closest("[data-fav]")) return;

    const openEl = e.target.closest("[data-open]");
    if (openEl) return openProduct(openEl.dataset.open);

    const filterEl = e.target.closest("[data-filter]");
    if (filterEl) {
      return applyHotspotFilter({
        q: filterEl.dataset.q || "",
        cat: filterEl.dataset.cat || "",
        label: filterEl.getAttribute("aria-label") || "",
      });
    }
  });

  hotspotsEl?.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;

    const openEl = e.target.closest("[data-open]");
    if (openEl) {
      e.preventDefault();
      return openProduct(openEl.dataset.open);
    }

    const filterEl = e.target.closest("[data-filter]");
    if (filterEl) {
      e.preventDefault();
      return applyHotspotFilter({
        q: filterEl.dataset.q || "",
        cat: filterEl.dataset.cat || "",
        label: filterEl.getAttribute("aria-label") || "",
      });
    }
  });

  attachMagazineSwipe();
  attachHotspotUX();

  // Global ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (drawer?.classList.contains("is-open")) openDrawer(false);
      if (pdfViewer && !pdfViewer.classList.contains("is-hidden")) closePdf();
      try {
        if (productModal?.open) productModal.close();
        if (basketModal?.open) basketModal.close();
      } catch {}
    }
  });

  // Nav
  navItems.forEach((b) =>
    b.addEventListener("click", () => {
      openDrawer(false);
      setView(b.dataset.view || "revista", { push: true });

      if (currentView === "revista") {
        revistaMode = "home";
        saveMagState();
        writeUrlState({ replace: false });
      }
    })
  );

  // Home (topbar)
  btnHome?.addEventListener("click", () => {
    popBtn(btnHome);
    currentView = "revista";
    revistaMode = "home";
    currentCat = "Todo";
    query = "";
    favOnly = false;
    sortMode = "az";
    if (searchInput) searchInput.value = "";
    saveMagState();
    writeUrlState({ replace: false });
    rafRender();
  });

  // Categories (topbar)
  btnCategories?.addEventListener("click", () => {
    popBtn(btnCategories);
    setView("categorias", { push: true });
  });

  // Carrito desde modal producto
  mCart?.addEventListener("click", () => {
    popBtn(mCart);
    try {
      productModal?.close();
    } catch {}
    renderBasket();
    openDialog(basketModal);
  });

  // Search
  searchInput?.addEventListener(
    "input",
    debounce((e) => {
      query = String(e.target.value || "").trim();
      currentView = "productos";
      writeUrlState({ replace: true });
      rafRender();
    }, 140)
  );

  clearSearch?.addEventListener("click", () => {
    query = "";
    if (searchInput) searchInput.value = "";
    writeUrlState({ replace: true });
    rafRender();
  });

  // PDF
  btnDownload?.addEventListener("click", () => openPdfBestEffort());
  menuDownload?.addEventListener("click", () => openPdfBestEffort());
  btnClosePdf?.addEventListener("click", closePdf);

  // Modal close (X)
  mClose?.addEventListener("click", () => closeDialog(productModal));

  // Basket modal open/close
  btnBasket?.addEventListener("click", () => {
    renderBasket();
    openDialog(basketModal);
  });
  bClose?.addEventListener("click", () => closeDialog(basketModal));

  // Clear basket
  bClear?.addEventListener("click", () => {
    basket = (basket || []).slice(0, 0);
    saveBasket(basket);
    updateBasketCount();
    renderBasket();
    showToast(t("basket.cleared.text"), {
      rich: true,
      title: t("basket.cleared.title"),
      variant: "success",
      duration: 1800,
      actionText: t("toast.ok"),
    });
  });

  await loadData();

  if (btnWhatsApp) {
    btnWhatsApp.href = waLink(
      "Hola 👋 Quiero catálogo mayorista, stock y mínimos. ¿Me ayudan?"
    );
  }

  if (!(DB.categories || []).includes(currentCat)) currentCat = "Todo";
  pageIndex = clampInt(pageIndex, 0, Math.max(0, (PAGES?.length || 1) - 1));

  // Respect URL
  const urlSt = readUrlState();
  if (urlSt.view) {
    currentView = urlSt.view;

    if (urlSt.view === "productos") {
      if (urlSt.cat && (DB.categories || []).includes(urlSt.cat)) currentCat = urlSt.cat;
      query = urlSt.q || "";
      favOnly = !!urlSt.favOnly;
      sortMode = urlSt.sort || "az";
      if (searchInput) searchInput.value = query;
    }

    if (urlSt.view === "revista") {
      revistaMode = urlSt.mode || "home";
      if (urlSt.pageIndex != null) {
        pageIndex = clampInt(
          urlSt.pageIndex,
          0,
          Math.max(0, (PAGES?.length || 1) - 1)
        );
      }
    }
  } else {
    revistaMode = "home";
    saveMagState();
  }

  syncTopbarHeight();
  writeUrlState({ replace: true });
  updateBasketCount();

  // Debug if no products
  if (!(DB.products || []).length) {
    showToast(t("debug.noProducts.text"), {
      rich: true,
      title: t("debug.noProducts.title"),
      variant: "warn",
      duration: 5200,
      actionText: t("toast.ok"),
    });
  }

  rafRender();
}

/* =========================================================
   DATA
   ========================================================= */

function isValidProduct(p) {
  if (!p || typeof p !== "object") return false;
  const id = String(p.id || "").trim();
  if (!id) return false;
  const name = String(p.name || "").trim();
  if (!name) return false;
  return true;
}

function isValidAdminDB(obj) {
  if (!obj || typeof obj !== "object") return false;
  const prods = obj.products;
  if (!Array.isArray(prods) || prods.length === 0) return false;
  const validCount = prods.filter(isValidProduct).length;
  return validCount > 0;
}

async function fetchJsonBestEffort(path) {
  try {
    const r = await fetch(path, { cache: "no-store" });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

function normalizeProductsPayload(pj) {
  if (Array.isArray(pj)) return { categories: ["Todo"], products: pj };
  if (pj && typeof pj === "object") {
    if (Array.isArray(pj.products))
      return { categories: pj.categories || ["Todo"], products: pj.products };
    if (Array.isArray(pj.items))
      return { categories: pj.categories || ["Todo"], products: pj.items };
    return { categories: pj.categories || ["Todo"], products: [] };
  }
  return { categories: ["Todo"], products: [] };
}

function mergeDB(base, admin) {
  const out = { categories: [], products: [] };

  const b = sanitizeDB(base);
  const a = sanitizeDB(admin);

  const map = new Map();
  for (const p of b.products) map.set(p.id, p);
  for (const p of a.products) map.set(p.id, p);

  out.products = Array.from(map.values());

  const cats = new Set();
  for (const c of b.categories || []) cats.add(c);
  for (const c of a.categories || []) cats.add(c);
  cats.add("Todo");
  for (const p of out.products) if (p.category) cats.add(p.category);

  out.categories = Array.from(cats);
  out.categories = ["Todo", ...out.categories.filter((c) => c !== "Todo")];

  return sanitizeDB(out);
}

async function loadData() {
  const pj = await fetchJsonBestEffort(DATA_PRODUCTS);
  const base = normalizeProductsPayload(pj);

  let admin = null;
  let adminRaw = null;

  try {
    adminRaw = JSON.parse(localStorage.getItem(LS_ADMIN_DB) || "null");
    if (isValidAdminDB(adminRaw)) admin = adminRaw;
  } catch {
    admin = null;
  }

  if (adminRaw && !admin) {
    try {
      localStorage.removeItem(LS_ADMIN_DB);
    } catch {}
  }

  DB = admin ? mergeDB(base, admin) : sanitizeDB(base);

  const pjson = await fetchJsonBestEffort(DATA_PAGES);
  const pagesArr = pjson && typeof pjson === "object" ? pjson.pages : [];
  PAGES = sanitizePages(Array.isArray(pagesArr) ? pagesArr : []);

  buildSearchIndex();
  pageIndex = clampInt(pageIndex, 0, Math.max(0, (PAGES?.length || 1) - 1));
}

function sanitizeDB(raw) {
  const safe = raw && typeof raw === "object" ? raw : {};
  let categories = Array.isArray(safe.categories) ? safe.categories.filter(Boolean) : [];
  if (!categories.length) categories = ["Todo"];
  if (!categories.includes("Todo")) categories.unshift("Todo");

  let products = Array.isArray(safe.products) ? safe.products : [];
  products = products
    .filter((p) => p && typeof p === "object" && p.id)
    .map((p) => ({
      id: String(p.id),
      name: String(p.name || "Producto"),
      category: String(p.category || "Todo"),
      featured: !!p.featured,
      desc: String(p.desc || ""),
      uses: Array.isArray(p.uses) ? p.uses.map(String) : [],
      colors: Array.isArray(p.colors) ? p.colors.map(String) : [],
      variants: Array.isArray(p.variants) ? p.variants : [],
      comp: p.comp ? String(p.comp) : "",
      width: p.width ? String(p.width) : "",
      tag: p.tag ? String(p.tag) : "IMPAC2",
    }));

  const fromProducts = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  for (const c of fromProducts) if (!categories.includes(c)) categories.push(c);

  const seen = new Set();
  products = products.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  return { categories, products };
}

function sanitizePages(pages) {
  if (!Array.isArray(pages)) return [];
  return pages
    .filter((p) => p && typeof p === "object")
    .map((p) => ({
      id: String(p.id || ""),
      title: String(p.title || "Revista"),
      subtitle: String(p.subtitle || ""),
      bg: String(p.bg || ""),
      hotspots: Array.isArray(p.hotspots) ? p.hotspots : [],
    }));
}

/* ========= RENDER ========= */
function render() {
  updateBasketCount();
  navItems?.forEach((b) => b.classList.toggle("is-active", b.dataset.view === currentView));
  syncTopbarHeight();

  if (currentView === "productos") return renderProducts();
  if (currentView === "categorias") return renderCategories();
  if (currentView === "contacto") return renderContact();

  if (revistaMode === "home") renderHome();
  else renderMagazine();
}

/* ========= REVISTA (pages.json) ========= */
function renderMagazine() {
  if (!hotspotsEl) return;

  if (!Array.isArray(PAGES) || !PAGES.length) {
    revistaMode = "home";
    saveMagState();
    writeUrlState({ replace: true });
    return renderHome();
  }

  pageIndex = clampInt(pageIndex, 0, PAGES.length - 1);
  saveMagState();
  writeUrlState({ replace: true });

  const page = PAGES[pageIndex];

  if (pageCanvas) {
    pageCanvas.style.backgroundImage = page?.bg ? `url("${page.bg}")` : "";
    pageCanvas.style.backgroundSize = "cover";
    pageCanvas.style.backgroundPosition = "center";
  }

  const hs = Array.isArray(page.hotspots) ? page.hotspots : [];
  const hsHtml = hs
    .map((h) => {
      const label = h.label || "Ver";
      const pid = h.productId || "";
      const x = Number(h.x || 0);
      const y = Number(h.y || 0);
      const w = Number(h.w || 0);
      const hh = Number(h.h || 0);

      const cat = String(h.category || h.cat || "").trim();
      const q = String(h.query || h.q || h.search || h.use || "").trim();

      const openAttr = pid ? `data-open="${escapeHtml(pid)}"` : "";
      const filterAttr = !pid
        ? `data-filter="1" data-cat="${escapeHtml(cat)}" data-q="${escapeHtml(q || label)}"`
        : "";

      return `
        <button class="hotspot" type="button" ${openAttr} ${filterAttr}
          style="left:${x}%; top:${y}%; width:${w}%; height:${hh}%;"
          aria-label="${escapeHtml(label)}">
          <span class="hotspot__label">${escapeHtml(label)}</span>
        </button>
      `;
    })
    .join("");

  hotspotsEl.innerHTML = `
    <div class="mag" aria-label="${escapeHtml(t("mag.aria"))}">
      ${hsHtml}

      <div class="mag__ui">
        <div class="mag__pager">
          <button class="btn mag__btn" id="magPrev" type="button" aria-label="${escapeHtml(
            t("mag.prev")
          )}">←</button>
          <div class="mag__pill">${escapeHtml(page.title || "Revista")} · ${pageIndex + 1}/${PAGES.length}</div>
          <button class="btn mag__btn" id="magNext" type="button" aria-label="${escapeHtml(
            t("mag.next")
          )}">→</button>
        </div>

        <div class="mag__actions">
          <button class="btn" id="magCover" type="button">${escapeHtml(t("mag.cover"))}</button>
          <button class="btn btn--primary" id="magToHome" type="button">${escapeHtml(
            t("mag.home")
          )}</button>
        </div>
      </div>
    </div>
  `;

  $("magPrev")?.addEventListener("click", () => goPage(-1));
  $("magNext")?.addEventListener("click", () => goPage(+1));

  $("magCover")?.addEventListener("click", () => {
    pageIndex = 0;
    revistaMode = "mag";
    saveMagState();
    writeUrlState({ replace: false });
    rafRender();
  });

  $("magToHome")?.addEventListener("click", () => {
    revistaMode = "home";
    saveMagState();
    writeUrlState({ replace: false });
    rafRender();
  });

  const t1 = document.querySelector(".topbar__title");
  const t2 = document.querySelector(".topbar__subtitle");
  if (t1) t1.textContent = page?.title || "Revista";
  if (t2) t2.textContent = page?.subtitle || "Venta mayorista";
}

function goPage(delta) {
  if (!Array.isArray(PAGES) || !PAGES.length) return;
  pageIndex = clampInt(pageIndex + delta, 0, PAGES.length - 1);
  revistaMode = "mag";
  saveMagState();
  writeUrlState({ replace: true });
  rafRender();
}

function attachMagazineSwipe() {
  if (!hotspotsEl) return;

  let sx = 0;
  let sy = 0;
  let active = false;
  let allow = false;

  hotspotsEl.addEventListener(
    "touchstart",
    (e) => {
      if (currentView !== "revista") return;
      if (revistaMode !== "mag") return;
      if (!e.touches || e.touches.length !== 1) return;

      const target = e.target;
      if (
        target &&
        (target.closest(".hotspot") || target.closest("button") || target.closest("a"))
      ) {
        allow = false;
        active = false;
        return;
      }

      const tt = e.touches[0];
      sx = tt.clientX;
      sy = tt.clientY;
      active = true;
      allow = true;
    },
    { passive: true }
  );

  hotspotsEl.addEventListener(
    "touchend",
    (e) => {
      if (currentView !== "revista") return;
      if (revistaMode !== "mag") return;
      if (!active || !allow) return;

      active = false;
      allow = false;

      const tt = e.changedTouches && e.changedTouches[0];
      if (!tt) return;

      const dx = tt.clientX - sx;
      const dy = tt.clientY - sy;

      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;

      if (dx < 0) goPage(+1);
      else goPage(-1);
    },
    { passive: true }
  );
}

/* ========= HOME ========= */
function renderHome() {
  if (!hotspotsEl) return;

  if (pageCanvas) pageCanvas.style.backgroundImage = "";

  const featured = pickFeatured().slice(0, 6);

  hotspotsEl.innerHTML = `
    <div class="home">
      <div class="panel">
        <div class="panel__inner">
          <div class="panel__title">${escapeHtml(t("home.title"))}</div>
          <div class="panel__subtitle">${escapeHtml(t("home.subtitle"))}</div>

          <div class="usegrid">
            <button class="usebtn" type="button" data-use="tapiceria">
              <div class="usebtn__img">
                <img alt="Tapicería" src="${escapeHtml(
                  HOME_USE_IMAGES.tapiceria
                )}" loading="lazy" decoding="async">
              </div>
              <div class="usebtn__txt">Tapicería</div>
              <div class="usebtn__arrow">›</div>
            </button>

            <button class="usebtn" type="button" data-use="cortinas">
              <div class="usebtn__img">
                <img alt="Cortinas" src="${escapeHtml(
                  HOME_USE_IMAGES.cortinas
                )}" loading="lazy" decoding="async">
              </div>
              <div class="usebtn__txt">Cortinas</div>
              <div class="usebtn__arrow">›</div>
            </button>

            <button class="usebtn" type="button" data-use="marroquineria">
              <div class="usebtn__img">
                <img alt="Marroquinería" src="${escapeHtml(
                  HOME_USE_IMAGES.marroquineria
                )}" loading="lazy" decoding="async">
              </div>
              <div class="usebtn__txt">Marroquinería</div>
              <div class="usebtn__arrow">›</div>
            </button>
          </div>

          <button class="btn btn--primary home__cta" id="homeViewCategory" type="button">${escapeHtml(
            t("home.cta.category")
          )}</button>
          <button class="btn" id="homeToMagazine" type="button" style="margin-top:10px">${escapeHtml(
            t("home.cta.mag")
          )}</button>
          <div class="hint">${escapeHtml(t("home.tip"))}</div>
        </div>
      </div>

      <div class="panel">
        <div class="panel__inner">
          <div class="panel__title">${escapeHtml(t("home.featured"))}</div>

          <div class="fgrid">
            ${
              featured.length
                ? featured
                    .map(
                      (p) => `
                        <div class="fcard" data-open="${escapeHtml(p.id)}" role="button" tabindex="0">
                          <div class="fcard__img">${featuredImgHtml(p)}</div>
                          <div class="fcard__name">${escapeHtml(p.name || "Tela")}</div>
                        </div>
                      `
                    )
                    .join("")
                : `<div class="muted">${escapeHtml(t("home.noFeatured"))}</div>`
            }
          </div>

          <div class="home__actions" style="margin-top:12px; display:grid; gap:10px;">
            <button class="btn btn--primary" id="homePdf" type="button">${escapeHtml(
              t("home.pdf")
            )}</button>
            <button class="btn btn--primary" id="homeBasket" type="button">${escapeHtml(
              t("home.cart")
            )}</button>
            <a class="btn btn--primary" id="homeWA" href="${waLink(
              "Hola 👋 Quiero catálogo mayorista, stock y mínimos. ¿Me ayudan?"
            )}" target="_blank" rel="noopener">${escapeHtml(t("home.wa"))}</a>
          </div>
        </div>
      </div>
    </div>
  `;

  $("homeViewCategory")?.addEventListener("click", () => setView("categorias", { push: true }));

  $("homeToMagazine")?.addEventListener("click", () => {
    if (!Array.isArray(PAGES) || !PAGES.length) {
      showToast(t("mag.noPages"), {
        rich: true,
        title: "Revista",
        variant: "warn",
        duration: 2600,
        actionText: t("toast.ok"),
      });
      return;
    }
    revistaMode = "mag";
    saveMagState();
    writeUrlState({ replace: false });
    rafRender();
  });

  $("homePdf")?.addEventListener("click", () => openPdfBestEffort());

  $("homeBasket")?.addEventListener("click", () => {
    renderBasket();
    openDialog(basketModal);
  });

  hotspotsEl.querySelectorAll("[data-use]").forEach((el) => {
    el.addEventListener("click", () => {
      const use = el.dataset.use;
      query =
        use === "tapiceria"
          ? "tapicería"
          : use === "cortinas"
          ? "cortinería"
          : "marroquinería";
      if (searchInput) searchInput.value = query;
      currentCat = "Todo";
      favOnly = false;
      currentView = "productos";
      writeUrlState({ replace: false });
      rafRender();
    });
  });

  hotspotsEl.querySelectorAll("[data-open]").forEach((el) => {
    el.addEventListener("click", () => openProduct(el.dataset.open));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openProduct(el.dataset.open);
      }
    });
  });

  const t1 = document.querySelector(".topbar__title");
  const t2 = document.querySelector(".topbar__subtitle");
  if (t1) t1.textContent = t("home.title");
  if (t2) t2.textContent = t("home.subtitle");
}

function featuredImgHtml(p) {
  const variants = normalizeVariants(p);
  const v0 = variants[0] || null;
  const src = v0?.img || "";
  if (src)
    return `<img src="${escapeHtml(src)}" alt="${escapeHtml(
      p.name || "Tela"
    )}" loading="lazy" decoding="async">`;

  const initials = (p.name || "Tela")
    .split(" ")
    .slice(0, 2)
    .map((x) => x[0])
    .join("")
    .toUpperCase();
  return `<div class="fph">${escapeHtml(initials)}</div>`;
}

function pickFeatured() {
  const products = DB.products || [];
  const wantedIds = [
    "black-out",
    "pana-murano",
    "cordura-estampada",
    "apolo",
    "cordura-lisa",
    "pana-york",
  ];

  const fixed = wantedIds
    .map((id) => products.find((p) => p && p.id === id))
    .filter(Boolean);

  if (fixed.length < 6) {
    for (const p of products) {
      if (fixed.length >= 6) break;
      if (p && !fixed.some((x) => x.id === p.id)) fixed.push(p);
    }
  }
  return fixed.slice(0, 6);
}

/* ========= PRODUCTS ========= */
function productThumbHtml(p) {
  const v0 = normalizeVariants(p)[0];
  if (v0?.img) {
    return `<img src="${escapeHtml(v0.img)}" alt="${escapeHtml(
      p.name || "Producto"
    )}" loading="lazy" decoding="async">`;
  }
  const initials = (p.name || "Tela")
    .split(" ")
    .slice(0, 2)
    .map((x) => x[0])
    .join("")
    .toUpperCase();
  return `<div class="pimg__ph">${escapeHtml(initials)}</div>`;
}

function categoryCounts() {
  const m = new Map();
  for (const p of DB.products || []) {
    const c = p?.category || "Todo";
    m.set(c, (m.get(c) || 0) + 1);
  }
  return m;
}

function filteredProducts() {
  const q = normText(query);
  const items = DB.products || [];

  if (currentCat !== "Todo") {
    const anyInCat = items.some((p) => p && p.category === currentCat);
    if (!anyInCat) currentCat = "Todo";
  }

  let out = items.filter((p) => {
    const inCat = currentCat === "Todo" || p.category === currentCat;
    if (!inCat) return false;

    if (favOnly && !isFavProduct(p)) return false;

    if (!q) return true;

    const hay = SEARCH_INDEX.get(p.id) || "";
    return hay.includes(q);
  });

  out.sort((a, b) => {
    if (sortMode === "za") return (b.name || "").localeCompare(a.name || "");
    if (sortMode === "cat")
      return (
        (a.category || "").localeCompare(b.category || "") ||
        (a.name || "").localeCompare(b.name || "")
      );
    if (sortMode === "colors")
      return (
        normalizeVariants(b).length - normalizeVariants(a).length ||
        (a.name || "").localeCompare(b.name || "")
      );
    return (a.name || "").localeCompare(b.name || "");
  });

  return out;
}

function renderProducts() {
  if (!hotspotsEl) return;

  if (pageCanvas) pageCanvas.style.backgroundImage = "";

  const items = filteredProducts();

  const counts = categoryCounts();
  const catsAll = (DB.categories || []).filter(Boolean);
  const cats = catsAll.filter((c) => c === "Todo" || (counts.get(c) || 0) > 0);

  if (currentCat !== "Todo" && (counts.get(currentCat) || 0) === 0) currentCat = "Todo";

  const toolbar = `
    <div class="ptoolbar">
      <div class="chips" id="catChips">
        ${cats
          .map((c) => {
            const active = c === currentCat ? "is-active" : "";
            return `<button class="chip ${active}" type="button" data-chip="${escapeHtml(
              c
            )}">${escapeHtml(c)}</button>`;
          })
          .join("")}
      </div>

      <div class="pctl">
        <select class="select" id="sortSelect" aria-label="Ordenar">
          <option value="az" ${sortMode === "az" ? "selected" : ""}>${escapeHtml(
            t("products.sort.az")
          )}</option>
          <option value="za" ${sortMode === "za" ? "selected" : ""}>${escapeHtml(
            t("products.sort.za")
          )}</option>
          <option value="cat" ${sortMode === "cat" ? "selected" : ""}>${escapeHtml(
            t("products.sort.cat")
          )}</option>
          <option value="colors" ${sortMode === "colors" ? "selected" : ""}>${escapeHtml(
            t("products.sort.colors")
          )}</option>
        </select>

        <button class="favToggle ${favOnly ? "is-on" : ""}" id="favOnlyBtn" type="button" aria-pressed="${
          favOnly ? "true" : "false"
        }">
          ⭐ ${escapeHtml(favOnly ? t("products.fav.on") : t("products.fav.off"))}
        </button>
      </div>
    </div>
  `;

  const cards = items.length
    ? items
        .map((p) => {
          const favOn = isFavProduct(p) ? "is-on" : "";
          const nColors = normalizeVariants(p).length;
          const colorsLabel = nColors ? t("products.colors", { n: nColors }) : t("products.details");

          return `
          <article class="product" data-open="${escapeHtml(p.id)}" tabindex="0" role="button" aria-label="Ver ${escapeHtml(
            p.name || "producto"
          )}">
            <button class="favbtn ${favOn}" type="button" data-fav="${escapeHtml(
              p.id
            )}" aria-label="Favorito">
              ${isFavProduct(p) ? "⭐" : "☆"}
            </button>

            <div class="badge">${escapeHtml(p.tag || "IMPAC2")}</div>
            <div style="font-weight:900; margin-top:6px">${escapeHtml(p.name)}</div>
            <div class="muted" style="font-size:13px">${escapeHtml(p.category || "")}</div>

            <div class="pimg">${productThumbHtml(p)}</div>
            <div class="muted" style="font-size:13px">${escapeHtml(colorsLabel)}</div>

            <div class="muted" style="font-size:13px; line-height:1.35">${escapeHtml(
              shorten(p.desc || "", 110)
            )}</div>
          </article>
        `;
        })
        .join("")
    : `<div class="card">
         <div class="card__title">${escapeHtml(t("products.noResults.title"))}</div>
         <div class="card__text">${escapeHtml(t("products.noResults.text"))}</div>
       </div>`;

  hotspotsEl.innerHTML = `${toolbar}<div class="grid">${cards}</div>`;

  hotspotsEl.querySelectorAll("[data-open]").forEach((el) => {
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openProduct(el.dataset.open);
      }
    });
  });

  $("catChips")?.querySelectorAll("[data-chip]").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentCat = btn.dataset.chip || "Todo";
      writeUrlState({ replace: true });
      rafRender();
    });
  });

  $("sortSelect")?.addEventListener("change", (e) => {
    sortMode = String(e.target.value || "az");
    writeUrlState({ replace: true });
    rafRender();
  });

  $("favOnlyBtn")?.addEventListener("click", () => {
    favOnly = !favOnly;
    writeUrlState({ replace: true });
    rafRender();
  });

  hotspotsEl.querySelectorAll("[data-fav]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const pid = btn.dataset.fav;
      const p = (DB.products || []).find((x) => x.id === pid);
      if (!p) return;

      const wasFav = isFavProduct(p);
      toggleFavProduct(p);

      showToast(!wasFav ? t("toast.fav.add") : t("toast.fav.remove"), {
        rich: true,
        title: t("toast.fav.title"),
        variant: "success",
        duration: 1600,
        actionText: t("toast.ok"),
      });

      rafRender();
    });
  });

  const t1 = document.querySelector(".topbar__title");
  const t2 = document.querySelector(".topbar__subtitle");
  if (t1) t1.textContent = t("products.title");
  if (t2) t2.textContent = t("products.subtitle");
}

/* ========= WHATSAPP ========= */
function buildProductAskMsg(p, st) {
  const site = safeSiteUrl();

  const colorLine = st?.selectedVariantName
    ? `🎨 Color: ${st.selectedVariantName}`
    : "🎨 Color: (a definir)";
  const catLine = p?.category ? `🏷️ Categoría: ${p.category}` : "";
  const nameLine = p?.name ? `🧵 Producto: ${p.name}` : "🧵 Producto: —";

  return `Hola 👋 Quiero consultar mayorista.

${nameLine}
${catLine}
${colorLine}

📍 Localidad: …
🧾 Cantidad estimada: …
🧵 Uso: tapicería / marroquinería / cortinería

🔗 Link: ${site}

¿Me confirmás stock, colores disponibles y mínimos?`;
}

/* ========= MODAL PRODUCTO ========= */
function openProduct(id) {
  const p = (DB.products || []).find((x) => x.id === id);
  if (!p) return showToast(t("toast.productNotFound"));

  const variants = normalizeVariants(p);

  modalState = {
    productId: p.id,
    selectedVariantId: null,
    selectedVariantName: null,
    selectedVariantImg: null,
  };

  if (mTitle) mTitle.textContent = p.name || "—";
  if (mSub) mSub.textContent = p.category || "";
  if (mHeroName) mHeroName.textContent = `${p.name || "Producto"}`;

  if (mColorBadge) mColorBadge.style.display = "none";

  if (mHeroWrap) {
    mHeroWrap.innerHTML = `<div class="mph" style="font-weight:1000;opacity:.85">${escapeHtml(
      p.name || "IMPAC2"
    )}</div>`;
  }

  if (mSpecs) {
    mSpecs.innerHTML = [
      spec("Usos", (p.uses || []).join(", ") || "Consultar"),
      spec("Ancho", p.width || "Consultar"),
      spec("Composición", p.comp || "Consultar"),
    ].join("");
  }

  if (mColors) {
    if (!variants.length) {
      mColors.innerHTML = `<div class="muted">${escapeHtml(t("modal.noColors"))}</div>`;
    } else {
      mColors.innerHTML = `
        <div class="vtitle">${escapeHtml(t("modal.colors"))}</div>
        <div class="vgrid" id="vGrid">
          ${variants
            .map(
              (v) => `
            <button class="vcard" type="button"
              data-vid="${escapeHtml(v.id)}"
              data-vname="${escapeHtml(v.name || v.id)}"
              data-vimg="${escapeHtml(v.img || "")}"
              aria-label="${escapeHtml(v.name || v.id)}">
              <div class="vimg">
                ${
                  v.img
                    ? `<img src="${escapeHtml(v.img)}" alt="${escapeHtml(
                        v.name || v.id
                      )}" loading="lazy" decoding="async">`
                    : `<span class="vtxt">${escapeHtml(shorten(v.name || v.id, 3))}</span>`
                }
              </div>
            </button>
          `
            )
            .join("")}
        </div>
      `;

      const vGrid = $("vGrid");
      vGrid?.querySelectorAll(".vcard").forEach((btn) => {
        btn.addEventListener("click", () => {
          const vid = btn.dataset.vid || null;
          const vname = btn.dataset.vname || null;
          const vimg = btn.dataset.vimg || null;

          modalState.selectedVariantId = vid;
          modalState.selectedVariantName = vname;
          modalState.selectedVariantImg = vimg;

          vGrid.querySelectorAll(".vcard").forEach((x) => x.classList.remove("is-active"));
          btn.classList.add("is-active");

          // ✅ ARRIBA MUESTRA EL COLOR
          if (mSub) mSub.textContent = `${p.category || ""}${vname ? " · " + vname : ""}`;
          if (mHeroName) mHeroName.textContent = vname ? `${p.name} — ${vname}` : `${p.name}`;

          if (mColorBadge && vname) {
            mColorBadge.textContent = `${t("modal.colorLabel")}: ${vname}`;
            mColorBadge.style.display = "inline-flex";
          } else if (mColorBadge) {
            mColorBadge.style.display = "none";
          }

          if (mHeroWrap) {
            if (vimg) {
              mHeroWrap.innerHTML = `<img id="mHeroImg" src="${escapeHtml(
                vimg
              )}" alt="${escapeHtml((p.name || "Producto") + (vname ? " - " + vname : ""))}" decoding="async">`;
            } else {
              mHeroWrap.innerHTML = `<div class="mph" style="font-weight:1000;opacity:.85">${escapeHtml(
                p.name || "IMPAC2"
              )}</div>`;
            }
          }

          if (btnAsk) btnAsk.href = waLink(buildProductAskMsg(p, modalState));
        });
      });
    }
  }

  if (btnAdd) btnAdd.textContent = t("modal.add");
  if (btnAsk) {
    btnAsk.textContent = t("modal.ask");
    btnAsk.href = waLink(buildProductAskMsg(p, modalState));
  }

  if (btnAdd) {
    btnAdd.onclick = () => {
      if (variants.length && !modalState.selectedVariantId) {
        showToast(t("toast.pickColor.text"), {
          rich: true,
          title: t("toast.pickColor.title"),
          variant: "warn",
          duration: 2400,
          actionText: t("toast.ok"),
        });
        return;
      }

      addToBasketWithVariant(p, modalState, 1);
      pushBasketFX(btnAdd);

      const colorTxt = modalState.selectedVariantName ? ` · ${modalState.selectedVariantName}` : "";
      showToast(`${p.name}${colorTxt} agregado a tu lista`, {
        rich: true,
        title: t("toast.productAdded.title"),
        variant: "success",
        actionText: t("toast.productAdded.action"),
        onAction: () => {
          renderBasket();
          openDialog(basketModal);
        },
        duration: 3200,
      });
    };
  }

  openDialog(productModal);

  requestAnimationFrame(() => {
    const body = productModal?.querySelector(".modal__body");
    if (body) body.scrollTop = 0;

    const firstVariant = productModal?.querySelector(".vcard");
    if (firstVariant) firstVariant.focus();
    else btnAdd?.focus();
  });

  updateBasketCount();
}

/* ========= VARIANTS ========= */
function normalizeVariants(p) {
  if (Array.isArray(p.variants) && p.variants.length) return p.variants;

  const colors = Array.isArray(p.colors) ? p.colors : [];
  if (colors.length) return colors.map((c) => ({ id: `${p.id}-${slugify(c)}`, name: c, img: "" }));
  return [];
}

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function spec(k, v) {
  return `<div class="spec"><div class="spec__k">${escapeHtml(k)}</div><div class="spec__v">${escapeHtml(
    v
  )}</div></div>`;
}

/* ========= BASKET ========= */
function basketKey(id, variantId) {
  return `${String(id)}__${String(variantId || "no-variant")}`;
}

function addToBasketWithVariant(p, st, qtyToAdd = 1) {
  const item = {
    id: p.id,
    name: p.name,
    category: p.category,
    variantId: st.selectedVariantId || null,
    variantName: st.selectedVariantName || null,
    variantImg: st.selectedVariantImg || null,
    qty: 1,
  };

  const key = basketKey(item.id, item.variantId);
  const exists = basket.find((x) => basketKey(x.id, x.variantId) === key);

  if (!exists) {
    item.qty = clampInt(qtyToAdd, 1, 999);
    basket.push(item);
  } else {
    exists.qty = clampInt((exists.qty || 1) + qtyToAdd, 1, 999);
  }

  saveBasket(basket);
  updateBasketCount();
}

function updateBasketCount() {
  const totalUnits = (basket || []).reduce((acc, x) => acc + (Number(x.qty) || 1), 0);
  if (basketCount) basketCount.textContent = String(totalUnits);
  if (mCartCount) mCartCount.textContent = String(totalUnits);
}

function renderBasket() {
  if (!basketList) return;

  if (!basket?.length) {
    basketList.innerHTML = `
      <div class="card">
        <div class="card__title">${escapeHtml(t("basket.empty.title"))}</div>
        <div class="card__text">${escapeHtml(t("basket.empty.text"))}</div>
      </div>
    `;
  } else {
    basketList.innerHTML = basket
      .map((x, idx) => {
        const qty = Number(x.qty) || 1;

        return `
        <div class="bitem">
          <div style="display:flex; gap:10px; align-items:flex-start; width:100%;">
            ${
              x.variantImg
                ? `<img src="${escapeHtml(
                    x.variantImg
                  )}" alt="" style="width:54px;height:54px;border-radius:14px;object-fit:cover;border:1px solid rgba(255,255,255,.10)" loading="lazy" decoding="async">`
                : ""
            }
            <div style="flex:1; min-width:0;">
              <div class="bitem__name" style="font-weight:900;">${escapeHtml(x.name)}</div>
              <div class="bitem__meta muted" style="font-size:12px;opacity:.8;">
                ${escapeHtml(x.category || "")}${x.variantName ? " · " + escapeHtml(x.variantName) : ""}
              </div>

              <div style="margin-top:10px; display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                <button class="btn" type="button" data-qminus="${idx}" style="width:auto; height:40px; padding:0 12px;">−</button>
                <div style="min-width:42px; text-align:center; font-weight:1000;">${qty}</div>
                <button class="btn" type="button" data-qplus="${idx}" style="width:auto; height:40px; padding:0 12px;">+</button>
                <button class="btn" type="button" data-del="${idx}" style="width:auto; height:40px; padding:0 12px;">${escapeHtml(
                  t("basket.remove")
                )}</button>
              </div>
            </div>
          </div>
        </div>
      `;
      })
      .join("");

    basketList.querySelectorAll("[data-qplus]").forEach((b) => {
      b.addEventListener("click", () => {
        const i = Number(b.dataset.qplus);
        if (!basket[i]) return;
        basket[i].qty = clampInt((Number(basket[i].qty) || 1) + 1, 1, 999);
        saveBasket(basket);
        updateBasketCount();
        renderBasket();
      });
    });

    basketList.querySelectorAll("[data-qminus]").forEach((b) => {
      b.addEventListener("click", () => {
        const i = Number(b.dataset.qminus);
        if (!basket[i]) return;
        const newQty = clampInt((Number(basket[i].qty) || 1) - 1, 0, 999);
        if (newQty <= 0) basket.splice(i, 1);
        else basket[i].qty = newQty;
        saveBasket(basket);
        updateBasketCount();
        renderBasket();
      });
    });

    basketList.querySelectorAll("[data-del]").forEach((b) => {
      b.addEventListener("click", () => {
        basket.splice(Number(b.dataset.del), 1);
        saveBasket(basket);
        updateBasketCount();
        renderBasket();
      });
    });
  }

  if (bSend) bSend.href = waLink(buildBasketMsg());
}

function buildBasketMsg() {
  const site = safeSiteUrl();
  const base = "Hola 👋 Quiero cotizar/consultar disponibilidad mayorista.";

  if (!basket?.length) {
    return `${base}

¿Me pasan catálogo, stock y mínimos?

📍 Localidad: …
🧵 Uso: tapicería / marroquinería / cortinería
🔗 Link: ${site}`;
  }

  const totalUnits = basket.reduce((acc, x) => acc + (Number(x.qty) || 1), 0);

  const items = basket
    .map((x) => {
      const qty = Number(x.qty) || 1;
      const color = x.variantName ? ` · Color: ${x.variantName}` : "";
      const cat = x.category ? ` (${x.category})` : "";
      return `• x${qty} ${x.name}${cat}${color}`;
    })
    .join("\n");

  return `${base}

📋 Lista:
${items}

📦 Total de unidades: ${totalUnits}

📍 Localidad: …
🧵 Uso: tapicería / marroquinería / cortinería
🧾 Cantidad por color: (si aplica)

🔗 Link: ${site}

¿Me confirmás stock, colores y mínimos?`;
}

function loadBasket() {
  try {
    const raw = JSON.parse(localStorage.getItem("impac2_basket") || "[]");
    if (!Array.isArray(raw)) return [];

    return raw
      .map((x) => ({
        id: x?.id ?? null,
        name: x?.name ?? "",
        category: x?.category ?? "",
        variantId: x?.variantId ?? null,
        variantName: x?.variantName ?? null,
        variantImg: x?.variantImg ?? null,
        qty: clampInt(Number(x?.qty ?? 1), 1, 999),
      }))
      .filter((x) => x.id);
  } catch {
    return [];
  }
}

function saveBasket(v) {
  try {
    localStorage.setItem("impac2_basket", JSON.stringify(v || []));
  } catch {}
}

/* ========= FAVORITES ========= */
function favKey(id) {
  return String(id);
}

function loadFavs() {
  try {
    const raw = JSON.parse(localStorage.getItem("impac2_favs") || "[]");
    return new Set(Array.isArray(raw) ? raw : []);
  } catch {
    return new Set();
  }
}

function saveFavs() {
  try {
    localStorage.setItem("impac2_favs", JSON.stringify(Array.from(favs)));
  } catch {}
}

function isFavProduct(p) {
  return favs.has(favKey(p.id));
}

function toggleFavProduct(p) {
  const k = favKey(p.id);
  if (favs.has(k)) favs.delete(k);
  else favs.add(k);
  saveFavs();
}

/* ========= CATEGORIES / CONTACT ========= */
function renderCategories() {
  if (!hotspotsEl) return;

  if (pageCanvas) pageCanvas.style.backgroundImage = "";

  const counts = categoryCounts();
  const cats = (DB.categories || [])
    .filter((c) => c && c !== "Todo")
    .filter((c) => (counts.get(c) || 0) > 0);

  hotspotsEl.innerHTML = `
    <div class="grid">
      ${
        cats.length
          ? cats
              .map(
                (c) => `
        <div class="card">
          <div class="card__title">${escapeHtml(c)}</div>
          <div class="card__text">${escapeHtml(t("cats.view", { c }))}</div>
          <div style="margin-top:10px">
            <button class="btn btn--primary" data-cat="${escapeHtml(c)}">${escapeHtml(
                  t("cats.explore")
                )}</button>
          </div>
        </div>
      `
              )
              .join("")
          : `
        <div class="card">
          <div class="card__title">${escapeHtml(t("cats.none.title"))}</div>
          <div class="card__text">${escapeHtml(t("cats.none.text"))}</div>
        </div>
      `
      }
    </div>
  `;

  hotspotsEl.querySelectorAll("[data-cat]").forEach((el) => {
    el.addEventListener("click", () => {
      currentCat = el.dataset.cat || "Todo";
      currentView = "productos";
      query = "";
      if (searchInput) searchInput.value = "";
      writeUrlState({ replace: false });
      rafRender();
    });
  });

  const t1 = document.querySelector(".topbar__title");
  const t2 = document.querySelector(".topbar__subtitle");
  if (t1) t1.textContent = t("cats.title");
  if (t2) t2.textContent = t("cats.subtitle");
}

function renderContact() {
  if (!hotspotsEl) return;

  if (pageCanvas) pageCanvas.style.backgroundImage = "";

  hotspotsEl.innerHTML = `
    <div class="grid">
      <div class="card">
        <div class="card__title">${escapeHtml(t("contact.wa.title"))}</div>
        <div class="card__text">${escapeHtml(t("contact.wa.text"))}</div>
        <div style="margin-top:10px">
          <a class="btn btn--primary" href="${waLink(
            "Hola 👋 Quiero catálogo mayorista, stock, mínimos y tiempos. Estoy en..."
          )}" target="_blank" rel="noopener">${escapeHtml(t("contact.wa.btn"))}</a>
        </div>
      </div>
      <div class="card">
        <div class="card__title">${escapeHtml(t("contact.send.title"))}</div>
        <div class="card__text">${escapeHtml(t("contact.send.text"))}</div>
      </div>
      <div class="card">
        <div class="card__title">${escapeHtml(t("contact.cart.title"))}</div>
        <div class="card__text">${escapeHtml(t("contact.cart.text"))}</div>
        <div style="margin-top:10px">
          <button class="btn btn--primary" id="openBasketFromContact">${escapeHtml(
            t("contact.cart.btn")
          )}</button>
        </div>
      </div>
    </div>
  `;

  $("openBasketFromContact")?.addEventListener("click", () => {
    renderBasket();
    openDialog(basketModal);
  });

  const t1 = document.querySelector(".topbar__title");
  const t2 = document.querySelector(".topbar__subtitle");
  if (t1) t1.textContent = t("contact.title");
  if (t2) t2.textContent = t("contact.subtitle");
}

/* ========= PDF ========= */
async function openPdfBestEffort() {
  for (const path of PDF_CANDIDATES) {
    try {
      const r = await fetch(path, { cache: "no-store" });
      if (r.ok) {
        if (pdfViewer && pdfFrame) {
          pdfFrame.src = path;
          pdfViewer.classList.remove("is-hidden");
        } else {
          window.open(path, "_blank", "noopener");
        }
        return;
      }
    } catch {}
  }
  showToast(t("pdf.missing"), {
    rich: true,
    title: t("pdf.title"),
    variant: "warn",
    duration: 2600,
    actionText: t("toast.ok"),
  });
}

function closePdf() {
  if (!pdfViewer || !pdfFrame) return;
  pdfViewer.classList.add("is-hidden");
  pdfFrame.src = "";
}

/* ========= HELPERS ========= */
function openDrawer(open) {
  drawer?.classList.toggle("is-open", open);
  drawer?.setAttribute("aria-hidden", open ? "false" : "true");
  btnMenu?.setAttribute("aria-expanded", open ? "true" : "false");
}

function waLink(msg, number = WHATSAPP_NUMBER) {
  const txt = encodeURIComponent(msg);
  return `https://wa.me/${number}?text=${txt}`;
}

function safeSiteUrl() {
  try {
    const u = new URL(window.location.href);
    u.hash = "";
    return u.toString();
  } catch {
    return "https://gonzalo22gf.github.io/TP3/";
  }
}

function clampInt(n, min, max) {
  const v = Number.isFinite(n) ? Math.trunc(n) : min;
  return Math.max(min, Math.min(max, v));
}

function openDialog(dlg) {
  if (!dlg) return;
  try {
    if (typeof dlg.showModal === "function") dlg.showModal();
    else dlg.setAttribute("open", "true");
  } catch {
    dlg.setAttribute("open", "true");
  }
}

function closeDialog(dlg) {
  if (!dlg) return;
  try {
    if (dlg.open) dlg.close();
    else dlg.removeAttribute("open");
  } catch {
    dlg.removeAttribute("open");
  }
}

/* ========= MAG STORAGE ========= */
function loadMagPage() {
  try {
    const n = Number(localStorage.getItem(LS_PAGE));
    return Number.isFinite(n) ? Math.trunc(n) : 0;
  } catch {
    return 0;
  }
}

function loadMagMode() {
  try {
    const m = String(localStorage.getItem(LS_MODE) || "home");
    return m === "mag" ? "mag" : "home";
  } catch {
    return "home";
  }
}

function saveMagState() {
  try {
    localStorage.setItem(LS_PAGE, String(pageIndex));
    localStorage.setItem(LS_MODE, String(revistaMode));
  } catch {}
}

/* ========= TOAST ========= */
function showToast(text, opts = {}) {
  if (!toast) return;

  const {
    title = "Listo",
    variant = "success",
    actionText = "Ver 🛒",
    onAction = null,
    duration = 2600,
    rich = false,
  } = opts;

  toast.style.setProperty("--toast-ms", `${duration}ms`);

  if (!rich) {
    toast.textContent = text;
  } else {
    toast.innerHTML = `
      <div class="toast__icon" aria-hidden="true">${
        variant === "success" ? "✅" : variant === "warn" ? "⚠️" : "ℹ️"
      }</div>
      <div class="toast__content">
        <div class="toast__title">${escapeHtml(title)}</div>
        <div class="toast__text">${escapeHtml(text)}</div>
      </div>
      <button class="toast__action" type="button">${escapeHtml(actionText)}</button>
    `;

    const btn = toast.querySelector(".toast__action");
    if (btn) {
      btn.onclick = () => {
        toast.classList.remove("is-show");
        if (typeof onAction === "function") onAction();
      };
    }
  }

  toast.classList.remove("is-show");
  void toast.offsetWidth;
  toast.classList.add("is-show");

  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("is-show"), duration);
}

function shorten(str, max) {
  if (!str) return "";
  return str.length <= max ? str : str.slice(0, max - 1) + "…";
}

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
