/**
 * js/pages/foodDetail.js
 * Controller for food-detail.html. All nutrition math goes through
 * NutriApp.nutrition.calculateNutrition() — nothing here recomputes it
 * inline, per "create a reusable nutrition module, do not duplicate this
 * calculation in different pages".
 */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var NutriApp = window.NutriApp;
    var fmt = NutriApp.formatters;

    var notFound = document.getElementById("notFound");
    var content = document.getElementById("detailContent");

    var params = new URLSearchParams(location.search);
    var id = params.get("id");
    var food = id ? NutriApp.foods[id] : null;

    // Missing/unknown food id: a friendly state, never a broken page.
    if (!food) {
      notFound.hidden = false;
      content.hidden = true;
      return;
    }
    notFound.hidden = true;
    content.hidden = false;

    document.title = food.name + " \u2013 Nutrishian Diet";
    document.getElementById("dThumbLetter").textContent = food.name.trim().charAt(0).toUpperCase();
    document.getElementById("dName").textContent = food.name;
    document.getElementById("dCategory").textContent = fmt.titleCaseSlug(food.category);

    var dietEl = document.getElementById("dDiet");
    var dietLabel = fmt.dietLabel(food.dietType);
    if (dietLabel) {
      dietEl.textContent = dietLabel;
      dietEl.className = "pill pill-" + food.dietType;
      dietEl.hidden = false;
    } else {
      dietEl.hidden = true;
    }

    var qty = document.getElementById("qty");
    var rng = document.getElementById("qtyRange");
    var unitNote = document.getElementById("unitNote");
    var presetsEl = document.getElementById("presets");

    var isCounted = food.defaultUnit !== "g" && food.defaultUnit !== "ml";
    var stepSize = isCounted ? food.servingWeight : 10;
    var grams = food.servingWeight || 100;

    var presets = isCounted
      ? [1, 2, 3, 4].map(function (n) {
          return { g: n * food.servingWeight, label: n + " " + food.defaultUnit + (n === 1 ? "" : "s") };
        })
      : [50, 100, 150, 200, 250].map(function (g) { return { g: g, label: g + "g" }; });

    presetsEl.innerHTML = "";
    presets.forEach(function (p) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = p.label;
      b.addEventListener("click", function () { setGrams(p.g); });
      presetsEl.appendChild(b);
    });

    function clamp(g) {
      g = Number(g);
      if (isNaN(g) || g < 0) return 0;
      return Math.min(g, 2000);
    }

    function setGrams(g) {
      grams = clamp(g);
      qty.value = Math.round(grams);
      rng.value = Math.max(10, Math.min(500, grams));
      renderNutrition();
    }

    qty.addEventListener("input", function () {
      var v = parseFloat(qty.value);
      if (!isNaN(v)) setGrams(v);
    });
    rng.addEventListener("input", function () { setGrams(parseFloat(rng.value)); });
    document.getElementById("stepDown").addEventListener("click", function () { setGrams(grams - stepSize); });
    document.getElementById("stepUp").addEventListener("click", function () { setGrams(grams + stepSize); });

    function renderNutrition() {
      var n = NutriApp.nutrition.calculateNutrition(food, grams);
      var fn = NutriApp.nutrition.formatNutrition(n);

      document.getElementById("nCal").textContent = fn.calories;
      document.getElementById("nPro").textContent = fmt.formatGrams(fn.protein);
      document.getElementById("nCarb").textContent = fmt.formatGrams(fn.carbohydrates);
      document.getElementById("nFat").textContent = fmt.formatGrams(fn.fat);
      document.getElementById("nFib").textContent = fmt.formatGrams(fn.fiber);

      unitNote.textContent = isCounted
        ? "\u2248 " + (Math.round((grams / food.servingWeight) * 10) / 10) + " " + food.defaultUnit + (grams === food.servingWeight ? "" : "s")
        : "";

      document.getElementById("dCost").textContent = fmt.formatCurrency(food.estimatedCostPer100g * grams / 100);

      // Micronutrients: only shown when the data actually has them.
      var micronutrientsBox = document.getElementById("microBox");
      var micros = [];
      var np = food.nutritionPer100g;
      if (np.iron !== null && np.iron !== undefined) {
        micros.push(["Iron", (np.iron * grams / 100).toFixed(1) + "mg"]);
      }
      if (np.calcium !== null && np.calcium !== undefined) {
        micros.push(["Calcium", Math.round(np.calcium * grams / 100) + "mg"]);
      }
      if (micros.length) {
        micronutrientsBox.hidden = false;
        micronutrientsBox.querySelector(".micro-list").innerHTML = micros.map(function (m) {
          return "<li><span>" + m[0] + "</span><b>" + m[1] + "</b></li>";
        }).join("");
      } else {
        micronutrientsBox.hidden = true;
      }
    }

    setGrams(food.servingWeight || 100);
  });
})();
