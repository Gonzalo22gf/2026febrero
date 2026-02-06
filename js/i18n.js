/* =========================================================
   IMPAC2 — i18n.js (SAFE / NO-CRASH) v1.0.1
   - ?lang=es | ?lang=en  (y lo persiste)
   - localStorage: impac2_lang
   - data-i18n -> textContent
   - data-i18n-placeholder -> placeholder
   - data-i18n-title -> title
   - data-i18n-aria -> aria-label
   - MutationObserver para cambios dinámicos (sin romper)
   ========================================================= */

(() => {
  "use strict";

  const LS_LANG = "impac2_lang";
  const FALLBACK_LANG = "es";
  const SUPPORTED = new Set(["es", "en"]);

  const DICT = {
    es: {
      "ui.home": "Inicio",
      "ui.categories": "Categorías",
      "ui.cart": "Carrito",
      "ui.cartOpen": "Abrir carrito",
      "ui.pdf": "Ver catálogo (PDF)",
      "ui.close": "Cerrar",

      "top.title": "Elegí la tela",
      "top.subtitle": "¿Para qué la necesitás?",

      "search.placeholder": "Buscar tela, uso, color…",
      "search.aria": "Buscar tela, uso o color",
      "search.clear": "Limpiar",

      "brand.sub": "Catálogo digital · Mayoristas",

      "nav.home": "🏠 Inicio",
      "nav.products": "🧵 Productos",
      "nav.categories": "🏷️ Categorías",
      "nav.contact": "💬 Contacto",
      "nav.pdf": "⬇️ Ver catálogo (PDF)",

      "drawer.title": "Venta mayorista",
      "drawer.text": "Pedí lista, mínimos y stock por WhatsApp.",
      "drawer.wa": "WhatsApp",

      "noscript.title": "JavaScript requerido",
      "noscript.text": "Para usar el catálogo (búsqueda, colores y carrito) necesitás habilitar JavaScript.",

      "pdf.title": "Catálogo",

      "modal.kicker": "Elegí el color",
      "modal.add": "Agregar al carrito",
      "modal.ask": "Consultar por WhatsApp",
      "modal.hint": "*Stock y mínimos se confirman por canal comercial.",

      "basket.title": "Carrito",
      "basket.subtitle": "Armá tu lista y enviála por WhatsApp",
      "basket.clear": "Vaciar",
      "basket.send": "Enviar por WhatsApp",
    },

    en: {
      "ui.home": "Home",
      "ui.categories": "Categories",
      "ui.cart": "Cart",
      "ui.cartOpen": "Open cart",
      "ui.pdf": "View catalog (PDF)",
      "ui.close": "Close",

      "top.title": "Choose the fabric",
      "top.subtitle": "What do you need it for?",

      "search.placeholder": "Search fabric, use, color…",
      "search.aria": "Search by fabric, use or color",
      "search.clear": "Clear",

      "brand.sub": "Digital catalog · Wholesale",

      "nav.home": "🏠 Home",
      "nav.products": "🧵 Products",
      "nav.categories": "🏷️ Categories",
      "nav.contact": "💬 Contact",
      "nav.pdf": "⬇️ View catalog (PDF)",

      "drawer.title": "Wholesale",
      "drawer.text": "Ask price list, minimums and stock on WhatsApp.",
      "drawer.wa": "WhatsApp",

      "noscript.title": "JavaScript required",
      "noscript.text": "To use the catalog (search, colors and cart) you need to enable JavaScript.",

      "pdf.title": "Catalog",

      "modal.kicker": "Choose a color",
      "modal.add": "Add to cart",
      "modal.ask": "Ask on WhatsApp",
      "modal.hint": "*Stock and minimums are confirmed via sales channel.",

      "basket.title": "Cart",
      "basket.subtitle": "Build your list and send it on WhatsApp",
      "basket.clear": "Clear",
      "basket.send": "Send on WhatsApp",
    },
  };

  function normalizeLang(v) {
    const s = String(v || "").trim().toLowerCase();
    if (SUPPORTED.has(s)) return s;
    const base = s.split("-")[0];
    return SUPPORTED.has(base) ? base : null;
  }

  function getQueryLang() {
    try {
      const u = new URL(window.location.href);
      return normalizeLang(u.searchParams.get("lang"));
    } catch {
      return null;
    }
  }

  function getStoredLang() {
    try {
      return normalizeLang(localStorage.getItem(LS_LANG));
    } catch {
      return null;
    }
  }

  function setStoredLang(lang) {
    try {
      localStorage.setItem(LS_LANG, lang);
    } catch {}
  }

  let LANG = getQueryLang() || getStoredLang() || FALLBACK_LANG;
  if (!SUPPORTED.has(LANG)) LANG = FALLBACK_LANG;

  function t(key) {
    const dict = DICT[LANG] || DICT[FALLBACK_LANG] || {};
    const fb = DICT[FALLBACK_LANG] || {};
    return dict[key] ?? fb[key] ?? null;
  }

  function applyText(root) {
    root.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = t(key);
      if (val != null) el.textContent = val;
    });
  }

  function applyAttr(root, attrName, realAttr) {
    root.querySelectorAll(`[${attrName}]`).forEach((el) => {
      const key = el.getAttribute(attrName);
      const val = t(key);
      if (val != null) el.setAttribute(realAttr, val);
    });
  }

  function apply(root = document) {
    try {
      applyText(root);
      applyAttr(root, "data-i18n-placeholder", "placeholder");
      applyAttr(root, "data-i18n-title", "title");
      applyAttr(root, "data-i18n-aria", "aria-label");

      document.documentElement.setAttribute("lang", LANG);
    } catch (e) {
      // nunca romper la app
      console.warn("[i18n] apply failed:", e);
    }
  }

  function setLang(next) {
    const v = normalizeLang(next);
    if (!v) return;
    LANG = v;
    setStoredLang(LANG);
    apply(document);
  }

  // Guardar lang si vino por URL (para que persista)
  const ql = getQueryLang();
  if (ql && ql !== getStoredLang()) setStoredLang(ql);

  // MutationObserver (por si el DOM cambia por render)
  let mo = null;
  function startObserver() {
    try {
      if (mo) mo.disconnect();
      mo = new MutationObserver((mutations) => {
        // Re-aplicar solo si aparecen nodos con data-i18n*
        for (const m of mutations) {
          for (const n of m.addedNodes || []) {
            if (!(n instanceof Element)) continue;
            if (
              n.matches?.("[data-i18n],[data-i18n-placeholder],[data-i18n-title],[data-i18n-aria]") ||
              n.querySelector?.("[data-i18n],[data-i18n-placeholder],[data-i18n-title],[data-i18n-aria]")
            ) {
              apply(n);
            }
          }
        }
      });

      mo.observe(document.documentElement, { childList: true, subtree: true });
    } catch (e) {
      console.warn("[i18n] observer failed:", e);
    }
  }

  // API pública (por si querés botón de idioma)
  window.I18N = {
    t,
    apply,
    setLang,
    get lang() {
      return LANG;
    },
  };

  // Aplicar al cargar
  const run = () => {
    apply(document);
    startObserver();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
})();