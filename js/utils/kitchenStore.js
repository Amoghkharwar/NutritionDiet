/**
 * js/utils/kitchenStore.js
 * Remembers which kitchen items (ids from recipeMatch.js) the person said
 * they have, in localStorage, so the selection carries across pages — the
 * foods page picker writes it, recipe pages read it to tick off what the
 * person already has. Also remembers their veg / non-veg Show filter, so a
 * vegetarian only has to set it once.
 *
 * Storage can be unavailable (private mode, blocked site data): load()
 * then returns [] and save() does nothing, so every page still works, the
 * selection just isn't remembered.
 */
(function (global) {
  "use strict";

  var STORAGE_KEY = "nutriapp.kitchen";
  var DIET_KEY = "nutriapp.kitchenDiet";
  var DIETS = ["all", "veg", "non-veg"];

  function load() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(saved) ? saved.filter(function (id) { return typeof id === "string"; }) : [];
    } catch (e) {
      return [];
    }
  }

  function save(ids) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)); } catch (e) { /* not remembered */ }
  }

  /** The Show filter the person last picked: "all", "veg" or "non-veg". */
  function loadDiet() {
    try {
      var saved = localStorage.getItem(DIET_KEY);
      return DIETS.indexOf(saved) !== -1 ? saved : "all";
    } catch (e) {
      return "all";
    }
  }

  function saveDiet(diet) {
    try { localStorage.setItem(DIET_KEY, diet); } catch (e) { /* not remembered */ }
  }

  global.NutriApp = global.NutriApp || {};
  global.NutriApp.kitchenStore = { load: load, save: save, loadDiet: loadDiet, saveDiet: saveDiet };
})(typeof window !== "undefined" ? window : globalThis);
