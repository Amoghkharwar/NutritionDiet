/**
 * js/data/recipes.js
 * Hardcoded recipe database.
 *
 * Recipe nutrition and cost are NEVER stored here as fixed numbers — only
 * ingredients (foodId + quantity/unit) and instructions are hardcoded. Totals
 * are always derived at read time via NutriApp.nutrition.calculateRecipeNutrition(),
 * so editing foods.js automatically updates every recipe that uses that food.
 * Because of this, a recipe's computed nutrition can differ from an
 * "approximate" figure quoted in whatever source the recipe came from —
 * that's expected: the app's numbers are internally consistent (the same
 * poha means the same nutrition everywhere), which a per-recipe manual
 * estimate can't guarantee.
 *
 * An ingredient with unit "piece" is counted (2 eggs, 3 idlis, 2 rotis); its
 * quantity converts to grams via that food's servingWeight. An ingredient can
 * carry adjustable: true with an options array — that's the specific
 * quantities/counts the spec calls out as user-adjustable for that dish
 * (e.g. idli count, dal/rice grams, roti count, egg count), independent of
 * the recipe's overall servings multiplier.
 *
 * servingLabel is an optional human-readable portion description (e.g.
 * "1 bowl (about 250g)", "2 chillas") for display alongside the computed
 * numbers — it's descriptive text only, never used in any calculation.
 *
 * dietType note: with only vegan / vegetarian / non-vegetarian to choose
 * from, egg dishes are tagged "non-vegetarian" (there's no separate
 * "eggetarian" category in the spec) — worth a second look if strict-veg
 * filtering matters to your users.
 *
 * idli-sambar and dosa-sambar currently reference foodIds (idli, dosa,
 * sambar) that were deliberately removed from foods.js in favour of their
 * real ingredients (see foods.js) — those two recipes will read as 0
 * nutrition (with a console warning, never a crash) until they're rebuilt
 * from rice/urad dal/toor dal etc.
 */
