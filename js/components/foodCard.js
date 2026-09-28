/**
 * js/components/foodCard.js
 * renderFoodCard(food) -> HTML string for one food card. The only place a
 * food card's markup is written — foods.html (and anywhere else a food
 * grid is needed later) calls this instead of hand-writing cards per doc:
 * "Cards must be generated dynamically using JavaScript. Do NOT duplicate
 * HTML cards manually."
 */
(function (global) {
  "use strict";

  var ICONS = {
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    dumbbell: '<path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/>',
    wheat: '<path d="M12 21V4"/><path d="M12 9c-2.4 0-3.6-1.4-3.6-3.6C10.8 5.4 12 6.6 12 9zM12 9c2.4 0 3.6-1.4 3.6-3.6C13.2 5.4 12 6.6 12 9z"/><path d="M12 15c-2.4 0-3.6-1.4-3.6-3.6C10.8 11.4 12 12.6 12 15zM12 15c2.4 0 3.6-1.4 3.6-3.6C13.2 11.4 12 12.6 12 15z"/>',
    drop: '<path d="M12 3c3.6 4 6 7.2 6 10.2A6 6 0 0 1 6 13.2C6 10.2 8.4 7 12 3z"/>',
    leaf: '<path d="M20 4C10.5 4 5 9 5 15.5c0 1.7.5 3.2 1.4 4.5"/><path d="M20 4c0 9.5-5 14.5-13.6 16"/><path d="M6.4 20C8.8 15.3 12 12 16 9.5"/>'
  };

  function iconSvg(name, size) {
    size = size || 14;
    return '<svg class="i" viewBox="0 0 24 24" width="' + size + '" height="' + size +
      '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICONS[name] || "") + "</svg>";
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /** No real photos yet (see IMAGE HANDLING) — a plain initial-letter tile
   *  stands in rather than a fake or broken image path. */
  function placeholderThumb(food) {
    var letter = (food.name || "?").trim().charAt(0).toUpperCase();
    return '<div class="thumb ph" aria-hidden="true"><span>' + escapeHtml(letter) + "</span></div>";
  }

  function renderFoodCard(food) {
    var fmt = global.NutriApp.formatters;
    var n = food.nutritionPer100g;
    var dietLabel = fmt.dietLabel(food.dietType);
    return (
      '<li class="food-card" data-id="' + escapeHtml(food.id) + '">' +
        '<a class="fc-link" href="food-detail.html?id=' + encodeURIComponent(food.id) + '">' +
          placeholderThumb(food) +
          '<div class="fc-body">' +
            '<div class="fc-top">' +
              "<h3>" + escapeHtml(food.name) + "</h3>" +
              (dietLabel ? '<span class="pill pill-' + food.dietType + '">' + dietLabel + "</span>" : "") +
            "</div>" +
            '<ul class="fc-stats">' +
              "<li>" + iconSvg("flame") + "<b>" + Math.round(n.calories) + "</b><span>kcal</span></li>" +
              "<li>" + iconSvg("dumbbell") + "<b>" + fmt.formatGrams(n.protein) + "</b><span>protein</span></li>" +
              "<li>" + iconSvg("wheat") + "<b>" + fmt.formatGrams(n.carbohydrates) + "</b><span>carbs</span></li>" +
              "<li>" + iconSvg("drop") + "<b>" + fmt.formatGrams(n.fat) + "</b><span>fat</span></li>" +
            "</ul>" +
            '<div class="fc-foot">' +
              '<span class="fc-cost">' + fmt.formatCurrency(food.estimatedCostPer100g) + " <small>/100g est.</small></span>" +
              '<span class="fc-view">View details \u2192</span>' +
            "</div>" +
          "</div>" +
        "</a>" +
      "</li>"
    );
  }

  global.NutriApp = global.NutriApp || {};
  global.NutriApp.components = global.NutriApp.components || {};
  global.NutriApp.components.renderFoodCard = renderFoodCard;
  global.NutriApp.components.iconSvg = iconSvg;
})(typeof window !== "undefined" ? window : globalThis);
