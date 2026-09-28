/**
 * js/pages/recipes.js
 * Controller for recipes.html.
 */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var NutriApp = window.NutriApp;
    if (!NutriApp || !NutriApp.recipes) {
      console.error("[recipes page] NutriApp data did not load — check the script tags on this page.");
      return;
    }

    // A recipe whose ingredients can't be fully resolved (see foods.js's
    // note on idli-sambar/dosa-sambar) would only show broken 0-nutrition
    // cards — skip it here rather than display incorrect data, with a
    // console.warn so it stays visible to whoever's building the app.
    function isComplete(r) {
      var ok = r.ingredients.every(function (ing) { return !!NutriApp.foods[ing.foodId]; });
      if (!ok) console.warn("[recipes page] hiding '" + r.id + "' — references a food that no longer exists.");
      return ok;
    }
    var allRecipes = NutriApp.recipes.filter(isComplete);

    var grid = document.getElementById("recipeGrid");
    var emptyState = document.getElementById("emptyState");
    var resultCount = document.getElementById("resultCount");
    var searchInput = document.getElementById("recipeSearch");
    var sortSelect = document.getElementById("sortSelect");
    var clearBtn = document.getElementById("clearFilters");
    var emptyClearBtn = document.getElementById("emptyClearFilters");
    var filterChips = document.getElementById("filterChips");

    // One filter active at a time, "All Recipes" first. Each test reads the
    // recipe's own data — goals from tags, diet from dietType/ingredients,
    // meals from mealType — so a new recipe lands under the right chips
    // without touching this list. Egg dishes are dietType "non-vegetarian"
    // (see recipes.js), so they show under Egg and Non-Vegetarian but never
    // under Vegetarian.
    function hasTag(tag) { return function (r) { return r.tags.indexOf(tag) !== -1; }; }
    function forMeal(meal) { return function (r) { return r.mealType.indexOf(meal) !== -1; }; }
    var FILTERS = [
      { value: "all", emoji: "", label: "All Recipes", test: function () { return true; } },
      { value: "fat-loss", emoji: "🔥", label: "Fat Loss", test: hasTag("fat-loss") },
      { value: "muscle-building", emoji: "💪", label: "Muscle Building", test: hasTag("muscle-building") },
      { value: "high-protein", emoji: "🥩", label: "High Protein", test: hasTag("high-protein") },
      { value: "vegetarian", emoji: "🥗", label: "Vegetarian", test: function (r) { return r.dietType === "vegetarian" || r.dietType === "vegan"; } },
      { value: "egg", emoji: "🥚", label: "Egg", test: function (r) { return r.ingredients.some(function (ing) { return ing.foodId === "egg"; }); } },
      { value: "non-vegetarian", emoji: "🍗", label: "Non-Vegetarian", test: function (r) { return r.dietType === "non-vegetarian"; } },
      { value: "high-fiber", emoji: "🌾", label: "High Fiber", test: hasTag("high-fiber") },
      { value: "breakfast", emoji: "🍽️", label: "Breakfast", test: forMeal("breakfast") },
      { value: "lunch", emoji: "🥘", label: "Lunch", test: forMeal("lunch") },
      { value: "dinner", emoji: "🌙", label: "Dinner", test: forMeal("dinner") },
      { value: "snack", emoji: "🥜", label: "Snacks", test: forMeal("snack") }
    ];
    var filtersByValue = {};
    FILTERS.forEach(function (f) { filtersByValue[f.value] = f; });

    var defaultState = { q: "", filter: "all", sort: "name" };
    var state = Object.assign({}, defaultState);

    FILTERS.forEach(function (f) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      if (f.emoji) {
        var icon = document.createElement("span");
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = f.emoji + " ";
        b.appendChild(icon);
      }
      b.appendChild(document.createTextNode(f.label));
      b.setAttribute("data-value", f.value);
      b.setAttribute("aria-pressed", state.filter === f.value ? "true" : "false");
      b.addEventListener("click", function () {
        state.filter = f.value;
        Array.prototype.forEach.call(filterChips.children, function (c) {
          c.setAttribute("aria-pressed", c.getAttribute("data-value") === f.value ? "true" : "false");
        });
        render();
      });
      filterChips.appendChild(b);
    });

    function matches(r) {
      if (state.q && r.name.toLowerCase().indexOf(state.q) === -1) return false;
      return filtersByValue[state.filter].test(r);
    }

    function nutriOf(r) { return NutriApp.nutrition.calculateRecipeNutrition(r, NutriApp.foods); }

    function sortFn(a, b) {
      if (state.sort === "protein") return nutriOf(b).protein - nutriOf(a).protein;
      if (state.sort === "calories") return nutriOf(a).calories - nutriOf(b).calories;
      if (state.sort === "cost") return NutriApp.nutrition.calculateRecipeCost(a, NutriApp.foods) - NutriApp.nutrition.calculateRecipeCost(b, NutriApp.foods);
      if (state.sort === "time") return (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime);
      return a.name.localeCompare(b.name);
    }

    function render() {
      var results = allRecipes.filter(matches).sort(sortFn);
      resultCount.textContent = results.length + (results.length === 1 ? " recipe" : " recipes");
      if (results.length === 0) {
        grid.innerHTML = "";
        emptyState.hidden = false;
      } else {
        emptyState.hidden = true;
        grid.innerHTML = results.map(function (r) { return NutriApp.components.renderRecipeCard(r); }).join("");
      }
    }

    function resetFilters() {
      state = Object.assign({}, defaultState);
      searchInput.value = "";
      sortSelect.value = "name";
      Array.prototype.forEach.call(filterChips.children, function (c, i) {
        c.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      });
      render();
    }

    searchInput.addEventListener("input", function () { state.q = searchInput.value.trim().toLowerCase(); render(); });
    sortSelect.addEventListener("change", function () { state.sort = sortSelect.value; render(); });
    clearBtn.addEventListener("click", resetFilters);
    if (emptyClearBtn) emptyClearBtn.addEventListener("click", resetFilters);

    render();
  });
})();
