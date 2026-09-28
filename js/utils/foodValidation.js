/**
 * js/utils/foodValidation.js
 * Validates the food master dataset so the app fails safely and loudly
 * instead of silently rendering NaN/undefined nutrition to the user.
 *
 * Never throws on bad data by itself (one broken entry must not be able to
 * break the whole page) — it reports every problem it finds and lets the
 * caller decide what to do (log it, block a save, show a dev banner, etc).
 * Call assertValidFoods() once at startup against NutriApp.foods to get a
 * clear console report if the dataset itself is broken.
 */
(function (global) {
  "use strict";

  var REQUIRED_NUTRITION_FIELDS = ["calories", "protein", "carbohydrates", "fat", "fiber"];
  var OPTIONAL_NUTRITION_FIELDS = ["iron", "calcium"];

  function isFiniteNumber(v) {
    return typeof v === "number" && isFinite(v);
  }

  /**
   * validateFood(food, seenIds)
   * Checks one food entry. seenIds is an optional Set used to catch
   * duplicate ids across a whole dataset (see validateFoods) — omit it to
   * validate a single food in isolation (e.g. one being edited).
   * Returns an array of human-readable error strings (empty = valid).
   */
  function validateFood(food, seenIds) {
    var errors = [];

    if (!food || typeof food !== "object") {
      return ["Food entry is not an object: " + JSON.stringify(food)];
    }

    var label = food.id ? "food '" + food.id + "'" : "food (no id)";

    if (!food.id || typeof food.id !== "string") {
      errors.push(label + ": missing or invalid id");
    } else if (seenIds) {
      if (seenIds.has(food.id)) {
        errors.push("Duplicate food id: '" + food.id + "'");
      } else {
        seenIds.add(food.id);
      }
    }

    if (!food.name || typeof food.name !== "string") {
      errors.push(label + ": missing name");
    }
    if (!food.category || typeof food.category !== "string") {
      errors.push(label + ": missing category");
    }

    var n = food.nutritionPer100g;
    if (!n || typeof n !== "object") {
      errors.push(label + ": missing nutritionPer100g");
    } else {
      REQUIRED_NUTRITION_FIELDS.forEach(function (field) {
        var v = n[field];
        if (!isFiniteNumber(v)) {
          errors.push(label + ": nutritionPer100g." + field + " is missing or not a number");
        } else if (v < 0) {
          errors.push(label + ": nutritionPer100g." + field + " is negative (" + v + ")");
        }
      });
      OPTIONAL_NUTRITION_FIELDS.forEach(function (field) {
        var v = n[field];
        if (v !== null && v !== undefined) {
          if (!isFiniteNumber(v)) {
            errors.push(label + ": nutritionPer100g." + field + " must be a number or null, got " + JSON.stringify(v));
          } else if (v < 0) {
            errors.push(label + ": nutritionPer100g." + field + " is negative (" + v + ")");
          }
        }
      });
    }

    if (!isFiniteNumber(food.estimatedCostPer100g)) {
      errors.push(label + ": estimatedCostPer100g is missing or not a number");
    } else if (food.estimatedCostPer100g < 0) {
      errors.push(label + ": estimatedCostPer100g is negative (" + food.estimatedCostPer100g + ")");
    }

    if (!Array.isArray(food.units) || food.units.length === 0) {
      errors.push(label + ": units must be a non-empty array");
    } else if (!food.defaultUnit || food.units.indexOf(food.defaultUnit) === -1) {
      errors.push(label + ": defaultUnit '" + food.defaultUnit + "' is missing or not listed in units");
    }

    if (food.defaultUnit && food.defaultUnit !== "g" && food.defaultUnit !== "ml") {
      if (!isFiniteNumber(food.servingWeight) || food.servingWeight <= 0) {
        errors.push(label + ": servingWeight must be a positive number of grams when defaultUnit is '" + food.defaultUnit + "'");
      }
    }

    return errors;
  }

  /**
   * validateFoods(foods)
   * Validates a whole dataset — accepts either the keyed object
   * (NutriApp.foods) or an array (NutriApp.foodList). Returns
   * { valid, errorCount, errors }.
   */
  function validateFoods(foods) {
    var list = Array.isArray(foods) ? foods : Object.values(foods || {});
    var seenIds = new Set();
    var errors = [];
    list.forEach(function (food) {
      errors = errors.concat(validateFood(food, seenIds));
    });
    return { valid: errors.length === 0, errorCount: errors.length, errors: errors };
  }

  /**
   * assertValidFoods(foods, label)
   * Runs validateFoods and, if anything is wrong, prints a clear
   * console.error report (one line per issue) — loud enough to notice
   * during development, but it still never throws, so a bad dataset
   * degrades (via nutrition.js's own missing-food handling) rather than
   * crashing the page. Returns the same result validateFoods does.
   */
  function assertValidFoods(foods, label) {
    var result = validateFoods(foods);
    if (!result.valid) {
      var name = label || "foods";
      console.error("[foodValidation] " + name + " failed validation (" + result.errorCount +
        (result.errorCount === 1 ? " issue" : " issues") + "):");
      result.errors.forEach(function (e) { console.error("  - " + e); });
    }
    return result;
  }

  global.NutriApp = global.NutriApp || {};
  global.NutriApp.foodValidation = {
    validateFood: validateFood,
    validateFoods: validateFoods,
    assertValidFoods: assertValidFoods
  };
})(typeof window !== "undefined" ? window : globalThis);
