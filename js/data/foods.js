/**
 * js/data/foods.js
 * Normalized food/ingredient master dataset (Part 1 — Food Master Dataset).
 *
 * Food -> ingredient quantity -> recipe -> nutrition calculation -> serving
 * adjustment -> meal planner -> daily nutrition. Recipes (built separately)
 * must only ever reference a food by id and a quantity; nothing here is a
 * recipe-level or pre-calculated total.
 *
 * nutritionPer100g is the single source of truth, always per 100g; every
 * serving size is derived from it at calculation time, never stored
 * pre-computed. iron and calcium are included directly in nutritionPer100g
 * (not a separate micronutrients object) and are `null` — not omitted —
 * when no reliable figure is available, so the shape of every food's
 * nutritionPer100g is identical and callers never need an `in` check.
 * calories/protein/carbohydrates/fat/fiber are always real numbers.
 *
 * units is the list of ways this food's quantity can be entered; defaultUnit
 * is which of those the UI should default to. servingWeight is the number
 * of grams ONE defaultUnit represents — for a "piece"/"slice"/"bowl"
 * defaultUnit that's a real conversion factor (e.g. egg: defaultUnit
 * "piece", servingWeight 50 -> 1 egg = 50g edible portion); for a "g"/"ml"
 * defaultUnit it's just a sensible starting quantity for the UI to show
 * before the person adjusts it.
 *
 * idli, dosa, sambar and coconut chutney are deliberately NOT foods here —
 * modelling them as one made-up "per 100g of idli" figure would be exactly
 * the fake single-ingredient shortcut the brief asked to avoid. Their real
 * ingredients (rice-raw, urad-dal, toor-dal, tamarind, coconut-fresh,
 * mustard-seeds, curry-leaves, fenugreek-seeds, mixed-vegetables) are
 * modelled here instead, ready for idli/dosa/sambar to be built as RECIPES
 * once recipes are back in scope.
 *
 * rava and moong-dal-soaked were added for the "poha variants + chilla"
 * recipe batch — moong-dal-soaked approximates soaked (not dry, not
 * cooked) dal: roughly half the dry food's per-100g density, since
 * soaking roughly doubles the weight through water absorption, before the
 * dal is ground into chilla batter.
 *
 * Nutrition values are estimates and may vary based on ingredients, preparation method, brand, and portion size.
 * Costs are estimates for planning only, not live market prices.
 */