(function (global) {
  "use strict";

  var recipes = [
  {
    "id": "poha",
    "name": "Poha",
    "category": "Indian",
    "mealType": [
      "breakfast"
    ],
    "dietType": "vegetarian",
    "servings": 1,
    "prepTime": 10,
    "cookTime": 10,
    "difficulty": "Easy",
    "image": "placeholder",
    "ingredients": [
      {
        "foodId": "poha",
        "quantity": 60,
        "unit": "g"
      },
      {
        "foodId": "onion",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "tomato",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "peanuts",
        "quantity": 10,
        "unit": "g"
      },
      {
        "foodId": "green-peas",
        "quantity": 20,
        "unit": "g"
      },
      {
        "foodId": "lemon",
        "quantity": 5,
        "unit": "g"
      },
      {
        "foodId": "oil",
        "quantity": 5,
        "unit": "g"
      },
      {
        "foodId": "spices-mix",
        "quantity": 2,
        "unit": "g"
      }
    ],
    "instructions": [
      "Rinse the poha in a sieve for a few seconds and set aside to soften.",
      "Heat oil, splutter mustard seeds if using, and saute onion until soft.",
      "Add tomato, peas, peanuts and spices; cook for 2 to 3 minutes.",
      "Fold in the poha, mix well and finish with lemon juice and coriander."
    ],
    "tags": [
      "vegetarian",
      "budget",
      "quick"
    ]
  },
  {
    "id": "high-protein-poha",
    "name": "High-Protein Poha",
    "category": "Indian",
    "mealType": [
      "breakfast"
    ],
    "dietType": "vegetarian",
    "servings": 1,
    "prepTime": 10,
    "cookTime": 15,
    "difficulty": "Easy",
    "image": "placeholder",
    "ingredients": [
      {
        "foodId": "poha",
        "quantity": 55,
        "unit": "g"
      },
      {
        "foodId": "peanuts",
        "quantity": 12,
        "unit": "g"
      },
      {
        "foodId": "green-peas",
        "quantity": 25,
        "unit": "g"
      },
      {
        "foodId": "sprouts-moong",
        "quantity": 60,
        "unit": "g"
      },
      {
        "foodId": "soy-chunks",
        "quantity": 15,
        "unit": "g"
      },
      {
        "foodId": "curd",
        "quantity": 40,
        "unit": "g"
      },
      {
        "foodId": "onion",
        "quantity": 35,
        "unit": "g"
      },
      {
        "foodId": "tomato",
        "quantity": 25,
        "unit": "g"
      },
      {
        "foodId": "oil",
        "quantity": 4,
        "unit": "g"
      },
      {
        "foodId": "spices-mix",
        "quantity": 2,
        "unit": "g"
      }
    ],
    "instructions": [
      "Rinse the poha and set aside. Soak the soy chunks in hot water for 5 minutes, then squeeze dry.",
      "Heat oil and saute onion, tomato, peas and sprouts with the spices.",
      "Add the soy chunks and peanuts, and cook for 2 minutes.",
      "Fold in the poha and serve with the curd on the side."
    ],
    "tags": [
      "vegetarian",
      "high-protein"
    ]
  },
  {
    "id": "besan-chilla",
    "name": "Besan Chilla",
    "category": "Indian",
    "mealType": [
      "breakfast"
    ],
    "dietType": "vegetarian",
    "servings": 1,
    "prepTime": 10,
    "cookTime": 15,
    "difficulty": "Easy",
    "image": "placeholder",
    "ingredients": [
      {
        "foodId": "besan",
        "quantity": 60,
        "unit": "g"
      },
      {
        "foodId": "onion",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "tomato",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "coriander-leaves",
        "quantity": 5,
        "unit": "g"
      },
      {
        "foodId": "green-chilli",
        "quantity": 3,
        "unit": "g"
      },
      {
        "foodId": "spices-mix",
        "quantity": 2,
        "unit": "g"
      },
      {
        "foodId": "oil",
        "quantity": 8,
        "unit": "g"
      }
    ],
    "instructions": [
      "Whisk the besan with water into a smooth, pourable batter.",
      "Stir in chopped onion, tomato, green chilli, coriander and spices.",
      "Pour a ladle of batter onto a hot, lightly oiled tawa and spread thin.",
      "Cook both sides until golden and crisp at the edges."
    ],
    "tags": [
      "vegetarian",
      "budget",
      "quick"
    ]
  },
  {
    "id": "oats-vegetable-upma",
    "name": "Oats Vegetable Upma",
    "category": "Indian",
    "mealType": [
      "breakfast"
    ],
    "dietType": "vegetarian",
    "servings": 1,
    "prepTime": 10,
    "cookTime": 15,
    "difficulty": "Easy",
    "image": "placeholder",
    "ingredients": [
      {
        "foodId": "oats-dry",
        "quantity": 40,
        "unit": "g"
      },
      {
        "foodId": "green-peas",
        "quantity": 20,
        "unit": "g"
      },
      {
        "foodId": "onion",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "tomato",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "capsicum",
        "quantity": 20,
        "unit": "g"
      },
      {
        "foodId": "oil",
        "quantity": 5,
        "unit": "g"
      },
      {
        "foodId": "spices-mix",
        "quantity": 2,
        "unit": "g"
      }
    ],
    "instructions": [
      "Dry-roast the oats for 2 minutes and set aside.",
      "Heat oil, temper mustard seeds if using, and saute onion, capsicum, tomato and peas.",
      "Add 1.5 cups of hot water and the spices, and bring to a simmer.",
      "Stir in the roasted oats and cook for 2 to 3 minutes until the water is absorbed."
    ],
    "tags": [
      "vegetarian",
      "budget",
      "quick"
    ]
  },
  {
    "id": "idli-sambar",
    "name": "Idli with Sambar",
    "category": "Indian",
    "mealType": [
      "breakfast"
    ],
    "dietType": "vegetarian",
    "servings": 1,
    "prepTime": 15,
    "cookTime": 20,
    "difficulty": "Medium",
    "image": "placeholder",
    "ingredients": [
      {
        "foodId": "idli",
        "quantity": 3,
        "unit": "piece",
        "adjustable": true,
        "options": [
          2,
          3,
          4
        ]
      },
      {
        "foodId": "sambar",
        "quantity": 150,
        "unit": "g"
      }
    ],
    "instructions": [
      "Steam the idli batter in greased moulds for 10 to 12 minutes until a knife comes out clean.",
      "Meanwhile, simmer the sambar with cooked dal, vegetables and sambar powder.",
      "Temper the sambar with mustard seeds and curry leaves in a little oil.",
      "Serve the idlis hot with the sambar."
    ],
    "tags": [
      "vegetarian",
      "south-indian"
    ]
  },
  {
    "id": "dosa-sambar",
    "name": "Dosa with Sambar",
    "category": "Indian",
    "mealType": [
      "breakfast"
    ],
    "dietType": "vegetarian",
    "servings": 1,
    "prepTime": 15,
    "cookTime": 20,
    "difficulty": "Medium",
    "image": "placeholder",
    "ingredients": [
      {
        "foodId": "dosa",
        "quantity": 1,
        "unit": "piece",
        "adjustable": true,
        "options": [
          1,
          2
        ]
      },
      {
        "foodId": "sambar",
        "quantity": 150,
        "unit": "g"
      }
    ],
    "instructions": [
      "Spread a ladle of fermented dosa batter thin on a hot tawa in a circular motion.",
      "Drizzle a little oil around the edges and cook until the base is golden and crisp.",
      "Fold the dosa and simmer the sambar with dal and vegetables.",
      "Serve the dosa hot with the sambar."
    ],
    "tags": [
      "vegetarian",
      "south-indian"
    ]
  },
  {
    "id": "egg-omelette",
    "name": "Egg Omelette",
    "category": "Indian",
    "mealType": [
      "breakfast",
      "snack"
    ],
    "dietType": "non-vegetarian",
    "servings": 1,
    "prepTime": 5,
    "cookTime": 10,
    "difficulty": "Easy",
    "image": "placeholder",
    "ingredients": [
      {
        "foodId": "egg",
        "quantity": 2,
        "unit": "piece",
        "adjustable": true,
        "options": [
          2,
          3,
          4
        ]
      },
      {
        "foodId": "onion",
        "quantity": 25,
        "unit": "g"
      },
      {
        "foodId": "tomato",
        "quantity": 25,
        "unit": "g"
      },
      {
        "foodId": "coriander-leaves",
        "quantity": 3,
        "unit": "g"
      },
      {
        "foodId": "spices-mix",
        "quantity": 1,
        "unit": "g"
      },
      {
        "foodId": "oil",
        "quantity": 5,
        "unit": "g"
      }
    ],
    "instructions": [
      "Whisk the eggs with chopped onion, tomato, coriander and a pinch of spices.",
      "Heat oil in a pan over medium heat.",
      "Pour in the mixture and cook until the base sets.",
      "Flip and cook the other side until fully done."
    ],
    "tags": [
      "non-vegetarian",
      "high-protein",
      "quick"
    ]
  },
  {
    "id": "paneer-bhurji",
    "name": "Paneer Bhurji",
    "category": "Indian",
    "mealType": [
      "breakfast",
      "lunch",
      "dinner"
    ],
    "dietType": "vegetarian",
    "servings": 1,
    "prepTime": 10,
    "cookTime": 15,
    "difficulty": "Easy",
    "image": "placeholder",
    "ingredients": [
      {
        "foodId": "paneer",
        "quantity": 100,
        "unit": "g"
      },
      {
        "foodId": "onion",
        "quantity": 40,
        "unit": "g"
      },
      {
        "foodId": "tomato",
        "quantity": 50,
        "unit": "g"
      },
      {
        "foodId": "capsicum",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "oil",
        "quantity": 6,
        "unit": "g"
      },
      {
        "foodId": "spices-mix",
        "quantity": 2,
        "unit": "g"
      }
    ],
    "instructions": [
      "Crumble the paneer with your hands or a fork.",
      "Heat oil and saute onion and capsicum until softened.",
      "Add tomato and spices and cook until the tomato breaks down.",
      "Stir in the paneer and cook for 2 to 3 minutes, then finish with coriander."
    ],
    "tags": [
      "vegetarian",
      "high-protein",
      "quick"
    ]
  },
  {
    "id": "dal-rice",
    "name": "Dal Rice",
    "category": "Indian",
    "mealType": [
      "lunch",
      "dinner"
    ],
    "dietType": "vegetarian",
    "servings": 1,
    "prepTime": 10,
    "cookTime": 25,
    "difficulty": "Medium",
    "image": "placeholder",
    "ingredients": [
      {
        "foodId": "moong-dal-cooked",
        "quantity": 150,
        "unit": "g",
        "adjustable": true,
        "options": [
          100,
          150,
          200
        ]
      },
      {
        "foodId": "rice-cooked",
        "quantity": 150,
        "unit": "g",
        "adjustable": true,
        "options": [
          100,
          150,
          200
        ]
      },
      {
        "foodId": "onion",
        "quantity": 20,
        "unit": "g"
      },
      {
        "foodId": "tomato",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "oil",
        "quantity": 5,
        "unit": "g"
      },
      {
        "foodId": "spices-mix",
        "quantity": 2,
        "unit": "g"
      }
    ],
    "instructions": [
      "Pressure-cook the moong dal with turmeric until soft.",
      "Heat oil and temper cumin seeds, onion and tomato with the spices.",
      "Pour the tempering over the cooked dal and simmer for 2 minutes.",
      "Serve hot with steamed rice."
    ],
    "tags": [
      "vegetarian",
      "budget"
    ]
  },
  {
    "id": "rajma-rice",
    "name": "Rajma Rice",
    "category": "Indian",
    "mealType": [
      "lunch",
      "dinner"
    ],
    "dietType": "vegetarian",
    "servings": 1,
    "prepTime": 15,
    "cookTime": 30,
    "difficulty": "Medium",
    "image": "placeholder",
    "ingredients": [
      {
        "foodId": "rajma-cooked",
        "quantity": 180,
        "unit": "g"
      },
      {
        "foodId": "rice-cooked",
        "quantity": 150,
        "unit": "g"
      },
      {
        "foodId": "onion",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "tomato",
        "quantity": 40,
        "unit": "g"
      },
      {
        "foodId": "oil",
        "quantity": 6,
        "unit": "g"
      },
      {
        "foodId": "spices-mix",
        "quantity": 2,
        "unit": "g"
      }
    ],
    "instructions": [
      "Soak the rajma overnight, then pressure-cook until soft.",
      "Saute onion and tomato in oil with the spices until the oil separates.",
      "Add the cooked rajma and simmer for 10 minutes, mashing a few beans to thicken the gravy.",
      "Serve hot with steamed rice."
    ],
    "tags": [
      "vegetarian",
      "high-protein"
    ]
  },
  {
    "id": "chole-roti",
    "name": "Chole with Roti",
    "category": "Indian",
    "mealType": [
      "lunch",
      "dinner"
    ],
    "dietType": "vegetarian",
    "servings": 1,
    "prepTime": 15,
    "cookTime": 30,
    "difficulty": "Medium",
    "image": "placeholder",
    "ingredients": [
      {
        "foodId": "chana-cooked",
        "quantity": 180,
        "unit": "g"
      },
      {
        "foodId": "roti",
        "quantity": 2,
        "unit": "piece",
        "adjustable": true,
        "options": [
          2,
          3,
          4
        ]
      },
      {
        "foodId": "onion",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "tomato",
        "quantity": 40,
        "unit": "g"
      },
      {
        "foodId": "oil",
        "quantity": 8,
        "unit": "g"
      },
      {
        "foodId": "spices-mix",
        "quantity": 2,
        "unit": "g"
      }
    ],
    "instructions": [
      "Saute onion and tomato in oil with chole spices until well cooked down.",
      "Add the boiled chana and simmer for 10 to 15 minutes until the gravy thickens.",
      "Mash a few chickpeas to thicken further, and finish with coriander.",
      "Serve hot with roti."
    ],
    "tags": [
      "vegetarian",
      "budget"
    ]
  },
  {
    "id": "paneer-roti",
    "name": "Paneer Sabzi with Roti",
    "category": "Indian",
    "mealType": [
      "lunch",
      "dinner"
    ],
    "dietType": "vegetarian",
    "servings": 1,
    "prepTime": 10,
    "cookTime": 20,
    "difficulty": "Easy",
    "image": "placeholder",
    "ingredients": [
      {
        "foodId": "paneer",
        "quantity": 100,
        "unit": "g",
        "adjustable": true,
        "options": [
          50,
          100,
          150,
          200
        ]
      },
      {
        "foodId": "roti",
        "quantity": 2,
        "unit": "piece",
        "adjustable": true,
        "options": [
          2,
          3,
          4
        ]
      },
      {
        "foodId": "onion",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "capsicum",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "tomato",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "oil",
        "quantity": 6,
        "unit": "g"
      },
      {
        "foodId": "spices-mix",
        "quantity": 2,
        "unit": "g"
      }
    ],
    "instructions": [
      "Lightly pan-sear the paneer cubes and set aside.",
      "Saute onion and capsicum in oil, then add tomato and spices.",
      "Return the paneer to the pan and simmer for 2 to 3 minutes.",
      "Serve hot with roti."
    ],
    "tags": [
      "vegetarian",
      "high-protein"
    ]
  },
  {
    "id": "soy-chunk-curry-rice",
    "name": "Soy Chunk Curry with Rice",
    "category": "Indian",
    "mealType": [
      "lunch",
      "dinner"
    ],
    "dietType": "vegetarian",
    "servings": 1,
    "prepTime": 10,
    "cookTime": 20,
    "difficulty": "Medium",
    "image": "placeholder",
    "ingredients": [
      {
        "foodId": "soy-chunks",
        "quantity": 40,
        "unit": "g"
      },
      {
        "foodId": "rice-cooked",
        "quantity": 150,
        "unit": "g"
      },
      {
        "foodId": "onion",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "tomato",
        "quantity": 40,
        "unit": "g"
      },
      {
        "foodId": "oil",
        "quantity": 6,
        "unit": "g"
      },
      {
        "foodId": "spices-mix",
        "quantity": 2,
        "unit": "g"
      }
    ],
    "instructions": [
      "Soak the soy chunks in hot water for 10 minutes, then squeeze out excess water.",
      "Saute onion and tomato in oil with the spices until soft.",
      "Add the soy chunks and a little water, and simmer for 10 minutes.",
      "Serve hot with steamed rice."
    ],
    "tags": [
      "vegetarian",
      "high-protein",
      "budget"
    ]
  },
  {
    "id": "chicken-rice",
    "name": "Chicken with Rice",
    "category": "Indian",
    "mealType": [
      "lunch",
      "dinner"
    ],
    "dietType": "non-vegetarian",
    "servings": 1,
    "prepTime": 15,
    "cookTime": 25,
    "difficulty": "Medium",
    "image": "placeholder",
    "ingredients": [
      {
        "foodId": "chicken-breast-cooked",
        "quantity": 150,
        "unit": "g",
        "adjustable": true,
        "options": [
          100,
          150,
          200
        ]
      },
      {
        "foodId": "rice-cooked",
        "quantity": 150,
        "unit": "g"
      },
      {
        "foodId": "onion",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "tomato",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "oil",
        "quantity": 6,
        "unit": "g"
      },
      {
        "foodId": "spices-mix",
        "quantity": 2,
        "unit": "g"
      }
    ],
    "instructions": [
      "Saute onion and tomato in oil with the spices until softened.",
      "Add the chicken and cook through, stirring occasionally.",
      "Simmer for a few minutes so the flavours combine.",
      "Serve hot with steamed rice."
    ],
    "tags": [
      "non-vegetarian",
      "high-protein"
    ]
  },
  {
    "id": "chicken-roti",
    "name": "Chicken with Roti",
    "category": "Indian",
    "mealType": [
      "lunch",
      "dinner"
    ],
    "dietType": "non-vegetarian",
    "servings": 1,
    "prepTime": 15,
    "cookTime": 25,
    "difficulty": "Medium",
    "image": "placeholder",
    "ingredients": [
      {
        "foodId": "chicken-breast-cooked",
        "quantity": 150,
        "unit": "g",
        "adjustable": true,
        "options": [
          100,
          150,
          200
        ]
      },
      {
        "foodId": "roti",
        "quantity": 2,
        "unit": "piece",
        "adjustable": true,
        "options": [
          2,
          3,
          4
        ]
      },
      {
        "foodId": "onion",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "tomato",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "oil",
        "quantity": 6,
        "unit": "g"
      },
      {
        "foodId": "spices-mix",
        "quantity": 2,
        "unit": "g"
      }
    ],
    "instructions": [
      "Saute onion and tomato in oil with the spices until softened.",
      "Add the chicken and cook through, stirring occasionally.",
      "Simmer for a few minutes so the flavours combine.",
      "Serve hot with roti."
    ],
    "tags": [
      "non-vegetarian",
      "high-protein"
    ]
  },
  {
    "id": "egg-curry-rice",
    "name": "Egg Curry with Rice",
    "category": "Indian",
    "mealType": [
      "lunch",
      "dinner"
    ],
    "dietType": "non-vegetarian",
    "servings": 1,
    "prepTime": 10,
    "cookTime": 20,
    "difficulty": "Medium",
    "image": "placeholder",
    "ingredients": [
      {
        "foodId": "egg",
        "quantity": 3,
        "unit": "piece",
        "adjustable": true,
        "options": [
          2,
          3,
          4
        ]
      },
      {
        "foodId": "rice-cooked",
        "quantity": 150,
        "unit": "g"
      },
      {
        "foodId": "onion",
        "quantity": 40,
        "unit": "g"
      },
      {
        "foodId": "tomato",
        "quantity": 50,
        "unit": "g"
      },
      {
        "foodId": "oil",
        "quantity": 8,
        "unit": "g"
      },
      {
        "foodId": "spices-mix",
        "quantity": 2,
        "unit": "g"
      }
    ],
    "instructions": [
      "Boil the eggs, peel and halve them.",
      "Saute onion and tomato in oil with the spices until the oil separates.",
      "Add a little water and simmer the gravy for 5 minutes, then add the eggs.",
      "Simmer for 2 more minutes and serve hot with steamed rice."
    ],
    "tags": [
      "non-vegetarian",
      "high-protein"
    ]
  },
  {
    "id": "peanut-butter-toast",
    "name": "Peanut Butter Toast",
    "category": "Indian",
    "mealType": [
      "snack",
      "breakfast"
    ],
    "dietType": "vegetarian",
    "servings": 1,
    "prepTime": 5,
    "cookTime": 2,
    "difficulty": "Easy",
    "image": "placeholder",
    "ingredients": [
      {
        "foodId": "bread-whole-wheat",
        "quantity": 2,
        "unit": "piece",
        "adjustable": true,
        "options": [
          2,
          3
        ]
      },
      {
        "foodId": "peanut-butter",
        "quantity": 30,
        "unit": "g"
      }
    ],
    "instructions": [
      "Lightly toast the bread slices.",
      "Spread the peanut butter evenly over each slice.",
      "Optionally top with banana slices before serving."
    ],
    "tags": [
      "vegetarian",
      "quick",
      "snack"
    ]
  },
  {
    "id": "sprouts-chaat",
    "name": "Sprouts Chaat",
    "category": "Indian",
    "mealType": [
      "snack"
    ],
    "dietType": "vegetarian",
    "servings": 1,
    "prepTime": 10,
    "cookTime": 0,
    "difficulty": "Easy",
    "image": "placeholder",
    "ingredients": [
      {
        "foodId": "sprouts-moong",
        "quantity": 100,
        "unit": "g"
      },
      {
        "foodId": "onion",
        "quantity": 25,
        "unit": "g"
      },
      {
        "foodId": "tomato",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "cucumber",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "lemon",
        "quantity": 5,
        "unit": "g"
      },
      {
        "foodId": "coriander-leaves",
        "quantity": 3,
        "unit": "g"
      },
      {
        "foodId": "spices-mix",
        "quantity": 1,
        "unit": "g"
      }
    ],
    "instructions": [
      "Steam or blanch the sprouts for 3 minutes, then cool.",
      "Toss with chopped onion, tomato and cucumber.",
      "Season with lemon juice, chaat spices and coriander."
    ],
    "tags": [
      "vegetarian",
      "budget",
      "low-calorie"
    ]
  },
  {
    "id": "curd-fruit-nuts-bowl",
    "name": "Curd, Fruit and Nuts Bowl",
    "category": "Indian",
    "mealType": [
      "breakfast",
      "snack"
    ],
    "dietType": "vegetarian",
    "servings": 1,
    "prepTime": 5,
    "cookTime": 0,
    "difficulty": "Easy",
    "image": "placeholder",
    "ingredients": [
      {
        "foodId": "greek-yogurt",
        "quantity": 150,
        "unit": "g"
      },
      {
        "foodId": "banana",
        "quantity": 100,
        "unit": "g"
      },
      {
        "foodId": "almonds",
        "quantity": 10,
        "unit": "g"
      }
    ],
    "instructions": [
      "Spoon the yogurt into a bowl.",
      "Slice the banana over the top.",
      "Scatter the almonds over the bowl and serve."
    ],
    "tags": [
      "vegetarian",
      "high-protein",
      "quick"
    ]
  },
  {
    "id": "classic-vegetable-poha",
    "name": "Classic Vegetable Poha",
    "category": "Indian",
    "mealType": [
      "breakfast"
    ],
    "dietType": "vegetarian",
    "servings": 1,
    "prepTime": 10,
    "cookTime": 10,
    "difficulty": "Easy",
    "image": "images/recipes/classic-vegetable-poha.jpg",
    "servingLabel": "1 bowl (about 250g)",
    "ingredients": [
      {
        "foodId": "poha",
        "quantity": 60,
        "unit": "g"
      },
      {
        "foodId": "onion",
        "quantity": 40,
        "unit": "g"
      },
      {
        "foodId": "tomato",
        "quantity": 50,
        "unit": "g"
      },
      {
        "foodId": "green-peas",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "peanuts",
        "quantity": 10,
        "unit": "g"
      },
      {
        "foodId": "oil",
        "quantity": 5,
        "unit": "g"
      },
      {
        "foodId": "lemon",
        "quantity": 10,
        "unit": "g"
      },
      {
        "foodId": "coriander-leaves",
        "quantity": 5,
        "unit": "g"
      },
      {
        "foodId": "green-chilli",
        "quantity": 3,
        "unit": "g"
      },
      {
        "foodId": "spices-mix",
        "quantity": 2,
        "unit": "g"
      }
    ],
    "instructions": [
      "Rinse the poha in a sieve and set aside to soften.",
      "Saute onion, tomato, green peas and green chilli in the oil with the spices.",
      "Add the peanuts and cook for a minute, then fold in the poha.",
      "Finish with lemon juice and coriander."
    ],
    "tags": [
      "fat-loss",
      "vegetarian",
      "balanced"
    ]
  },
  {
    "id": "peanut-protein-poha",
    "name": "Peanut Protein Poha",
    "category": "Indian",
    "mealType": [
      "breakfast"
    ],
    "dietType": "vegetarian",
    "servings": 1,
    "prepTime": 10,
    "cookTime": 10,
    "difficulty": "Easy",
    "image": "images/recipes/peanut-protein-poha.jpg",
    "servingLabel": "1 bowl (about 280g)",
    "ingredients": [
      {
        "foodId": "poha",
        "quantity": 60,
        "unit": "g"
      },
      {
        "foodId": "peanuts",
        "quantity": 25,
        "unit": "g"
      },
      {
        "foodId": "green-peas",
        "quantity": 40,
        "unit": "g"
      },
      {
        "foodId": "onion",
        "quantity": 40,
        "unit": "g"
      },
      {
        "foodId": "tomato",
        "quantity": 50,
        "unit": "g"
      },
      {
        "foodId": "oil",
        "quantity": 5,
        "unit": "g"
      },
      {
        "foodId": "lemon",
        "quantity": 10,
        "unit": "g"
      },
      {
        "foodId": "coriander-leaves",
        "quantity": 5,
        "unit": "g"
      }
    ],
    "instructions": [
      "Rinse the poha in a sieve and set aside to soften.",
      "Saute onion, tomato and green peas in the oil.",
      "Add the peanuts and cook for a minute, then fold in the poha.",
      "Finish with lemon juice and coriander."
    ],
    "tags": [
      "muscle-building",
      "high-protein",
      "vegetarian"
    ]
  },
  {
    "id": "egg-protein-poha",
    "name": "Egg Protein Poha",
    "category": "Indian",
    "mealType": [
      "breakfast"
    ],
    "dietType": "non-vegetarian",
    "servings": 1,
    "prepTime": 10,
    "cookTime": 12,
    "difficulty": "Easy",
    "image": "images/recipes/egg-protein-poha.jpg",
    "servingLabel": "1 bowl + 2 eggs",
    "ingredients": [
      {
        "foodId": "poha",
        "quantity": 60,
        "unit": "g"
      },
      {
        "foodId": "egg",
        "quantity": 2,
        "unit": "piece",
        "adjustable": true,
        "options": [
          2,
          3,
          4
        ]
      },
      {
        "foodId": "onion",
        "quantity": 40,
        "unit": "g"
      },
      {
        "foodId": "tomato",
        "quantity": 50,
        "unit": "g"
      },
      {
        "foodId": "green-peas",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "oil",
        "quantity": 5,
        "unit": "g"
      },
      {
        "foodId": "coriander-leaves",
        "quantity": 5,
        "unit": "g"
      },
      {
        "foodId": "lemon",
        "quantity": 10,
        "unit": "g"
      }
    ],
    "instructions": [
      "Rinse the poha in a sieve and set aside to soften.",
      "Saute onion, tomato and green peas in the oil.",
      "Push the vegetables aside, scramble the eggs in the same pan, then mix together.",
      "Fold in the poha and finish with lemon juice and coriander."
    ],
    "tags": [
      "muscle-building",
      "high-protein",
      "egg"
    ]
  },
  {
    "id": "sprouts-poha-bowl",
    "name": "Sprouts Poha Bowl",
    "category": "Indian",
    "mealType": [
      "breakfast"
    ],
    "dietType": "vegetarian",
    "servings": 1,
    "prepTime": 10,
    "cookTime": 10,
    "difficulty": "Easy",
    "image": "images/recipes/sprouts-poha-bowl.jpg",
    "servingLabel": "1 bowl (about 300g)",
    "ingredients": [
      {
        "foodId": "poha",
        "quantity": 50,
        "unit": "g"
      },
      {
        "foodId": "sprouts-moong",
        "quantity": 80,
        "unit": "g"
      },
      {
        "foodId": "peanuts",
        "quantity": 10,
        "unit": "g"
      },
      {
        "foodId": "tomato",
        "quantity": 50,
        "unit": "g"
      },
      {
        "foodId": "onion",
        "quantity": 40,
        "unit": "g"
      },
      {
        "foodId": "green-peas",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "oil",
        "quantity": 5,
        "unit": "g"
      },
      {
        "foodId": "lemon",
        "quantity": 10,
        "unit": "g"
      }
    ],
    "instructions": [
      "Rinse the poha in a sieve and set aside to soften.",
      "Saute onion, tomato and green peas in the oil, then stir in the sprouts.",
      "Add the peanuts and cook for a minute, then fold in the poha.",
      "Finish with lemon juice."
    ],
    "tags": [
      "fat-loss",
      "high-protein",
      "vegetarian",
      "high-fiber"
    ]
  },
  {
    "id": "paneer-protein-poha",
    "name": "Paneer Protein Poha",
    "category": "Indian",
    "mealType": [
      "breakfast"
    ],
    "dietType": "vegetarian",
    "servings": 1,
    "prepTime": 10,
    "cookTime": 12,
    "difficulty": "Easy",
    "image": "images/recipes/paneer-protein-poha.jpg",
    "servingLabel": "1 bowl",
    "ingredients": [
      {
        "foodId": "poha",
        "quantity": 50,
        "unit": "g"
      },
      {
        "foodId": "paneer",
        "quantity": 80,
        "unit": "g"
      },
      {
        "foodId": "green-peas",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "onion",
        "quantity": 40,
        "unit": "g"
      },
      {
        "foodId": "tomato",
        "quantity": 50,
        "unit": "g"
      },
      {
        "foodId": "oil",
        "quantity": 5,
        "unit": "g"
      },
      {
        "foodId": "coriander-leaves",
        "quantity": 5,
        "unit": "g"
      },
      {
        "foodId": "lemon",
        "quantity": 10,
        "unit": "g"
      }
    ],
    "instructions": [
      "Rinse the poha in a sieve and set aside to soften.",
      "Saute onion, tomato and green peas in the oil.",
      "Add the paneer cubes and cook for 2 minutes, then fold in the poha.",
      "Finish with lemon juice and coriander."
    ],
    "tags": [
      "muscle-building",
      "high-protein",
      "vegetarian"
    ]
  },
  {
    "id": "moong-dal-chilla",
    "name": "Moong Dal Chilla",
    "category": "Indian",
    "mealType": [
      "breakfast"
    ],
    "dietType": "vegetarian",
    "servings": 1,
    "prepTime": 15,
    "cookTime": 15,
    "difficulty": "Medium",
    "image": "images/recipes/moong-dal-chilla.jpg",
    "servingLabel": "2 chillas",
    "ingredients": [
      {
        "foodId": "moong-dal-soaked",
        "quantity": 100,
        "unit": "g"
      },
      {
        "foodId": "onion",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "tomato",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "coriander-leaves",
        "quantity": 5,
        "unit": "g"
      },
      {
        "foodId": "green-chilli",
        "quantity": 3,
        "unit": "g"
      },
      {
        "foodId": "oil",
        "quantity": 5,
        "unit": "g"
      },
      {
        "foodId": "spices-mix",
        "quantity": 2,
        "unit": "g"
      }
    ],
    "instructions": [
      "Grind the soaked moong dal to a thick, pourable batter with a little water.",
      "Stir in chopped onion, tomato, green chilli, coriander and spices.",
      "Spread a ladle of batter thin on a hot, lightly oiled tawa.",
      "Cook both sides until golden and cooked through."
    ],
    "tags": [
      "fat-loss",
      "high-protein",
      "vegetarian"
    ]
  },
  {
    "id": "paneer-moong-chilla",
    "name": "Paneer Moong Chilla",
    "category": "Indian",
    "mealType": [
      "breakfast"
    ],
    "dietType": "vegetarian",
    "servings": 1,
    "prepTime": 15,
    "cookTime": 15,
    "difficulty": "Medium",
    "image": "images/recipes/paneer-moong-chilla.jpg",
    "servingLabel": "2 chillas",
    "ingredients": [
      {
        "foodId": "moong-dal-soaked",
        "quantity": 100,
        "unit": "g"
      },
      {
        "foodId": "paneer",
        "quantity": 70,
        "unit": "g"
      },
      {
        "foodId": "onion",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "tomato",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "coriander-leaves",
        "quantity": 5,
        "unit": "g"
      },
      {
        "foodId": "oil",
        "quantity": 5,
        "unit": "g"
      }
    ],
    "instructions": [
      "Grind the soaked moong dal to a thick, pourable batter with a little water.",
      "Stir in chopped onion, tomato and coriander.",
      "Spread a ladle of batter thin on a hot, lightly oiled tawa and scatter crumbled paneer over it.",
      "Cook both sides until golden and cooked through."
    ],
    "tags": [
      "muscle-building",
      "high-protein",
      "vegetarian"
    ]
  },
  {
    "id": "vegetable-besan-chilla",
    "name": "Vegetable Besan Chilla",
    "category": "Indian",
    "mealType": [
      "breakfast"
    ],
    "dietType": "vegetarian",
    "servings": 1,
    "prepTime": 10,
    "cookTime": 15,
    "difficulty": "Easy",
    "image": "images/recipes/vegetable-besan-chilla.jpg",
    "servingLabel": null,
    "ingredients": [
      {
        "foodId": "besan",
        "quantity": 70,
        "unit": "g"
      },
      {
        "foodId": "onion",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "tomato",
        "quantity": 40,
        "unit": "g"
      },
      {
        "foodId": "capsicum",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "coriander-leaves",
        "quantity": 5,
        "unit": "g"
      },
      {
        "foodId": "oil",
        "quantity": 5,
        "unit": "g"
      },
      {
        "foodId": "spices-mix",
        "quantity": 2,
        "unit": "g"
      }
    ],
    "instructions": [
      "Whisk the besan with water into a smooth, pourable batter.",
      "Stir in chopped onion, tomato, capsicum, coriander and spices.",
      "Spread a ladle of batter thin on a hot, lightly oiled tawa.",
      "Cook both sides until golden and crisp at the edges."
    ],
    "tags": [
      "fat-loss",
      "vegetarian",
      "high-fiber"
    ]
  },
  {
    "id": "egg-vegetable-scramble",
    "name": "Egg & Vegetable Scramble",
    "category": "Indian",
    "mealType": [
      "breakfast"
    ],
    "dietType": "non-vegetarian",
    "servings": 1,
    "prepTime": 5,
    "cookTime": 10,
    "difficulty": "Easy",
    "image": "images/recipes/egg-vegetable-scramble.jpg",
    "servingLabel": "2 eggs",
    "ingredients": [
      {
        "foodId": "egg",
        "quantity": 2,
        "unit": "piece",
        "adjustable": true,
        "options": [
          2,
          3,
          4
        ]
      },
      {
        "foodId": "onion",
        "quantity": 30,
        "unit": "g"
      },
      {
        "foodId": "tomato",
        "quantity": 50,
        "unit": "g"
      },
      {
        "foodId": "capsicum",
        "quantity": 40,
        "unit": "g"
      },
      {
        "foodId": "oil",
        "quantity": 5,
        "unit": "g"
      },
      {
        "foodId": "coriander-leaves",
        "quantity": 5,
        "unit": "g"
      }
    ],
    "instructions": [
      "Saute onion, tomato and capsicum in the oil until softened.",
      "Crack in the eggs and scramble on low heat until just set.",
      "Finish with coriander."
    ],
    "tags": [
      "muscle-building",
      "high-protein",
      "egg"
    ]
  },
  {
    "id": "rava-vegetable-upma",
    "name": "Vegetable Upma",
    "category": "Indian",
    "mealType": [
      "breakfast"
    ],
    "dietType": "vegetarian",
    "servings": 1,
    "prepTime": 10,
    "cookTime": 15,
    "difficulty": "Easy",
    "image": "images/recipes/rava-vegetable-upma.jpg",
    "servingLabel": null,
    "ingredients": [
      {
        "foodId": "rava",
        "quantity": 60,
        "unit": "g"
      },
      {
        "foodId": "mixed-vegetables",
        "quantity": 100,
        "unit": "g"
      },
      {
        "foodId": "peanuts",
        "quantity": 10,
        "unit": "g"
      },
      {
        "foodId": "oil",
        "quantity": 5,
        "unit": "g"
      },
      {
        "foodId": "onion",
        "quantity": 40,
        "unit": "g"
      },
      {
        "foodId": "lemon",
        "quantity": 10,
        "unit": "g"
      },
      {
        "foodId": "coriander-leaves",
        "quantity": 5,
        "unit": "g"
      }
    ],
    "instructions": [
      "Dry-roast the rava for 2 to 3 minutes until fragrant, then set aside.",
      "Heat the oil and saute onion and mixed vegetables with the peanuts.",
      "Add hot water and bring to a simmer, then stir in the roasted rava.",
      "Cook for 2 to 3 minutes until the water is absorbed, and finish with lemon and coriander."
    ],
    "tags": [
      "fat-loss",
      "vegetarian",
      "balanced"
    ]
  }
];

  global.NutriApp = global.NutriApp || {};
  global.NutriApp.recipes = recipes;

  var byId = {};
  recipes.forEach(function (r) { byId[r.id] = r; });
  global.NutriApp.recipesById = byId;

  // "create an image requirement list" — derived from the recipe list
  // itself so it can never drift out of sync. Recipes without a real photo
  // yet keep image: "placeholder"; replace with a real path in
  // images/recipes/ as photos come in, one dish at a time.
  global.NutriApp.requiredRecipeImages = recipes
    .filter(function (r) { return r.image === "placeholder"; })
    .map(function (r) { return r.name; });
})(typeof window !== "undefined" ? window : globalThis);
