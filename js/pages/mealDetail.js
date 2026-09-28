/**
 * js/pages/mealDetail.js
 * Controller for meal.html — one TheMealDB recipe, loaded live through
 * NutriApp.mealDb.lookupMeal(). Ingredients the person has in their kitchen
 * (NutriApp.kitchenStore) are ticked off so they can see what to buy.
 * There's deliberately no nutrition here: see js/services/mealDb.js.
 */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  ready(function () {
    var NutriApp = window.NutriApp;
    var loading = document.getElementById("mealLoading");
    var notFound = document.getElementById("notFound");
    var content = document.getElementById("detailContent");

    function showNotFound(title, body) {
      loading.hidden = true;
      content.hidden = true;
      notFound.hidden = false;
      if (title) document.getElementById("notFoundTitle").textContent = title;
      if (body) document.getElementById("notFoundBody").textContent = body;
    }

    // TheMealDB ids are numeric; anything else can't be a real recipe.
    var id = new URLSearchParams(location.search).get("id");
    if (!id || !/^\d+$/.test(id) || !NutriApp || !NutriApp.mealDb) {
      showNotFound();
      return;
    }

    NutriApp.mealDb.lookupMeal(id).then(function (meal) {
      if (meal) render(meal);
      else showNotFound();
    }, function () {
      showNotFound("Couldn't load this recipe", "TheMealDB didn't respond. Check your connection and try again.");
    });

    function render(meal) {
      loading.hidden = true;
      notFound.hidden = true;
      content.hidden = false;

      document.title = meal.name + " – Nutrishian Diet";
      document.getElementById("mName").textContent = meal.name;
      document.getElementById("mMeta").textContent =
        [meal.category, meal.area, "from TheMealDB"].filter(Boolean).join(" · ");

      // Same pill as Nutrishian's own recipes; veg = no meat, fish or eggs
      // (see NutriApp.mealDb.dietOfMeal).
      var veg = NutriApp.mealDb.dietOfMeal(meal) === "veg";
      var dietEl = document.getElementById("mDiet");
      dietEl.textContent = veg ? "Vegetarian" : "Non-vegetarian";
      dietEl.className = "pill " + (veg ? "pill-vegetarian" : "pill-non-vegetarian");
      dietEl.hidden = false;

      document.getElementById("mTags").innerHTML = meal.tags.map(function (t) {
        return '<li class="chip" aria-disabled="true">' + escapeHtml(t) + "</li>";
      }).join("");

      var photoEl = document.getElementById("mPhoto");
      var photo = NutriApp.mealDb.imageSize(meal.thumb, "large");
      if (photo) {
        photoEl.outerHTML = '<img id="mPhoto" class="thumb detail-photo" src="' + escapeHtml(photo) + '" alt="' + escapeHtml(meal.name) + '">';
      } else {
        photoEl.textContent = meal.name.trim().charAt(0).toUpperCase();
      }

      var links = [];
      if (meal.youtube) links.push('<a class="btn btn-ghost btn-sm" href="' + escapeHtml(meal.youtube) + '" target="_blank" rel="noopener noreferrer">Watch on YouTube</a>');
      if (meal.source) links.push('<a class="btn btn-ghost btn-sm" href="' + escapeHtml(meal.source) + '" target="_blank" rel="noopener noreferrer">Original recipe</a>');
      document.getElementById("mLinks").innerHTML = links.join("");

      var have = {};
      NutriApp.kitchenStore.load().forEach(function (itemId) { have[itemId] = true; });
      var haveCount = 0;
      document.getElementById("mIngredients").innerHTML = meal.ingredients.map(function (ing) {
        var got = ing.itemId && have[ing.itemId];
        if (got) haveCount++;
        return "<li" + (got ? ' class="have"' : "") + ">" +
          "<span>" + escapeHtml(ing.name) + (got ? '<span class="have-tag">✓ In your kitchen</span>' : "") + "</span>" +
          "<b>" + escapeHtml(ing.measure) + "</b>" +
          "</li>";
      }).join("");
      document.getElementById("mHaveNote").textContent = haveCount
        ? "You have " + haveCount + " of these " + meal.ingredients.length + " ingredients."
        : "";

      document.getElementById("mInstructions").innerHTML = meal.steps.map(function (s) {
        return "<li>" + escapeHtml(s) + "</li>";
      }).join("");
    }
  });
})();
