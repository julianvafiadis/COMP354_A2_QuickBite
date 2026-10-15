export const restaurants = [
  {
    "id": "basil",
    "name": "Basil & Brick",
    "cuisine": "Italian",
    "description": "Stone-baked favourites. A little taste of the neighbourhood.",
    "address": "1420 Rue Mackay, Montréal",
    "pickupMinutes": 20,
    "open": true,
    "openingHours": "11:00–22:00",
    "hoursNote": "Fictional demo hours; open status is set in the sample data."
  },
  {
    "id": "seoul",
    "name": "Seoul Kitchen",
    "cuisine": "Korean",
    "description": "Big flavour, comforting bowls, and a bit of heat.",
    "address": "1650 Rue Sainte-Catherine O, Montréal",
    "pickupMinutes": 15,
    "open": true,
    "openingHours": "11:00–22:00",
    "hoursNote": "Fictional demo hours; open status is set in the sample data."
  },
  {
    "id": "green",
    "name": "The Green Table",
    "cuisine": "Healthy",
    "description": "Seasonal ingredients. Bright bowls. Feel-good food.",
    "address": "1210 Rue Guy, Montréal",
    "pickupMinutes": 10,
    "open": true,
    "openingHours": "11:00–22:00",
    "hoursNote": "Fictional demo hours; open status is set in the sample data."
  },
  {
    "id": "bun",
    "name": "Bun Club",
    "cuisine": "Burgers",
    "description": "Your favourite smash burgers, made with care.",
    "address": "1345 Boulevard De Maisonneuve O, Montréal",
    "pickupMinutes": 15,
    "open": true,
    "openingHours": "11:00–22:00",
    "hoursNote": "Fictional demo hours; open status is set in the sample data."
  },
  {
    "id": "taco",
    "name": "Casa Taco",
    "cuisine": "Mexican",
    "description": "Fresh tortillas and family recipes, every day.",
    "address": "1510 Rue Bishop, Montréal",
    "pickupMinutes": 15,
    "open": false,
    "openingHours": "11:00–22:00",
    "hoursNote": "Fictional demo hours; open status is set in the sample data."
  },
  {
    "id": "cafe",
    "name": "Sunday Café",
    "cuisine": "Café",
    "description": "Slow mornings, good coffee, and something sweet.",
    "address": "1280 Rue Crescent, Montréal",
    "pickupMinutes": 10,
    "open": true,
    "openingHours": "11:00–22:00",
    "hoursNote": "Fictional demo hours; open status is set in the sample data."
  }
];

