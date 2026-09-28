/**
 * js/pages/recipeDetail.js
 * Controller for recipe-detail.html. Every number on this page comes from
 * NutriApp.nutrition — servings scaling reuses the same
 * calculateRecipeNutrition(recipe, foods, {servings}) the spec describes
 * (1 serving 420 kcal -> 2 servings 840 kcal).
 */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var NutriApp = window.NutriApp;
    var fmt = NutriApp.formatters;

    var notFound = document.getElementById("notFound");
    var content = document.getElementById("detailContent");

    var params = new URLSearchParams(location.search);
    var id = params.get("id");
    var recipe = id ? NutriApp.recipesById[id] : null;
    var missingFood = recipe && recipe.ingredients.some(function (ing) { return !NutriApp.foods[ing.foodId]; });

    // Unknown id, or a recipe whose data is currently incomplete: a
    // friendly state, never a broken/zeroed-out page.
    if (!recipe || missingFood) {
      notFound.hidden = false;
      content.hidden = true;
      if (missingFood) {
        document.getElementById("notFoundTitle").textContent = "Recipe temporarily unavailable";
        document.getElementById("notFoundBody").textContent =
          "This recipe references an ingredient that isn't in the food database yet, so we can't show accurate nutrition for it.";
      }
      return;
    }
    notFound.hidden = true;
    content.hidden = false;

    document.title = recipe.name + " \u2013 Nutrishian Diet";
    document.getElementById("rName").textContent = recipe.name;
    document.getElementById("rMeta").textContent =
      (recipe.prepTime + recipe.cookTime) + " min total \u00b7 " + recipe.difficulty +
      (recipe.servingLabel ? " \u00b7 " + recipe.servingLabel : "");

    var dietEl = document.getElementById("rDiet");
    var dietLabel = fmt.dietLabel(recipe.dietType);
    if (dietLabel) { dietEl.textContent = dietLabel; dietEl.className = "pill pill-" + recipe.dietType; dietEl.hidden = false; }
    else dietEl.hidden = true;

    document.getElementById("rTags").innerHTML = recipe.tags.map(function (t) {
      return '<li class="chip" aria-disabled="true">' + fmt.titleCaseSlug(t) + "</li>";
    }).join("");

    var photoEl = document.getElementById("rPhoto");
    if (recipe.image && recipe.image !== "placeholder") {
      photoEl.outerHTML = '<img id="rPhoto" class="thumb detail-photo" src="' + encodeURI(recipe.image) + '" alt="' + recipe.name + '">';
    } else {
      photoEl.textContent = recipe.name.trim().charAt(0).toUpperCase();
    }

    document.getElementById("rInstructions").innerHTML = recipe.instructions.map(function (s) {
      return "<li>" + s + "</li>";
    }).join("");

    var servingsQty = document.getElementById("servingsQty");
    var servings = recipe.servings || 1;

    function setServings(s) {
      servings = Math.max(1, Math.min(10, Math.round(s)));
      servingsQty.textContent = servings;
      render();
    }
    document.getElementById("servingsDown").addEventListener("click", function () { setServings(servings - 1); });
    document.getElementById("servingsUp").addEventListener("click", function () { setServings(servings + 1); });

    function render() {
      var n = NutriApp.nutrition.formatNutrition(NutriApp.nutrition.calculateRecipeNutrition(recipe, NutriApp.foods, { servings: servings }));
      document.getElementById("nCal").textContent = n.calories;
      document.getElementById("nPro").textContent = fmt.formatGrams(n.protein);
      document.getElementById("nCarb").textContent = fmt.formatGrams(n.carbohydrates);
      document.getElementById("nFat").textContent = fmt.formatGrams(n.fat);
      document.getElementById("nFib").textContent = fmt.formatGrams(n.fiber);

      var cost = NutriApp.nutrition.calculateRecipeCost(recipe, NutriApp.foods, { servings: servings });
      document.getElementById("rCost").textContent = fmt.formatCurrency(cost);

      var scale = servings / (recipe.servings || 1);
      document.getElementById("rIngredients").innerHTML = recipe.ingredients.map(function (ing) {
        var food = NutriApp.foods[ing.foodId];
        var qty = ing.quantity * scale;
        var text = ing.unit === "g" || ing.unit === "ml"
          ? fmt.formatGrams(qty)
          : (Math.round(qty * 10) / 10) + " " + ing.unit + (qty === 1 ? "" : "s");
        return "<li><span>" + food.name + "</span><b>" + text + "</b></li>";
      }).join("");
    }

    render();
  });
})();
