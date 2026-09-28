/**
 * js/utils/formatters.js
 * Small, reusable display-formatting helpers — kept separate from
 * nutrition.js because these format numbers for the screen rather than
 * calculate them (see "do not duplicate" / one job per module).
 */
(function (global) {
  "use strict";

  function formatCurrency(n) {
    if (typeof n !== "number" || isNaN(n)) return "—";
    return "\u20B9" + Math.round(n);
  }

  /** "6.7" -> "6.7g", "6.0" -> "6g" — never more than one decimal place. */
  function formatGrams(n) {
    if (typeof n !== "number" || isNaN(n)) return "—";
    var r = Math.round(n * 10) / 10;
    return (r % 1 === 0 ? r.toFixed(0) : r.toFixed(1)) + "g";
  }

  function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  }

  /** "egg-and-meat" -> "Egg & Meat", "nuts-and-seeds" -> "Nuts & Seeds" */
  function titleCaseSlug(slug) {
    return (slug || "").split("-").map(function (w) {
      return w === "and" ? "&" : capitalize(w);
    }).join(" ");
  }

  function dietLabel(dietType) {
    if (dietType === "non-vegetarian") return "Non-vegetarian";
    if (dietType === "vegan") return "Vegan";
    if (dietType === "vegetarian") return "Vegetarian";
    return "";
  }

  global.NutriApp = global.NutriApp || {};
  global.NutriApp.formatters = {
    formatCurrency: formatCurrency,
    formatGrams: formatGrams,
    capitalize: capitalize,
    titleCaseSlug: titleCaseSlug,
    dietLabel: dietLabel
  };
})(typeof window !== "undefined" ? window : globalThis);
