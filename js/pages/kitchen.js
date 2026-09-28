/**
 * js/pages/kitchen.js
 * Controller for the "What's in your kitchen?" section of foods.html. The
 * person taps what they have at home; NutriApp.recipeMatch finds recipes
 * they can cook now (full recipe cards) and ones missing one or two
 * ingredients (compact rows saying what to get), then NutriApp.mealDb adds
 * extra ideas from TheMealDB below them. A Show filter (All / Veg /
 * Non-veg) narrows both lists. The selection and the filter are kept by
 * NutriApp.kitchenStore so they survive opening a recipe and coming back.
 */
(function () {
  "use strict";

  var MEALDB_LIMIT = 12;
  var MEALDB_DELAY_MS = 350;
  // With Veg / Non-veg on, how far down TheMealDB's ranking to look for
  // matching meals before settling for fewer than MEALDB_LIMIT.
  var MEALDB_MAX_CHECKS = 60;

  // Veg = no meat, fish or eggs, for both Nutrishian recipes (their
  // dietType — egg dishes are "non-vegetarian") and TheMealDB ideas (see
  // NutriApp.mealDb.dietOf).
  var DIETS = [
    { value: "all", emoji: "", label: "All", word: "" },
    { value: "veg", emoji: "🥗", label: "Veg", word: "veg " },
    { value: "non-veg", emoji: "🍗", label: "Non-veg", word: "non-veg " }
  ];

  function recipeMatchesDiet(recipe, diet) {
    if (diet === "veg") return recipe.dietType === "vegetarian" || recipe.dietType === "vegan";
    if (diet === "non-veg") return recipe.dietType === "non-vegetarian";
    return true;
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function plural(n, word) {
    return n + " " + word + (n === 1 ? "" : "s");
  }

  ready(function () {
    var NutriApp = window.NutriApp;
    if (!NutriApp || !NutriApp.recipes || !NutriApp.recipeMatch) {
      console.error("[kitchen] NutriApp data did not load — check the script tags on this page.");
      return;
    }
    var fmt = NutriApp.formatters;
    var match = NutriApp.recipeMatch;
    var store = NutriApp.kitchenStore;
    var mealDb = NutriApp.mealDb;

    var picker = document.getElementById("kitchenPicker");
    var clearBtn = document.getElementById("kitchenClear");
    var summary = document.getElementById("kitchenSummary");
    var readyBlock = document.getElementById("kitchenReadyBlock");
    var readyGrid = document.getElementById("kitchenReadyGrid");
    var almostBlock = document.getElementById("kitchenAlmostBlock");
    var almostList = document.getElementById("kitchenAlmostList");
    var mealDbBlock = document.getElementById("mealDbBlock");
    var mealDbStatus = document.getElementById("mealDbStatus");
    var mealDbGrid = document.getElementById("mealDbGrid");

    var items = match.pickableItems(NutriApp.recipes, NutriApp.foods);
    var labelOf = {};
    items.forEach(function (item) { labelOf[item.id] = item.label; });

    // Drop anything saved that's no longer an ingredient of any recipe.
    var selected = {};
    store.load().forEach(function (id) { if (labelOf[id]) selected[id] = true; });

    var diet = store.loadDiet();
    var dietChips = document.getElementById("kitchenDiet");
    DIETS.forEach(function (d) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      if (d.emoji) {
        var icon = document.createElement("span");
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = d.emoji + " ";
        b.appendChild(icon);
      }
      b.appendChild(document.createTextNode(d.label));
      b.setAttribute("data-value", d.value);
      b.setAttribute("aria-pressed", diet === d.value ? "true" : "false");
      b.addEventListener("click", function () {
        diet = d.value;
        Array.prototype.forEach.call(dietChips.children, function (c) {
          c.setAttribute("aria-pressed", c.getAttribute("data-value") === d.value ? "true" : "false");
        });
        store.saveDiet(diet);
        render();
      });
      dietChips.appendChild(b);
    });

    function dietWord() {
      return DIETS.filter(function (d) { return d.value === diet; })[0].word;
    }

    // One chip group per food category, categories A–Z.
    var categories = Array.from(new Set(items.map(function (item) { return item.category; }))).sort();
    categories.forEach(function (category) {
      var group = document.createElement("div");
      var heading = document.createElement("h3");
      heading.id = "kitchenCat-" + category;
      heading.textContent = fmt.titleCaseSlug(category);
      var chips = document.createElement("div");
      chips.className = "chip-group";
      chips.setAttribute("role", "group");
      chips.setAttribute("aria-labelledby", heading.id);

      items.filter(function (item) { return item.category === category; }).forEach(function (item) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "chip";
        b.textContent = item.label;
        b.setAttribute("data-value", item.id);
        b.setAttribute("aria-pressed", selected[item.id] ? "true" : "false");
        b.addEventListener("click", function () {
          if (selected[item.id]) delete selected[item.id];
          else selected[item.id] = true;
          b.setAttribute("aria-pressed", selected[item.id] ? "true" : "false");
          store.save(Object.keys(selected));
          render();
        });
        chips.appendChild(b);
      });

      group.appendChild(heading);
      group.appendChild(chips);
      picker.appendChild(group);
    });

    function renderAlmostRow(m) {
      var n = NutriApp.nutrition.formatNutrition(NutriApp.nutrition.calculateRecipeNutrition(m.recipe, NutriApp.foods));
      return (
        "<li>" +
          '<a href="recipe-detail.html?id=' + encodeURIComponent(m.recipe.id) + '">' +
            "<b>" + escapeHtml(m.recipe.name) + "</b>" +
            '<span class="need">Need: ' + escapeHtml(m.missing.map(function (item) { return item.label; }).join(", ")) + "</span>" +
            "<small>" + n.calories + " kcal &middot; " + fmt.formatGrams(n.protein) + " protein</small>" +
          "</a>" +
        "</li>"
      );
    }

    function render() {
      var ids = Object.keys(selected);
      clearBtn.hidden = ids.length === 0;

      var results = ids.length ? match.matchRecipes(ids, NutriApp.recipes, NutriApp.foods) : [];
      results = results.filter(function (m) { return recipeMatchesDiet(m.recipe, diet); });
      var canCook = results.filter(function (m) { return m.missing.length === 0; });
      var almost = results.filter(function (m) { return m.missing.length > 0; });
      var word = dietWord();

      readyGrid.innerHTML = canCook.map(function (m) { return NutriApp.components.renderRecipeCard(m.recipe); }).join("");
      almostList.innerHTML = almost.map(renderAlmostRow).join("");
      readyBlock.hidden = canCook.length === 0;
      almostBlock.hidden = almost.length === 0;

      if (ids.length === 0) {
        summary.textContent = "Pick what you have at home and recipe ideas will show up here.";
      } else if (results.length === 0) {
        summary.textContent = "None of our " + word + "recipes are within two ingredients of what you've picked yet. Add more of what you have.";
      } else if (canCook.length && almost.length) {
        summary.textContent = plural(canCook.length, word + "recipe") + " ready to cook, and " + almost.length +
          " more missing just one or two ingredients.";
      } else if (canCook.length) {
        summary.textContent = plural(canCook.length, word + "recipe") + " ready to cook with what you have.";
      } else {
        summary.textContent = "Nothing ready yet, but " + plural(almost.length, word + "recipe") +
          (almost.length === 1 ? " is" : " are") + " missing just one or two ingredients.";
      }

      renderMealDb(ids);
    }

    // TheMealDB ideas load after a short pause, so tapping several chips in a
    // row makes one round of requests, and only the latest selection's
    // results are ever drawn. The previous ideas stay on screen until the
    // new ones arrive. A TheMealDB failure only affects this block.
    var mealDbTimer = null;
    var mealDbRequest = 0;

    function renderMealDb(ids) {
      clearTimeout(mealDbTimer);
      var request = ++mealDbRequest;
      var searchable = mealDb ? ids.filter(mealDb.isSearchable) : [];
      if (searchable.length === 0) {
        mealDbBlock.hidden = true;
        mealDbGrid.innerHTML = "";
        return;
      }
      mealDbBlock.hidden = false;
      var word = dietWord();
      mealDbStatus.textContent = "Looking for " + word + "recipe ideas on TheMealDB…";

      mealDbTimer = setTimeout(function () {
        var found;
        mealDb.findMealsForKitchen(ids).then(function (result) {
          found = result;
          if (request !== mealDbRequest) return null;
          if (diet === "all") {
            return { meals: result.meals.slice(0, MEALDB_LIMIT), checked: result.meals.length, total: result.meals.length };
          }
          return mealDb.filterByDiet(result.meals, diet, MEALDB_LIMIT, MEALDB_MAX_CHECKS);
        }).then(function (shown) {
          if (!shown || request !== mealDbRequest) return;
          mealDbGrid.innerHTML = shown.meals.map(function (meal) {
            return NutriApp.components.renderMealDbCard(meal, meal.itemIds.map(function (id) { return labelOf[id]; }));
          }).join("");

          var n = shown.meals.length;
          var lookedAtAll = shown.checked >= shown.total;
          var notes = [];
          if (n === 0 && lookedAtAll) {
            notes.push("TheMealDB has no " + word + "recipes with these ingredients.");
          } else if (n === 0) {
            notes.push("No " + word + "recipes among your best " + shown.checked + " TheMealDB matches.");
          } else if (n === MEALDB_LIMIT && n < shown.total) {
            notes.push("Best " + n + " " + word + "matches" + (diet === "all" ? " out of " + shown.total + " recipes" : "") +
              ", with ones built around your less common ingredients first.");
          } else if (lookedAtAll) {
            notes.push(plural(n, word + "recipe") + " found.");
          } else {
            notes.push(plural(n, word + "recipe") + " among your best " + shown.checked + " matches.");
          }
          if (found.notSearchable.length) {
            notes.push("Not on TheMealDB: " + found.notSearchable.map(function (id) { return labelOf[id]; }).join(", ") + ".");
          }
          if (found.partial) notes.push("Some searches didn't load, so this list may be incomplete.");
          mealDbStatus.textContent = notes.join(" ");
        }).then(null, function () {
          if (request !== mealDbRequest) return;
          mealDbGrid.innerHTML = "";
          mealDbStatus.textContent = "Couldn't reach TheMealDB right now. The Nutrishian recipes above don't need it.";
        });
      }, MEALDB_DELAY_MS);
    }

    clearBtn.addEventListener("click", function () {
      selected = {};
      Array.prototype.forEach.call(picker.querySelectorAll(".chip"), function (c) { c.setAttribute("aria-pressed", "false"); });
      store.save([]);
      render();
    });

    render();
  });
})();
