/**
 * js/components/recipeCard.js
 * renderRecipeCard(recipe) -> HTML string for one recipe card. Nutrition
 * shown on the card is always computed through
 * NutriApp.nutrition.calculateRecipeNutrition() — never a stored total.
 */
(function (global) {
  "use strict";

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function photoOrPlaceholder(recipe) {
    if (recipe.image && recipe.image !== "placeholder") {
      return '<img class="thumb" src="' + encodeURI(recipe.image) + '" alt="' + escapeHtml(recipe.name) + '" loading="lazy">';
    }
    var letter = (recipe.name || "?").trim().charAt(0).toUpperCase();
    return '<div class="thumb ph" aria-hidden="true"><span>' + escapeHtml(letter) + "</span></div>";
  }

  function renderRecipeCard(recipe) {
    var fmt = global.NutriApp.formatters;
    var ICONS = global.NutriApp.components.iconSvg;
    var n = global.NutriApp.nutrition.formatNutrition(
      global.NutriApp.nutrition.calculateRecipeNutrition(recipe, global.NutriApp.foods)
    );
    var dietLabel = fmt.dietLabel(recipe.dietType);
    var timeTotal = (recipe.prepTime || 0) + (recipe.cookTime || 0);

    return (
      '<li class="food-card recipe-card" data-id="' + escapeHtml(recipe.id) + '">' +
        '<a class="fc-link" href="recipe-detail.html?id=' + encodeURIComponent(recipe.id) + '">' +
          photoOrPlaceholder(recipe) +
          '<div class="fc-body">' +
            '<div class="fc-top">' +
              "<h3>" + escapeHtml(recipe.name) + "</h3>" +
              (dietLabel ? '<span class="pill pill-' + recipe.dietType + '">' + dietLabel + "</span>" : "") +
            "</div>" +
            '<p class="rc-meta">' + timeTotal + " min &middot; " + escapeHtml(fmt.capitalize(recipe.mealType[0])) + "</p>" +
            '<ul class="fc-stats">' +
              "<li>" + ICONS("flame") + "<b>" + n.calories + "</b><span>kcal</span></li>" +
              "<li>" + ICONS("dumbbell") + "<b>" + fmt.formatGrams(n.protein) + "</b><span>protein</span></li>" +
              "<li>" + ICONS("wheat") + "<b>" + fmt.formatGrams(n.carbohydrates) + "</b><span>carbs</span></li>" +
              "<li>" + ICONS("drop") + "<b>" + fmt.formatGrams(n.fat) + "</b><span>fat</span></li>" +
            "</ul>" +
            '<div class="fc-foot">' +
              '<span class="rc-tags">' + recipe.tags.slice(0, 2).map(function (t) { return fmt.titleCaseSlug(t); }).join(" &middot; ") + "</span>" +
              '<span class="fc-view">View recipe \u2192</span>' +
            "</div>" +
          "</div>" +
        "</a>" +
      "</li>"
    );
  }

  global.NutriApp = global.NutriApp || {};
  global.NutriApp.components = global.NutriApp.components || {};
  global.NutriApp.components.renderRecipeCard = renderRecipeCard;
})(typeof window !== "undefined" ? window : globalThis);
