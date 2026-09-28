/**
 * js/utils/nutrition.js
 * Reusable nutrition + cost math (Part 1) — every page and component should
 * call these instead of recalculating inline, per "do not duplicate this
 * calculation in different pages / create a reusable nutrition module".
 *
 * Numbers stay full precision internally; round only at the point you
 * display them (round1 / roundInt below) so rounding never compounds across
 * a sum of several ingredients or several meals.
 */
(function (global) {
  "use strict";

  /**
   * calculateNutrition(food, grams)
   * Scales one food's per-100g nutrition to an arbitrary gram amount.
   * Matches the reference implementation in the spec exactly.
   */
  function calculateNutrition(food, grams) {
    var g = clampGrams(grams);
    var p = food && food.nutritionPer100g;
    if (!p) {
      console.warn("[nutrition] food has no nutritionPer100g:", food);
      return { calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0 };
    }
    var multiplier = g / 100;
    return {
      calories: p.calories * multiplier,
      protein: p.protein * multiplier,
      carbohydrates: p.carbohydrates * multiplier,
      fat: p.fat * multiplier,
      fiber: p.fiber * multiplier
    };
  }

  /**
   * gramsForIngredient(ingredient, food, overrides)
   * Resolves a recipe ingredient line to an actual gram amount.
   * - unit "g" or "ml": quantity IS grams (ml treated as grams for the
   *   liquids currently in the dataset, e.g. oil).
   * - any other unit ("piece", "slice", "bowl", ...): quantity is a count,
   *   converted via food.servingWeight (grams per one of that food's
   *   defaultUnit — see foods.js).
   * overrides is an optional { [foodId]: newQuantity } map — used when the
   * person has adjusted a specific adjustable ingredient (e.g. picked 4
   * idlis instead of the recipe's default 3, or 150g dal instead of 100g).
   * The override replaces the ingredient's own quantity, but unit/piece
   * conversion still applies exactly as for the default quantity.
   */
  function gramsForIngredient(ingredient, food, overrides) {
    overrides = overrides || {};
    var qty = Object.prototype.hasOwnProperty.call(overrides, ingredient.foodId)
      ? overrides[ingredient.foodId]
      : ingredient.quantity;
    qty = clampGrams(qty);
    var unit = ingredient.unit;
    if (unit && unit !== "g" && unit !== "ml") {
      // Any countable unit (piece, slice, bowl, ...) converts via the food's
      // servingWeight — the grams represented by one of that food's
      // defaultUnit (see foods.js). The unit's exact name doesn't matter
      // here, only that it isn't a weight/volume unit already in grams.
      var servingWeight = (food && food.servingWeight) || 0;
      return qty * servingWeight;
    }
    return qty;
  }

  /**
   * calculateRecipeNutrition(recipe, foodsById, options)
   * options: { servings, overrides }
   *   servings  — desired serving count; defaults to recipe.servings (usually 1).
   *               Everything scales linearly, matching RECIPE SERVING SCALING
   *               in the spec (1 serving 420 kcal -> 2 servings 840 kcal).
   *   overrides — { [foodId]: quantity } for any adjustable ingredients the
   *               person has changed from their default (idli count, dal
   *               grams, roti count, etc.) — see gramsForIngredient above.
   * Missing ingredient data is skipped with a console.warn rather than
   * thrown, per ERROR HANDLING: "never allow a JS error to break the page".
   */
  function calculateRecipeNutrition(recipe, foodsById, options) {
    options = options || {};
    var totals = { calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0 };
    if (!recipe || !Array.isArray(recipe.ingredients)) return totals;

    recipe.ingredients.forEach(function (ingredient) {
      var food = foodsById[ingredient.foodId];
      if (!food) {
        console.warn("[nutrition] recipe " + recipe.id + " references unknown foodId: " + ingredient.foodId);
        return;
      }
      var grams = gramsForIngredient(ingredient, food, options.overrides);
      var n = calculateNutrition(food, grams);
      totals.calories += n.calories;
      totals.protein += n.protein;
      totals.carbohydrates += n.carbohydrates;
      totals.fat += n.fat;
      totals.fiber += n.fiber;
    });

    var baseServings = recipe.servings || 1;
    var targetServings = options.servings || baseServings;
    var scale = targetServings / baseServings;
    return {
      calories: totals.calories * scale,
      protein: totals.protein * scale,
      carbohydrates: totals.carbohydrates * scale,
      fat: totals.fat * scale,
      fiber: totals.fiber * scale
    };
  }

  /**
   * calculateRecipeCost(recipe, foodsById, options)
   * Same shape as calculateRecipeNutrition, but sums estimatedCostPer100g.
   * options: { servings, overrides } — same meaning as above.
   */
  function calculateRecipeCost(recipe, foodsById, options) {
    options = options || {};
    if (!recipe || !Array.isArray(recipe.ingredients)) return 0;

    var total = 0;
    recipe.ingredients.forEach(function (ingredient) {
      var food = foodsById[ingredient.foodId];
      if (!food) return;
      var grams = gramsForIngredient(ingredient, food, options.overrides);
      total += (food.estimatedCostPer100g || 0) * grams / 100;
    });

    var baseServings = recipe.servings || 1;
    var targetServings = options.servings || baseServings;
    return total * (targetServings / baseServings);
  }

  // ---- small formatting/guard helpers, reused across pages ----

  function clampGrams(g) {
    g = Number(g);
    if (isNaN(g) || g < 0) return 0;
    return Math.min(g, 5000);
  }

  function round1(n) {
    return Math.round(n * 10) / 10;
  }

  function roundInt(n) {
    return Math.round(n);
  }

  /** Rounds every field of a {calories,protein,carbohydrates,fat,fiber} object for display. */
  function formatNutrition(n) {
    return {
      calories: roundInt(n.calories),
      protein: round1(n.protein),
      carbohydrates: round1(n.carbohydrates),
      fat: round1(n.fat),
      fiber: round1(n.fiber)
    };
  }

  global.NutriApp = global.NutriApp || {};
  global.NutriApp.nutrition = {
    calculateNutrition: calculateNutrition,
    calculateRecipeNutrition: calculateRecipeNutrition,
    calculateRecipeCost: calculateRecipeCost,
    gramsForIngredient: gramsForIngredient,
    round1: round1,
    roundInt: roundInt,
    formatNutrition: formatNutrition
  };
})(typeof window !== "undefined" ? window : globalThis);
