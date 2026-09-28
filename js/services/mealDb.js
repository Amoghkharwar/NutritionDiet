/**
 * js/services/mealDb.js
 * Client for TheMealDB's free V1 API (https://www.themealdb.com/api.php),
 * used for recipe ideas beyond Nutrishian's own recipes. Free endpoints
 * only, with the public test key "1" — TheMealDB allows that for
 * development and education; a public release needs their paid tier.
 *
 * TheMealDB has recipes and photos but no nutrition data, and its
 * ingredients are free text ("1 tbls", "4 large") rather than foods.js
 * foods — so nothing from here ever feeds NutriApp.nutrition. Its meals are
 * shown as clearly labelled ideas, never with calculated numbers.
 *
 * The free API filters by ONE ingredient per call (multi-ingredient
 * filtering is a paid V2 feature), so findMealsForKitchen() makes one
 * filter call per ingredient name and ranks meals by how many of the
 * person's items they use. Responses are cached per URL for the browser
 * session. Everything the API returns is treated as untrusted: callers
 * escape text, and only https links / TheMealDB image URLs are passed on.
 */
(function (global) {
  "use strict";

  var API_BASE = "https://www.themealdb.com/api/json/v1/1/";
  var IMAGE_PREFIX = "https://www.themealdb.com/images/";
  var CACHE_PREFIX = "nutriapp.mealdb:";
  var TIMEOUT_MS = 8000;

  // Kitchen item id (see recipeMatch.js) -> the TheMealDB ingredient names
  // it covers. TheMealDB indexes meals by the exact name each recipe used,
  // so one kitchen item often needs several ("Onion", "Onions", "Red
  // Onions"). Every name here was checked against list.php?i=list and
  // returns meals. Items with no TheMealDB equivalent (poha, moong dal, soy
  // chunks, roasted chana, mixed vegetables) are left out and not searched.
  var INGREDIENT_NAMES = {
    "paneer": ["Paneer"],
    "curd": ["Yogurt", "Natural Yoghurt"],
    "greek-yogurt": ["Greek Yogurt"],
    "egg": ["Eggs", "Egg"],
    "chicken-breast-cooked": ["Chicken Breast", "Chicken Breasts", "Chicken"],
    "rice": ["Rice", "Basmati Rice"],
    "atta": ["Wheat Flour", "Strong Wholemeal Flour"],
    "oats-dry": ["Oats", "Rolled Oats", "Porridge oats"],
    "rava": ["Semolina"],
    "bread-whole-wheat": ["Bread"],
    "chana": ["Chickpeas", "Can of chickpeas"],
    "rajma-cooked": ["Kidney Beans"],
    "besan": ["Chickpea Flour"],
    "sprouts-moong": ["Bean Sprouts"],
    "almonds": ["Almonds", "Flaked Almonds"],
    "peanuts": ["Peanuts"],
    "peanut-butter": ["Peanut Butter"],
    "banana": ["Banana"],
    "onion": ["Onion", "Onions", "Red Onions"],
    "tomato": ["Tomatoes", "Tomato", "Chopped Tomatoes"],
    "capsicum": ["Red Pepper", "Green Pepper"],
    "cucumber": ["Cucumber"],
    "lettuce": ["Lettuce", "Iceberg Lettuce"],
    "green-peas": ["Peas", "Frozen Peas"],
    "french-beans": ["Green Beans"],
    "carrot": ["Carrots"],
    "cabbage": ["Cabbage"]
  };

  // Veg / non-veg uses Nutrishian's meaning, the same as recipes.js uses for
  // its own egg dishes: veg = no meat, fish or eggs. TheMealDB's
  // "Vegetarian" category allows eggs, so it can't be trusted on its own.
  // Meals in the meat/fish categories are non-veg and Vegan ones veg,
  // straight from the (cached) category lists; everything else is decided
  // from its ingredient list. That's a keyword check, so an unlisted meat or
  // fish name would read as veg — the list errs broad instead ("Lamb's
  // lettuce" reads as non-veg), since that's the safer mistake to make.
  // "Beef tomatoes" and "Egg Plants" (aubergine) are the exceptions carved out.
  var NON_VEG_CATEGORIES = ["Beef", "Chicken", "Goat", "Lamb", "Pork", "Seafood"];
  var VEG_CATEGORIES = ["Vegan"];
  var NON_VEG_INGREDIENT = new RegExp("(" + [
    "chicken", "beef(?!\\s*tomato)", "pork", "lamb", "mutton", "\\bgoat\\b", "veal", "venison", "rabbit",
    "duck", "turkey", "goose", "pheasant", "bacon", "\\bham\\b", "gammon", "sausage", "chorizo", "salami",
    "pepperoni", "pancetta", "prosciutto", "meat", "fish", "salmon", "tuna", "\\bcod\\b", "haddock",
    "mackerel", "sardine", "anchov", "trout", "herring", "kipper", "prawn", "shrimp", "crab", "lobster",
    "squid", "octopus", "mussel", "clam", "oyster", "scallop", "\\beggs?\\b(?!\\s*plants?)", "mayonnaise",
    "gelatin", "\\blard\\b", "\\bsuet\\b", "worcestershire"
  ].join("|") + ")", "i");
  var DIET_BATCH = 12;

  var itemByIngredient = {};
  Object.keys(INGREDIENT_NAMES).forEach(function (itemId) {
    INGREDIENT_NAMES[itemId].forEach(function (name) { itemByIngredient[name.toLowerCase()] = itemId; });
  });

  // ---- fetching + caching ----

  var memoryCache = {};
  var inFlight = {};

  function readCache(path) {
    if (memoryCache[path]) return memoryCache[path];
    try {
      var raw = sessionStorage.getItem(CACHE_PREFIX + path);
      if (raw) return (memoryCache[path] = JSON.parse(raw));
    } catch (e) { /* no session cache available */ }
    return null;
  }

  function writeCache(path, data) {
    memoryCache[path] = data;
    try { sessionStorage.setItem(CACHE_PREFIX + path, JSON.stringify(data)); } catch (e) { /* memory cache still works */ }
  }

  function getJson(path) {
    var cached = readCache(path);
    if (cached) return Promise.resolve(cached);
    if (inFlight[path]) return inFlight[path];

    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, TIMEOUT_MS) : null;
    var done = function () { clearTimeout(timer); delete inFlight[path]; };

    inFlight[path] = fetch(API_BASE + path, controller ? { signal: controller.signal } : {})
      .then(function (res) {
        if (!res.ok) throw new Error("TheMealDB responded with HTTP " + res.status);
        return res.json();
      })
      .then(function (data) { done(); writeCache(path, data); return data; },
        function (err) { done(); throw err; });
    return inFlight[path];
  }

  // ---- sanitising what the API returns ----

  function safeImage(url) {
    return typeof url === "string" && url.indexOf(IMAGE_PREFIX) === 0 ? url : "";
  }

  function safeLink(url) {
    return typeof url === "string" && /^https:\/\//i.test(url.trim()) ? url.trim() : "";
  }

  /** TheMealDB serves every meal photo at /small, /medium and /large. */
  function imageSize(url, size) {
    return url ? url + "/" + size : "";
  }

  // Instructions arrive as one string: paragraphs split by line breaks,
  // sometimes with "STEP 1" header lines or "1." prefixes — both dropped,
  // since the page renders its own numbered list.
  function splitSteps(text) {
    return String(text || "").split(/\r?\n/)
      .map(function (s) { return s.trim().replace(/^(?:step\s*\d+[.):]?|\d+[.):])\s*/i, ""); })
      .filter(function (s) { return s && !/^step\s*\d+$/i.test(s); });
  }

  // ---- public API ----

  function isSearchable(itemId) {
    return Object.prototype.hasOwnProperty.call(INGREDIENT_NAMES, itemId);
  }

  /** The kitchen item a TheMealDB ingredient name counts as, or null. */
  function kitchenItemForIngredient(name) {
    return itemByIngredient[String(name).trim().toLowerCase()] || null;
  }

  function filterByIngredient(name) {
    return getJson("filter.php?i=" + encodeURIComponent(name)).then(function (data) {
      return (data && Array.isArray(data.meals) ? data.meals : []).filter(function (m) {
        return m && m.idMeal && m.strMeal;
      });
    });
  }

  /**
   * findMealsForKitchen(itemIds)
   * Resolves { meals, notSearchable, partial }:
   *   meals — [{ id, name, thumb, itemIds }], best match first (see the
   *           scoring below); itemIds = which of their items it uses.
   *   notSearchable — the itemIds TheMealDB has no ingredient for.
   *   partial — true if some (not all) searches failed.
   * Rejects only when every search failed (offline, API down).
   */
  function findMealsForKitchen(itemIds) {
    var notSearchable = itemIds.filter(function (id) { return !isSearchable(id); });
    var calls = [];
    itemIds.filter(isSearchable).forEach(function (itemId) {
      INGREDIENT_NAMES[itemId].forEach(function (name) {
        calls.push(filterByIngredient(name).then(
          function (meals) { return { itemId: itemId, meals: meals }; },
          function () { return null; }
        ));
      });
    });

    return Promise.all(calls).then(function (results) {
      var ok = results.filter(Boolean);
      if (calls.length && !ok.length) throw new Error("Couldn't reach TheMealDB");

      var byId = {};
      var mealsPerItem = {};
      ok.forEach(function (r) {
        r.meals.forEach(function (m) {
          var meal = byId[m.idMeal] ||
            (byId[m.idMeal] = { id: String(m.idMeal), name: String(m.strMeal).trim(), thumb: safeImage(m.strMealThumb), itemIds: [] });
          if (meal.itemIds.indexOf(r.itemId) === -1) {
            meal.itemIds.push(r.itemId);
            mealsPerItem[r.itemId] = (mealsPerItem[r.itemId] || 0) + 1;
          }
        });
      });

      // Rarer ingredients say more about a match: a meal built around paneer
      // (one TheMealDB recipe) suits this kitchen far better than one that
      // merely shares onion (hundreds). Each item a meal uses adds
      // log(total meals / meals using that item) — inverse document
      // frequency — so common items count for little and rare ones a lot.
      // That sum is then multiplied by how many of the person's items the
      // meal uses, so one rare match alone (a cake that happens to use
      // wheat flour) doesn't outrank a meal using three of their items.
      var meals = Object.keys(byId).map(function (id) { return byId[id]; });
      var score = {};
      meals.forEach(function (meal) {
        var rarity = meal.itemIds.reduce(function (sum, itemId) {
          return sum + Math.log(meals.length / mealsPerItem[itemId]);
        }, 0);
        score[meal.id] = rarity * meal.itemIds.length;
      });
      meals.sort(function (a, b) {
        return (score[b.id] - score[a.id]) || (b.itemIds.length - a.itemIds.length) || a.name.localeCompare(b.name);
      });
      return { meals: meals, notSearchable: notSearchable, partial: ok.length < calls.length };
    });
  }

  /**
   * lookupMeal(id) -> Promise of a normalised meal, or null if TheMealDB has
   * no meal with that id: { id, name, category, area, thumb, tags,
   * ingredients: [{ name, measure, itemId }], steps, youtube, source }.
   */
  function lookupMeal(id) {
    return getJson("lookup.php?i=" + encodeURIComponent(id)).then(function (data) {
      var m = data && Array.isArray(data.meals) ? data.meals[0] : null;
      if (!m) return null;

      var ingredients = [];
      for (var i = 1; i <= 20; i++) {
        var name = String(m["strIngredient" + i] || "").trim();
        if (!name) continue;
        ingredients.push({
          name: name,
          measure: String(m["strMeasure" + i] || "").trim(),
          itemId: kitchenItemForIngredient(name)
        });
      }

      return {
        id: String(m.idMeal),
        name: String(m.strMeal || "").trim(),
        category: String(m.strCategory || ""),
        area: String(m.strArea || ""),
        thumb: safeImage(m.strMealThumb),
        tags: String(m.strTags || "").split(",").map(function (t) { return t.trim(); }).filter(Boolean),
        ingredients: ingredients,
        steps: splitSteps(m.strInstructions),
        youtube: safeLink(m.strYoutube),
        source: safeLink(m.strSource)
      };
    });
  }

  // ---- veg / non-veg ----

  /** dietOfMeal(meal) -> "veg" or "non-veg" for a meal from lookupMeal(). */
  function dietOfMeal(meal) {
    if (NON_VEG_CATEGORIES.indexOf(meal.category) !== -1) return "non-veg";
    return meal.ingredients.some(function (ing) { return NON_VEG_INGREDIENT.test(ing.name); }) ? "non-veg" : "veg";
  }

  // meal id -> diet for every meal in the meat/fish and Vegan categories,
  // built once per page from seven cached category lists. If any list
  // failed to load, the next call tries again (the ones that loaded come
  // from the cache).
  var categoryDietsPromise = null;

  function categoryDiets() {
    if (categoryDietsPromise) return categoryDietsPromise;
    var lists = NON_VEG_CATEGORIES.map(function (c) { return { category: c, diet: "non-veg" }; })
      .concat(VEG_CATEGORIES.map(function (c) { return { category: c, diet: "veg" }; }));
    var failed = false;
    categoryDietsPromise = Promise.all(lists.map(function (list) {
      return getJson("filter.php?c=" + encodeURIComponent(list.category)).then(function (data) {
        return { diet: list.diet, meals: data && Array.isArray(data.meals) ? data.meals : [] };
      }, function () { failed = true; return null; });
    })).then(function (results) {
      var byId = {};
      results.forEach(function (r) {
        if (r) r.meals.forEach(function (m) { if (m && m.idMeal) byId[m.idMeal] = r.diet; });
      });
      if (failed) categoryDietsPromise = null;
      return byId;
    });
    return categoryDietsPromise;
  }

  /**
   * dietOf(id) -> Promise of "veg" / "non-veg", or null if TheMealDB has no
   * meal with that id. Category lists answer most meals; the rest need a
   * lookup. Rejects if the meal couldn't be looked up.
   */
  function dietOf(id) {
    return categoryDiets().then(function (known) {
      if (known[id]) return known[id];
      return lookupMeal(id).then(function (meal) { return meal ? dietOfMeal(meal) : null; });
    });
  }

  /**
   * filterByDiet(meals, diet, limit, maxChecks)
   * Walks ranked meals (from findMealsForKitchen) in order and keeps those
   * whose dietOf() is diet ("veg" / "non-veg"), until limit are found or
   * maxChecks meals have been checked. Works in batches, so a typical call
   * needs only a few lookups, and every answer is cached for the session.
   * Resolves { meals, checked, total } — checked is how far down the
   * ranking it looked, so callers can say "among your best N matches".
   * Rejects only if every check failed (offline, API down).
   */
  function filterByDiet(meals, diet, limit, maxChecks) {
    var found = [];
    var checked = 0;
    var failed = 0;
    var stop = Math.min(maxChecks, meals.length);

    function next() {
      if (found.length >= limit || checked >= stop) {
        if (checked > 0 && failed === checked) throw new Error("Couldn't check recipes on TheMealDB");
        return { meals: found.slice(0, limit), checked: checked, total: meals.length };
      }
      var batch = meals.slice(checked, Math.min(checked + DIET_BATCH, stop));
      checked += batch.length;
      return Promise.all(batch.map(function (meal) {
        return dietOf(meal.id).then(null, function () { failed++; return null; });
      })).then(function (diets) {
        batch.forEach(function (meal, i) { if (diets[i] === diet) found.push(meal); });
        return next();
      });
    }

    return Promise.resolve().then(next);
  }

  global.NutriApp = global.NutriApp || {};
  global.NutriApp.mealDb = {
    isSearchable: isSearchable,
    kitchenItemForIngredient: kitchenItemForIngredient,
    findMealsForKitchen: findMealsForKitchen,
    lookupMeal: lookupMeal,
    imageSize: imageSize,
    dietOfMeal: dietOfMeal,
    dietOf: dietOf,
    filterByDiet: filterByDiet
  };
})(typeof window !== "undefined" ? window : globalThis);
