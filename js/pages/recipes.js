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
    var fmt = NutriApp.formatters;

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
    var groups = {
      meal: document.getElementById("mealChips"),
      diet: document.getElementById("dietChips"),
      goal: document.getElementById("goalChips")
    };

    var defaultState = { q: "", meal: "all", diet: "all", goal: "all", sort: "name" };
    var state = Object.assign({}, defaultState);

    function addChip(container, value, label, groupKey) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = label;
      b.setAttribute("data-value", value);
      b.setAttribute("aria-pressed", state[groupKey] === value ? "true" : "false");
      b.addEventListener("click", function () {
        state[groupKey] = value;
        Array.prototype.forEach.call(container.children, function (c) {
          c.setAttribute("aria-pressed", c.getAttribute("data-value") === value ? "true" : "false");
        });
        render();
      });
      container.appendChild(b);
    }

    addChip(groups.meal, "all", "All", "meal");
    ["breakfast", "lunch", "dinner", "snack"].forEach(function (m) { addChip(groups.meal, m, fmt.capitalize(m), "meal"); });

    addChip(groups.diet, "all", "All", "diet");
    addChip(groups.diet, "vegetarian", "Vegetarian", "diet");
    addChip(groups.diet, "non-vegetarian", "Non-vegetarian", "diet");

    // Goal tags derived from the data itself, not hand-typed.
    var goalTags = Array.from(new Set(allRecipes.reduce(function (acc, r) { return acc.concat(r.tags); }, []))).sort();
    addChip(groups.goal, "all", "All", "goal");
    goalTags.forEach(function (t) { addChip(groups.goal, t, fmt.titleCaseSlug(t), "goal"); });

    function matches(r) {
      if (state.q && r.name.toLowerCase().indexOf(state.q) === -1) return false;
      if (state.meal !== "all" && r.mealType.indexOf(state.meal) === -1) return false;
      if (state.diet !== "all" && r.dietType !== state.diet) return false;
      if (state.goal !== "all" && r.tags.indexOf(state.goal) === -1) return false;
      return true;
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
      Object.keys(groups).forEach(function (key) {
        Array.prototype.forEach.call(groups[key].children, function (c, i) {
          c.setAttribute("aria-pressed", i === 0 ? "true" : "false");
        });
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
