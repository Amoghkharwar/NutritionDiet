/**
 * js/utils/recipeMatch.js
 * "What can I cook with what I have?" — matches the ingredients someone has
 * at home against every recipe's ingredient list. Plain set matching on
 * foodIds, so the same selection always gives the same suggestions.
 *
 * Two rules make it match how people think about their kitchen rather than
 * how foods.js models nutrition:
 *  - Kitchen items: foods.js splits some ingredients by state (rice raw vs
 *    cooked, moong dal dry / soaked / cooked, atta vs roti) because their
 *    per-100g nutrition differs, but at home each is one thing you either
 *    have or don't. KITCHEN_ITEMS folds those together.
 *  - Assumed staples: cooking essentials (oil, spice mix, mustard seeds...)
 *    and small garnishes (lemon, coriander, green chilli) are treated as
 *    always at hand — never offered in the picker, never "missing".
 */
(function (global) {
  "use strict";

  var GARNISH_IDS = ["lemon", "coriander-leaves", "green-chilli"];

  var KITCHEN_ITEMS = {
    "rice-raw": { id: "rice", label: "Rice" },
    "rice-cooked": { id: "rice", label: "Rice" },
    "moong-dal-raw": { id: "moong-dal", label: "Moong dal" },
    "moong-dal-soaked": { id: "moong-dal", label: "Moong dal" },
    "moong-dal-cooked": { id: "moong-dal", label: "Moong dal" },
    "wheat-flour": { id: "atta", label: "Atta / roti" },
    "roti": { id: "atta", label: "Atta / roti" },
    "chana-cooked": { id: "chana", label: "Chole / chickpeas" }
  };

  function isAssumedStaple(food) {
    return food.category === "cooking-essentials" || GARNISH_IDS.indexOf(food.id) !== -1;
  }

  /**
   * kitchenItemFor(food) -> { id, label, category }
   * Foods not in KITCHEN_ITEMS are their own item, labelled with the food's
   * name minus its trailing "(...)" detail — "Paneer", "Egg", "Curd".
   */
  function kitchenItemFor(food) {
    var mapped = KITCHEN_ITEMS[food.id];
    return {
      id: mapped ? mapped.id : food.id,
      label: mapped ? mapped.label : food.name.replace(/\s*\([^)]*\)\s*$/, ""),
      category: food.category
    };
  }

  /**
   * recipeKitchenItems(recipe, foodsById)
   * The unique kitchen items a recipe needs, staples excluded — or null if
   * the recipe references a food that no longer exists (see idli-sambar in
   * recipes.js), so callers skip it rather than suggest a broken recipe.
   */
  function recipeKitchenItems(recipe, foodsById) {
    var items = {};
    for (var i = 0; i < recipe.ingredients.length; i++) {
      var food = foodsById[recipe.ingredients[i].foodId];
      if (!food) return null;
      if (isAssumedStaple(food)) continue;
      var item = kitchenItemFor(food);
      items[item.id] = item;
    }
    return Object.keys(items).map(function (id) { return items[id]; });
  }

  /** Every kitchen item at least one recipe needs — what a picker should offer. Sorted by label. */
  function pickableItems(recipes, foodsById) {
    var byId = {};
    recipes.forEach(function (r) {
      (recipeKitchenItems(r, foodsById) || []).forEach(function (item) { byId[item.id] = item; });
    });
    return Object.keys(byId).map(function (id) { return byId[id]; })
      .sort(function (a, b) { return a.label.localeCompare(b.label); });
  }

  /**
   * matchRecipes(haveIds, recipes, foodsById, options)
   * haveIds — kitchen item ids the person has.
   * options.maxMissing — how many missing items still counts as a
   *   suggestion (default 2).
   * Returns [{ recipe, have: [item], missing: [item] }] for every recipe that
   * uses at least one of the person's items and misses at most maxMissing,
   * sorted fewest missing first, then most of their items used, then name.
   */
  function matchRecipes(haveIds, recipes, foodsById, options) {
    var maxMissing = options && typeof options.maxMissing === "number" ? options.maxMissing : 2;
    var have = {};
    haveIds.forEach(function (id) { have[id] = true; });

    var results = [];
    recipes.forEach(function (recipe) {
      var items = recipeKitchenItems(recipe, foodsById);
      if (!items) return;
      var got = items.filter(function (item) { return have[item.id]; });
      var missing = items.filter(function (item) { return !have[item.id]; });
      if (got.length > 0 && missing.length <= maxMissing) {
        results.push({ recipe: recipe, have: got, missing: missing });
      }
    });

    return results.sort(function (a, b) {
      return (a.missing.length - b.missing.length) ||
        (b.have.length - a.have.length) ||
        a.recipe.name.localeCompare(b.recipe.name);
    });
  }

  global.NutriApp = global.NutriApp || {};
  global.NutriApp.recipeMatch = {
    isAssumedStaple: isAssumedStaple,
    kitchenItemFor: kitchenItemFor,
    recipeKitchenItems: recipeKitchenItems,
    pickableItems: pickableItems,
    matchRecipes: matchRecipes
  };
})(typeof window !== "undefined" ? window : globalThis);