export const menuItems = [
  {
    "id": "basil-margherita",
    "restaurantId": "basil",
    "name": "Margherita",
    "description": "San Marzano tomato, fresh mozzarella, basil, olive oil.",
    "category": "Pizzas",
    "priceCents": 1650,
    "vegetarian": true,
    "available": true
  },
  {
    "id": "basil-pepperoni",
    "restaurantId": "basil",
    "name": "Pepperoni",
    "description": "Classic pepperoni, mozzarella, tomato sauce.",
    "category": "Pizzas",
    "priceCents": 1850,
    "vegetarian": false,
    "available": true
  },
  {
    "id": "basil-mushroom",
    "restaurantId": "basil",
    "name": "Wild Mushroom",
    "description": "Roasted mushrooms, garlic cream, thyme, parmesan.",
    "category": "Pizzas",
    "priceCents": 1900,
    "vegetarian": true,
    "available": true
  },
  {
    "id": "basil-rigatoni",
    "restaurantId": "basil",
    "name": "Pesto Rigatoni",
    "description": "Basil pesto, cherry tomatoes, toasted pine nuts.",
    "category": "Pasta",
    "priceCents": 1700,
    "vegetarian": true,
    "available": true
  },
  {
    "id": "basil-salad",
    "restaurantId": "basil",
    "name": "House Greens",
    "description": "Mixed leaves, cucumber, lemon vinaigrette.",
    "category": "Sides",
    "priceCents": 650,
    "vegetarian": true,
    "available": true
  },
  {
    "id": "basil-tiramisu",
    "restaurantId": "basil",
    "name": "Tiramisu",
    "description": "Espresso-soaked ladyfingers, mascarpone, cocoa.",
    "category": "Desserts",
    "priceCents": 750,
    "vegetarian": true,
    "available": false
  },
  {
    "id": "basil-lemon",
    "restaurantId": "basil",
    "name": "Sparkling Lemon",
    "description": "Chilled lemon soda, 330 mL.",
    "category": "Drinks",
    "priceCents": 350,
    "vegetarian": true,
    "available": true
  },
  {
    "id": "seoul-bibimbap",
    "restaurantId": "seoul",
    "name": "Bibimbap",
    "description": "Rice, vegetables, beef, egg, and gochujang.",
    "category": "Bowls",
    "priceCents": 1650,
    "vegetarian": false,
    "available": true
  },
  {
    "id": "seoul-tofu",
    "restaurantId": "seoul",
    "name": "Crispy Tofu Bowl",
    "description": "Sesame tofu, pickled vegetables, steamed rice.",
    "category": "Bowls",
    "priceCents": 1500,
    "vegetarian": true,
    "available": true
  },
  {
    "id": "seoul-chicken",
    "restaurantId": "seoul",
    "name": "Korean Fried Chicken",
    "description": "Crispy chicken with sweet and spicy glaze.",
    "category": "Favourites",
    "priceCents": 1800,
    "vegetarian": false,
    "available": true
  },
  {
    "id": "seoul-kimchi",
    "restaurantId": "seoul",
    "name": "Kimchi",
    "description": "House-fermented cabbage with a little heat.",
    "category": "Sides",
    "priceCents": 450,
    "vegetarian": true,
    "available": true
  },
  {
    "id": "seoul-tea",
    "restaurantId": "seoul",
    "name": "Iced Barley Tea",
    "description": "Roasted barley tea, 400 mL.",
    "category": "Drinks",
    "priceCents": 300,
    "vegetarian": true,
    "available": true
  },
  {
    "id": "green-harvest",
    "restaurantId": "green",
    "name": "Harvest Bowl",
    "description": "Quinoa, roast squash, kale, chickpeas, tahini.",
    "category": "Bowls",
    "priceCents": 1450,
    "vegetarian": true,
    "available": true
  },
  {
    "id": "green-salmon",
    "restaurantId": "green",
    "name": "Salmon & Greens",
    "description": "Roasted salmon, brown rice, greens, citrus.",
    "category": "Bowls",
    "priceCents": 1950,
    "vegetarian": false,
    "available": true
  },
  {
    "id": "green-wrap",
    "restaurantId": "green",
    "name": "Falafel Wrap",
    "description": "Falafel, hummus, cucumber, pickles, pita.",
    "category": "Wraps",
    "priceCents": 1250,
    "vegetarian": true,
    "available": true
  },
  {
    "id": "green-juice",
    "restaurantId": "green",
    "name": "Green Juice",
    "description": "Apple, cucumber, spinach, ginger, 350 mL.",
    "category": "Drinks",
    "priceCents": 600,
    "vegetarian": true,
    "available": true
  },
  {
    "id": "bun-classic",
    "restaurantId": "bun",
    "name": "The Classic",
    "description": "Double beef smash patty, cheddar, pickles, club sauce.",
    "category": "Burgers",
    "priceCents": 1400,
    "vegetarian": false,
    "available": true
  },
  {
    "id": "bun-veggie",
    "restaurantId": "bun",
    "name": "Garden Burger",
    "description": "Black bean patty, lettuce, tomato, herb mayo.",
    "category": "Burgers",
    "priceCents": 1350,
    "vegetarian": true,
    "available": true
  },
  {
    "id": "bun-fries",
    "restaurantId": "bun",
    "name": "Golden Fries",
    "description": "Crisp fries with sea salt.",
    "category": "Sides",
    "priceCents": 500,
    "vegetarian": true,
    "available": true
  },
  {
    "id": "bun-shake",
    "restaurantId": "bun",
    "name": "Vanilla Shake",
    "description": "Vanilla ice cream and milk, 400 mL.",
    "category": "Drinks",
    "priceCents": 650,
    "vegetarian": true,
    "available": true
  },
  {
    "id": "taco-tacos",
    "restaurantId": "taco",
    "name": "Chicken Tacos",
    "description": "Three corn tortillas, grilled chicken, salsa verde.",
    "category": "Tacos",
    "priceCents": 1400,
    "vegetarian": false,
    "available": true
  },
  {
    "id": "taco-beans",
    "restaurantId": "taco",
    "name": "Black Bean Tacos",
    "description": "Three corn tortillas, black beans, avocado, lime.",
    "category": "Tacos",
    "priceCents": 1250,
    "vegetarian": true,
    "available": true
  },
  {
    "id": "cafe-sandwich",
    "restaurantId": "cafe",
    "name": "Caprese Sandwich",
    "description": "Tomato, mozzarella, basil, sourdough.",
    "category": "Lunch",
    "priceCents": 1150,
    "vegetarian": true,
    "available": true
  },
  {
    "id": "cafe-croissant",
    "restaurantId": "cafe",
    "name": "Butter Croissant",
    "description": "Flaky, golden, baked this morning.",
    "category": "Bakery",
    "priceCents": 450,
    "vegetarian": true,
    "available": true
  },
  {
    "id": "cafe-latte",
    "restaurantId": "cafe",
    "name": "Latte",
    "description": "Double espresso and steamed milk, 350 mL.",
    "category": "Drinks",
    "priceCents": 500,
    "vegetarian": true,
    "available": true
  },
  {
    "id": "cafe-cookie",
    "restaurantId": "cafe",
    "name": "Chocolate Chunk Cookie",
    "description": "A soft centre, crisp edges, plenty of chocolate.",
    "category": "Bakery",
    "priceCents": 350,
    "vegetarian": true,
    "available": true
  }
];