(function (global) {
  "use strict";

  var NUTRITION_DISCLAIMER = "Nutrition values are estimates and may vary based on ingredients, preparation method, brand, and portion size.";

  var foods = {
  "poha": {
    "id": "poha",
    "name": "Poha (flattened rice, dry)",
    "category": "grains",
    "nutritionPer100g": {
      "calories": 350,
      "protein": 6.7,
      "carbohydrates": 76.7,
      "fat": 1.7,
      "fiber": 3.3,
      "iron": null,
      "calcium": null
    },
    "estimatedCostPer100g": 8,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 60,
    "dietType": "vegan"
  },
  "rice-raw": {
    "id": "rice-raw",
    "name": "Rice (raw, dry)",
    "category": "grains",
    "nutritionPer100g": {
      "calories": 365,
      "protein": 7.1,
      "carbohydrates": 80.0,
      "fat": 0.7,
      "fiber": 1.3,
      "iron": 0.8,
      "calcium": null
    },
    "estimatedCostPer100g": 6,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 100,
    "dietType": "vegan"
  },
  "rice-cooked": {
    "id": "rice-cooked",
    "name": "Rice (cooked)",
    "category": "grains",
    "nutritionPer100g": {
      "calories": 130,
      "protein": 2.7,
      "carbohydrates": 28.2,
      "fat": 0.3,
      "fiber": 0.4,
      "iron": null,
      "calcium": null
    },
    "estimatedCostPer100g": 3,
    "units": [
      "g",
      "bowl"
    ],
    "defaultUnit": "g",
    "servingWeight": 150,
    "dietType": "vegan"
  },
  "oats-dry": {
    "id": "oats-dry",
    "name": "Oats (rolled, dry)",
    "category": "grains",
    "nutritionPer100g": {
      "calories": 389,
      "protein": 16.9,
      "carbohydrates": 66.3,
      "fat": 6.9,
      "fiber": 10.6,
      "iron": 4.7,
      "calcium": null
    },
    "estimatedCostPer100g": 7,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 40,
    "dietType": "vegan"
  },
  "wheat-flour": {
    "id": "wheat-flour",
    "name": "Whole wheat flour (atta, dry)",
    "category": "grains",
    "nutritionPer100g": {
      "calories": 340,
      "protein": 12.0,
      "carbohydrates": 72.0,
      "fat": 1.5,
      "fiber": 11.0,
      "iron": 3.9,
      "calcium": null
    },
    "estimatedCostPer100g": 5,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 100,
    "dietType": "vegan"
  },
  "roti": {
    "id": "roti",
    "name": "Roti (whole wheat, cooked)",
    "category": "grains",
    "nutritionPer100g": {
      "calories": 300,
      "protein": 9.5,
      "carbohydrates": 50.0,
      "fat": 7.5,
      "fiber": 5.5,
      "iron": null,
      "calcium": null
    },
    "estimatedCostPer100g": 4,
    "units": [
      "piece",
      "g"
    ],
    "defaultUnit": "piece",
    "servingWeight": 40,
    "dietType": "vegetarian"
  },
  "bread-whole-wheat": {
    "id": "bread-whole-wheat",
    "name": "Whole wheat bread",
    "category": "grains",
    "nutritionPer100g": {
      "calories": 247,
      "protein": 10.0,
      "carbohydrates": 41.0,
      "fat": 4.2,
      "fiber": 6.0,
      "iron": null,
      "calcium": null
    },
    "estimatedCostPer100g": 6,
    "units": [
      "slice",
      "g"
    ],
    "defaultUnit": "slice",
    "servingWeight": 25,
    "dietType": "vegetarian"
  },
  "besan": {
    "id": "besan",
    "name": "Besan (gram flour, dry)",
    "category": "pulses",
    "nutritionPer100g": {
      "calories": 387,
      "protein": 22.0,
      "carbohydrates": 58.0,
      "fat": 6.7,
      "fiber": 10.8,
      "iron": 4.9,
      "calcium": null
    },
    "estimatedCostPer100g": 8,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 60,
    "dietType": "vegan"
  },
  "moong-dal-cooked": {
    "id": "moong-dal-cooked",
    "name": "Moong dal (cooked)",
    "category": "pulses",
    "nutritionPer100g": {
      "calories": 105,
      "protein": 7.0,
      "carbohydrates": 19.2,
      "fat": 0.4,
      "fiber": 7.6,
      "iron": 1.4,
      "calcium": null
    },
    "estimatedCostPer100g": 5,
    "units": [
      "g",
      "bowl"
    ],
    "defaultUnit": "g",
    "servingWeight": 150,
    "dietType": "vegan"
  },
  "moong-dal-raw": {
    "id": "moong-dal-raw",
    "name": "Moong dal (dry, split)",
    "category": "pulses",
    "nutritionPer100g": {
      "calories": 347,
      "protein": 24.0,
      "carbohydrates": 59.0,
      "fat": 1.2,
      "fiber": 16.3,
      "iron": 6.7,
      "calcium": null
    },
    "estimatedCostPer100g": 12,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 60,
    "dietType": "vegan"
  },
  "rajma-cooked": {
    "id": "rajma-cooked",
    "name": "Rajma / kidney beans (cooked)",
    "category": "pulses",
    "nutritionPer100g": {
      "calories": 127,
      "protein": 8.7,
      "carbohydrates": 22.8,
      "fat": 0.5,
      "fiber": 6.4,
      "iron": 2.2,
      "calcium": null
    },
    "estimatedCostPer100g": 7,
    "units": [
      "g",
      "bowl"
    ],
    "defaultUnit": "g",
    "servingWeight": 180,
    "dietType": "vegan"
  },
  "chana-cooked": {
    "id": "chana-cooked",
    "name": "Chana / chickpeas, cooked (used for chole)",
    "category": "pulses",
    "nutritionPer100g": {
      "calories": 164,
      "protein": 8.9,
      "carbohydrates": 27.4,
      "fat": 2.6,
      "fiber": 7.6,
      "iron": 2.9,
      "calcium": null
    },
    "estimatedCostPer100g": 6,
    "units": [
      "g",
      "bowl"
    ],
    "defaultUnit": "g",
    "servingWeight": 180,
    "dietType": "vegan"
  },
  "soy-chunks": {
    "id": "soy-chunks",
    "name": "Soy chunks (dry)",
    "category": "pulses",
    "nutritionPer100g": {
      "calories": 345,
      "protein": 52.0,
      "carbohydrates": 33.0,
      "fat": 0.5,
      "fiber": 13.0,
      "iron": 15.7,
      "calcium": null
    },
    "estimatedCostPer100g": 16,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 30,
    "dietType": "vegan"
  },
  "sprouts-moong": {
    "id": "sprouts-moong",
    "name": "Moong sprouts (raw)",
    "category": "pulses",
    "nutritionPer100g": {
      "calories": 30,
      "protein": 3.0,
      "carbohydrates": 5.9,
      "fat": 0.2,
      "fiber": 1.8,
      "iron": 0.9,
      "calcium": null
    },
    "estimatedCostPer100g": 10,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 100,
    "dietType": "vegan"
  },
  "urad-dal": {
    "id": "urad-dal",
    "name": "Urad dal (dry, for idli/dosa batter)",
    "category": "pulses",
    "nutritionPer100g": {
      "calories": 341,
      "protein": 25.0,
      "carbohydrates": 59.0,
      "fat": 1.6,
      "fiber": 18.0,
      "iron": 3.8,
      "calcium": null
    },
    "estimatedCostPer100g": 14,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 50,
    "dietType": "vegan"
  },
  "toor-dal": {
    "id": "toor-dal",
    "name": "Toor dal / arhar dal (dry, for sambar)",
    "category": "pulses",
    "nutritionPer100g": {
      "calories": 343,
      "protein": 22.0,
      "carbohydrates": 57.0,
      "fat": 1.5,
      "fiber": 15.0,
      "iron": 2.7,
      "calcium": null
    },
    "estimatedCostPer100g": 13,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 50,
    "dietType": "vegan"
  },
  "paneer": {
    "id": "paneer",
    "name": "Paneer",
    "category": "dairy",
    "nutritionPer100g": {
      "calories": 265,
      "protein": 18.3,
      "carbohydrates": 1.2,
      "fat": 20.8,
      "fiber": 0.0,
      "iron": 2.16,
      "calcium": 208
    },
    "estimatedCostPer100g": 40,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 100,
    "dietType": "vegetarian"
  },
  "curd": {
    "id": "curd",
    "name": "Curd (dahi)",
    "category": "dairy",
    "nutritionPer100g": {
      "calories": 61,
      "protein": 3.5,
      "carbohydrates": 4.7,
      "fat": 3.3,
      "fiber": 0.0,
      "iron": null,
      "calcium": 120
    },
    "estimatedCostPer100g": 8,
    "units": [
      "g",
      "bowl"
    ],
    "defaultUnit": "g",
    "servingWeight": 150,
    "dietType": "vegetarian"
  },
  "greek-yogurt": {
    "id": "greek-yogurt",
    "name": "Greek yogurt (low-fat)",
    "category": "dairy",
    "nutritionPer100g": {
      "calories": 73,
      "protein": 10.0,
      "carbohydrates": 3.9,
      "fat": 1.9,
      "fiber": 0.0,
      "iron": null,
      "calcium": 110
    },
    "estimatedCostPer100g": 25,
    "units": [
      "g",
      "bowl"
    ],
    "defaultUnit": "g",
    "servingWeight": 150,
    "dietType": "vegetarian"
  },
  "egg": {
    "id": "egg",
    "name": "Egg (boiled)",
    "category": "egg-and-meat",
    "nutritionPer100g": {
      "calories": 155,
      "protein": 12.6,
      "carbohydrates": 1.1,
      "fat": 10.6,
      "fiber": 0.0,
      "iron": 1.2,
      "calcium": null
    },
    "estimatedCostPer100g": 13,
    "units": [
      "piece",
      "g"
    ],
    "defaultUnit": "piece",
    "servingWeight": 50,
    "dietType": "non-vegetarian"
  },
  "chicken-breast-cooked": {
    "id": "chicken-breast-cooked",
    "name": "Chicken breast (cooked, skinless)",
    "category": "egg-and-meat",
    "nutritionPer100g": {
      "calories": 165,
      "protein": 31.0,
      "carbohydrates": 0.0,
      "fat": 3.6,
      "fiber": 0.0,
      "iron": 1.0,
      "calcium": null
    },
    "estimatedCostPer100g": 40,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 150,
    "dietType": "non-vegetarian"
  },
  "peanuts": {
    "id": "peanuts",
    "name": "Peanuts (roasted)",
    "category": "nuts-and-seeds",
    "nutritionPer100g": {
      "calories": 585,
      "protein": 24.0,
      "carbohydrates": 21.0,
      "fat": 50.0,
      "fiber": 8.0,
      "iron": 2.3,
      "calcium": null
    },
    "estimatedCostPer100g": 12,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 20,
    "dietType": "vegan"
  },
  "peanut-butter": {
    "id": "peanut-butter",
    "name": "Peanut butter",
    "category": "nuts-and-seeds",
    "nutritionPer100g": {
      "calories": 588,
      "protein": 25.0,
      "carbohydrates": 20.0,
      "fat": 50.0,
      "fiber": 6.0,
      "iron": 1.9,
      "calcium": null
    },
    "estimatedCostPer100g": 45,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 20,
    "dietType": "vegan"
  },
  "almonds": {
    "id": "almonds",
    "name": "Almonds",
    "category": "nuts-and-seeds",
    "nutritionPer100g": {
      "calories": 579,
      "protein": 21.2,
      "carbohydrates": 21.6,
      "fat": 49.9,
      "fiber": 12.5,
      "iron": 3.7,
      "calcium": 269
    },
    "estimatedCostPer100g": 90,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 10,
    "dietType": "vegan"
  },
  "coconut-fresh": {
    "id": "coconut-fresh",
    "name": "Coconut (fresh, grated)",
    "category": "nuts-and-seeds",
    "nutritionPer100g": {
      "calories": 354,
      "protein": 3.3,
      "carbohydrates": 15.2,
      "fat": 33.5,
      "fiber": 9.0,
      "iron": 2.4,
      "calcium": 14
    },
    "estimatedCostPer100g": 15,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 30,
    "dietType": "vegan"
  },
  "banana": {
    "id": "banana",
    "name": "Banana",
    "category": "fruits",
    "nutritionPer100g": {
      "calories": 89,
      "protein": 1.1,
      "carbohydrates": 22.8,
      "fat": 0.3,
      "fiber": 2.6,
      "iron": null,
      "calcium": null
    },
    "estimatedCostPer100g": 4,
    "units": [
      "piece",
      "g"
    ],
    "defaultUnit": "piece",
    "servingWeight": 120,
    "dietType": "vegan"
  },
  "apple": {
    "id": "apple",
    "name": "Apple",
    "category": "fruits",
    "nutritionPer100g": {
      "calories": 52,
      "protein": 0.3,
      "carbohydrates": 13.8,
      "fat": 0.2,
      "fiber": 2.4,
      "iron": null,
      "calcium": null
    },
    "estimatedCostPer100g": 15,
    "units": [
      "piece",
      "g"
    ],
    "defaultUnit": "piece",
    "servingWeight": 150,
    "dietType": "vegan"
  },
  "lemon": {
    "id": "lemon",
    "name": "Lemon (juice)",
    "category": "fruits",
    "nutritionPer100g": {
      "calories": 22,
      "protein": 0.4,
      "carbohydrates": 6.9,
      "fat": 0.2,
      "fiber": 0.3,
      "iron": null,
      "calcium": null
    },
    "estimatedCostPer100g": 6,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 5,
    "dietType": "vegan"
  },
  "tomato": {
    "id": "tomato",
    "name": "Tomato",
    "category": "vegetables",
    "nutritionPer100g": {
      "calories": 18,
      "protein": 0.9,
      "carbohydrates": 3.9,
      "fat": 0.2,
      "fiber": 1.2,
      "iron": null,
      "calcium": null
    },
    "estimatedCostPer100g": 3,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 60,
    "dietType": "vegan"
  },
  "onion": {
    "id": "onion",
    "name": "Onion",
    "category": "vegetables",
    "nutritionPer100g": {
      "calories": 40,
      "protein": 1.1,
      "carbohydrates": 9.3,
      "fat": 0.1,
      "fiber": 1.7,
      "iron": null,
      "calcium": null
    },
    "estimatedCostPer100g": 3,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 50,
    "dietType": "vegan"
  },
  "cucumber": {
    "id": "cucumber",
    "name": "Cucumber",
    "category": "vegetables",
    "nutritionPer100g": {
      "calories": 15,
      "protein": 0.7,
      "carbohydrates": 3.6,
      "fat": 0.1,
      "fiber": 0.5,
      "iron": null,
      "calcium": null
    },
    "estimatedCostPer100g": 3,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 100,
    "dietType": "vegan"
  },
  "green-peas": {
    "id": "green-peas",
    "name": "Green peas",
    "category": "vegetables",
    "nutritionPer100g": {
      "calories": 81,
      "protein": 5.4,
      "carbohydrates": 14.5,
      "fat": 0.4,
      "fiber": 5.1,
      "iron": null,
      "calcium": null
    },
    "estimatedCostPer100g": 8,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 30,
    "dietType": "vegan"
  },
  "capsicum": {
    "id": "capsicum",
    "name": "Capsicum",
    "category": "vegetables",
    "nutritionPer100g": {
      "calories": 20,
      "protein": 1.0,
      "carbohydrates": 4.6,
      "fat": 0.2,
      "fiber": 1.7,
      "iron": null,
      "calcium": null
    },
    "estimatedCostPer100g": 8,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 30,
    "dietType": "vegan"
  },
  "coriander-leaves": {
    "id": "coriander-leaves",
    "name": "Coriander leaves",
    "category": "vegetables",
    "nutritionPer100g": {
      "calories": 23,
      "protein": 2.1,
      "carbohydrates": 3.7,
      "fat": 0.5,
      "fiber": 2.8,
      "iron": null,
      "calcium": null
    },
    "estimatedCostPer100g": 4,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 5,
    "dietType": "vegan"
  },
  "green-chilli": {
    "id": "green-chilli",
    "name": "Green chilli",
    "category": "vegetables",
    "nutritionPer100g": {
      "calories": 40,
      "protein": 2.0,
      "carbohydrates": 9.0,
      "fat": 0.2,
      "fiber": 1.5,
      "iron": null,
      "calcium": null
    },
    "estimatedCostPer100g": 6,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 3,
    "dietType": "vegan"
  },
  "mixed-vegetables": {
    "id": "mixed-vegetables",
    "name": "Mixed vegetables (carrot, beans, drumstick etc.)",
    "category": "vegetables",
    "nutritionPer100g": {
      "calories": 35,
      "protein": 1.8,
      "carbohydrates": 7.0,
      "fat": 0.3,
      "fiber": 2.5,
      "iron": null,
      "calcium": null
    },
    "estimatedCostPer100g": 6,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 50,
    "dietType": "vegan"
  },
  "oil": {
    "id": "oil",
    "name": "Cooking oil",
    "category": "cooking-essentials",
    "nutritionPer100g": {
      "calories": 900,
      "protein": 0.0,
      "carbohydrates": 0.0,
      "fat": 100.0,
      "fiber": 0.0,
      "iron": null,
      "calcium": null
    },
    "estimatedCostPer100g": 15,
    "units": [
      "g",
      "ml"
    ],
    "defaultUnit": "g",
    "servingWeight": 5,
    "dietType": "vegan"
  },
  "spices-mix": {
    "id": "spices-mix",
    "name": "Everyday spice mix",
    "category": "cooking-essentials",
    "nutritionPer100g": {
      "calories": 250,
      "protein": 8.0,
      "carbohydrates": 40.0,
      "fat": 8.0,
      "fiber": 20.0,
      "iron": null,
      "calcium": null
    },
    "estimatedCostPer100g": 20,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 2,
    "dietType": "vegan"
  },
  "tamarind": {
    "id": "tamarind",
    "name": "Tamarind (pulp)",
    "category": "cooking-essentials",
    "nutritionPer100g": {
      "calories": 239,
      "protein": 2.8,
      "carbohydrates": 62.5,
      "fat": 0.6,
      "fiber": 5.1,
      "iron": 2.8,
      "calcium": 74
    },
    "estimatedCostPer100g": 10,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 10,
    "dietType": "vegan"
  },
  "mustard-seeds": {
    "id": "mustard-seeds",
    "name": "Mustard seeds",
    "category": "cooking-essentials",
    "nutritionPer100g": {
      "calories": 508,
      "protein": 26.0,
      "carbohydrates": 28.0,
      "fat": 36.0,
      "fiber": 12.0,
      "iron": 6.5,
      "calcium": 266
    },
    "estimatedCostPer100g": 18,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 2,
    "dietType": "vegan"
  },
  "curry-leaves": {
    "id": "curry-leaves",
    "name": "Curry leaves",
    "category": "cooking-essentials",
    "nutritionPer100g": {
      "calories": 108,
      "protein": 6.0,
      "carbohydrates": 18.0,
      "fat": 1.0,
      "fiber": 6.0,
      "iron": 1.0,
      "calcium": 830
    },
    "estimatedCostPer100g": 8,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 1,
    "dietType": "vegan"
  },
  "fenugreek-seeds": {
    "id": "fenugreek-seeds",
    "name": "Fenugreek seeds (methi dana)",
    "category": "cooking-essentials",
    "nutritionPer100g": {
      "calories": 323,
      "protein": 23.0,
      "carbohydrates": 58.0,
      "fat": 6.4,
      "fiber": 25.0,
      "iron": 33.5,
      "calcium": 176
    },
    "estimatedCostPer100g": 15,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 2,
    "dietType": "vegan"
  },
  "rava": {
    "id": "rava",
    "name": "Rava / semolina (dry)",
    "category": "grains",
    "nutritionPer100g": {
      "calories": 360,
      "protein": 10.4,
      "carbohydrates": 72.6,
      "fat": 1.1,
      "fiber": 3.9,
      "iron": 1.0,
      "calcium": null
    },
    "estimatedCostPer100g": 6,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 60,
    "dietType": "vegan"
  },
  "moong-dal-soaked": {
    "id": "moong-dal-soaked",
    "name": "Moong dal (soaked, for chilla batter)",
    "category": "pulses",
    "nutritionPer100g": {
      "calories": 174,
      "protein": 12.0,
      "carbohydrates": 29.5,
      "fat": 0.6,
      "fiber": 8.2,
      "iron": 3.35,
      "calcium": null
    },
    "estimatedCostPer100g": 7,
    "units": [
      "g"
    ],
    "defaultUnit": "g",
    "servingWeight": 100,
    "dietType": "vegan"
  }
};

  global.NutriApp = global.NutriApp || {};
  global.NutriApp.foods = foods;
  global.NutriApp.foodList = Object.values(foods);
  global.NutriApp.NUTRITION_DISCLAIMER = NUTRITION_DISCLAIMER;
})(typeof window !== "undefined" ? window : globalThis);
