/**
 * js/pages/foods.js
 * Controller for foods.html — everything here reads NutriApp.foodList and
 * renders through NutriApp.components.renderFoodCard; no card HTML is
 * written by hand anywhere in this file.
 */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var NutriApp = window.NutriApp;
    if (!NutriApp || !NutriApp.foodList) {
      console.error("[foods page] NutriApp data did not load — check the script tags on this page.");
      return;
    }
    var fmt = NutriApp.formatters;
    var allFoods = NutriApp.foodList.slice();

    var grid = document.getElementById("foodGrid");
    var emptyState = document.getElementById("emptyState");
    var resultCount = document.getElementById("resultCount");
    var searchInput = document.getElementById("foodSearch");
    var sortSelect = document.getElementById("sortSelect");
    var clearBtn = document.getElementById("clearFilters");
    var emptyClearBtn = document.getElementById("emptyClearFilters");
    var groups = {
      category: document.getElementById("categoryChips"),
      diet: document.getElementById("dietChips"),
      nutri: document.getElementById("nutriChips"),
      budget: document.getElementById("budgetChips")
    };

    var defaultState = { q: "", category: "all", diet: "all", nutri: "all", budget: "all", sort: "name" };
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
      return b;
    }

    // Categories come from the data itself, never hand-typed, so a new
    // food.js category shows up here automatically.
    var categories = Array.from(new Set(allFoods.map(function (f) { return f.category; }))).sort();
    addChip(groups.category, "all", "All", "category");
    categories.forEach(function (c) { addChip(groups.category, c, fmt.titleCaseSlug(c), "category"); });

    addChip(groups.diet, "all", "All", "diet");
    addChip(groups.diet, "vegan", "Vegan", "diet");
    addChip(groups.diet, "vegetarian", "Vegetarian", "diet");
    addChip(groups.diet, "non-vegetarian", "Non-vegetarian", "diet");

    addChip(groups.nutri, "all", "All", "nutri");
    addChip(groups.nutri, "high-protein", "High protein", "nutri");
    addChip(groups.nutri, "low-calorie", "Low calorie", "nutri");
    addChip(groups.nutri, "high-fiber", "High fiber", "nutri");

    addChip(groups.budget, "all", "Any budget", "budget");
    addChip(groups.budget, "30", "Under \u20B930", "budget");
    addChip(groups.budget, "50", "Under \u20B950", "budget");
    addChip(groups.budget, "100", "Under \u20B9100", "budget");
    addChip(groups.budget, "150", "Under \u20B9150", "budget");

    function matches(f) {
      if (state.q && f.name.toLowerCase().indexOf(state.q) === -1) return false;
      if (state.category !== "all" && f.category !== state.category) return false;
      if (state.diet !== "all" && f.dietType !== state.diet) return false;
      if (state.nutri === "high-protein" && f.nutritionPer100g.protein < 12) return false;
      if (state.nutri === "low-calorie" && f.nutritionPer100g.calories > 100) return false;
      if (state.nutri === "high-fiber" && f.nutritionPer100g.fiber < 6) return false;
      if (state.budget !== "all" && f.estimatedCostPer100g >= Number(state.budget)) return false;
      return true;
    }

    function sortFn(a, b) {
      if (state.sort === "protein") return b.nutritionPer100g.protein - a.nutritionPer100g.protein;
      if (state.sort === "calories") return a.nutritionPer100g.calories - b.nutritionPer100g.calories;
      if (state.sort === "cost") return a.estimatedCostPer100g - b.estimatedCostPer100g;
      return a.name.localeCompare(b.name);
    }

    function render() {
      var results = allFoods.filter(matches).sort(sortFn);
      resultCount.textContent = results.length + (results.length === 1 ? " food" : " foods");
      if (results.length === 0) {
        grid.innerHTML = "";
        emptyState.hidden = false;
      } else {
        emptyState.hidden = true;
        grid.innerHTML = results.map(function (f) { return NutriApp.components.renderFoodCard(f); }).join("");
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

    searchInput.addEventListener("input", function () {
      state.q = searchInput.value.trim().toLowerCase();
      render();
    });
    sortSelect.addEventListener("change", function () {
      state.sort = sortSelect.value;
      render();
    });
    clearBtn.addEventListener("click", resetFilters);
    if (emptyClearBtn) emptyClearBtn.addEventListener("click", resetFilters);

    render();
  });
})();
