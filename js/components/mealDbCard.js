/**
 * js/components/mealDbCard.js
 * renderMealDbCard(meal, usesLabels) -> HTML string for one TheMealDB recipe
 * idea (meal as returned by NutriApp.mealDb.findMealsForKitchen). No
 * nutrition stats, on purpose: TheMealDB doesn't provide any, and a card
 * must never show numbers the app didn't calculate.
 */
(function (global) {
  "use strict";

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function renderMealDbCard(meal, usesLabels) {
    var thumb = global.NutriApp.mealDb.imageSize(meal.thumb, "medium");
    var photo = thumb
      ? '<img class="thumb" src="' + escapeHtml(thumb) + '" alt="' + escapeHtml(meal.name) + '" loading="lazy">'
      : '<div class="thumb ph" aria-hidden="true"><span>' + escapeHtml(meal.name.trim().charAt(0).toUpperCase()) + "</span></div>";

    return (
      '<li class="food-card" data-mealdb-id="' + escapeHtml(meal.id) + '">' +
        '<a class="fc-link" href="meal.html?id=' + encodeURIComponent(meal.id) + '">' +
          photo +
          '<div class="fc-body">' +
            '<div class="fc-top"><h3>' + escapeHtml(meal.name) + "</h3></div>" +
            '<p class="rc-meta">Uses: ' + escapeHtml(usesLabels.join(", ")) + "</p>" +
            '<div class="fc-foot">' +
              '<span class="rc-tags">TheMealDB</span>' +
              '<span class="fc-view">View recipe →</span>' +
            "</div>" +
          "</div>" +
        "</a>" +
      "</li>"
    );
  }

  global.NutriApp = global.NutriApp || {};
  global.NutriApp.components = global.NutriApp.components || {};
  global.NutriApp.components.renderMealDbCard = renderMealDbCard;
})(typeof window !== "undefined" ? window : globalThis);
