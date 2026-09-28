/**
 * js/app.js
 * Runs on every page, after all data/utils/components scripts. Two jobs:
 *  1. Validate the food dataset once at startup — a broken dataset should
 *     be loud in the console, never silently produce wrong numbers on screen.
 *  2. Highlight the current page in the nav.
 */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var NutriApp = window.NutriApp;
    if (NutriApp && NutriApp.foodValidation && NutriApp.foods) {
      NutriApp.foodValidation.assertValidFoods(NutriApp.foods, "NutriApp.foods");
    }

    var here = (location.pathname.split("/").pop() || "index.html");
    document.querySelectorAll("[data-nav-link]").forEach(function (a) {
      if (a.getAttribute("data-nav-link") === here) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  });
})();
