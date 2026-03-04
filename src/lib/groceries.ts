export interface GroceryItem {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string; // 'each', 'lb', 'oz', 'dozen', etc.
  category: string;
  imageUrl: string;
  inStock: boolean;
  nutritionInfo?: {
    calories?: number;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
  tags: string[]; // 'organic', 'gluten-free', 'local', etc.
}

export interface GroceryCategory {
  id: string;
  name: string;
  icon: string; // emoji or icon class
  description: string;
}

export interface CartItem extends GroceryItem {
  quantity: number;
  totalPrice: number;
}

export interface GroceryOrder {
  id: string;
  guestId: string;
  propertyId: string;
  bookingId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shopping' | 'delivered' | 'cancelled';
  createdAt: string;
  estimatedDelivery?: string;
  notes?: string;
  guestInfo: {
    name: string;
    phone?: string;
    email?: string;
  };
  // Stocker-related fields
  stockerId?: string;
  stockingPhotos?: string[];
  completedAt?: string;
  // Property info for stocker convenience
  propertyName?: string;
  propertyAddress?: string;
  guestName?: string;
  checkInDate?: string;
  numberOfGuests?: number;
}

export const GROCERY_CATEGORIES: GroceryCategory[] = [
  {
    id: 'produce',
    name: 'Fresh Produce',
    icon: '🥬',
    description: 'Fresh fruits and vegetables'
  },
  {
    id: 'dairy',
    name: 'Dairy & Eggs',
    icon: '🥛',
    description: 'Milk, cheese, yogurt, and eggs'
  },
  {
    id: 'meat',
    name: 'Meat & Seafood',
    icon: '🥩',
    description: 'Fresh meat, poultry, and seafood'
  },
  {
    id: 'pantry',
    name: 'Pantry Staples',
    icon: '🥫',
    description: 'Canned goods, grains, and dry goods'
  },
  {
    id: 'frozen',
    name: 'Frozen Foods',
    icon: '🧊',
    description: 'Frozen meals, vegetables, and desserts'
  },
  {
    id: 'bakery',
    name: 'Bakery',
    icon: '🍞',
    description: 'Fresh bread, pastries, and baked goods'
  },
  {
    id: 'snacks',
    name: 'Snacks & Candy',
    icon: '🍿',
    description: 'Chips, crackers, nuts, and sweets'
  },
  {
    id: 'beverages',
    name: 'Beverages',
    icon: '🥤',
    description: 'Drinks, juices, and refreshments'
  },
  {
    id: 'household',
    name: 'Household',
    icon: '🧽',
    description: 'Cleaning supplies and paper goods'
  },
  {
    id: 'personal',
    name: 'Personal Care',
    icon: '🧴',
    description: 'Health and beauty products'
  }
];

export const DEMO_GROCERY_ITEMS: GroceryItem[] = [
  // Produce
  {
    id: 'banana-bunch',
    name: 'Bananas',
    description: 'Fresh yellow bananas, perfect for breakfast',
    price: 1.99,
    unit: 'bunch',
    category: 'produce',
    imageUrl: '/api/placeholder/200/200?text=Bananas',
    inStock: true,
    nutritionInfo: { calories: 105, carbs: '27g', protein: '1g', fat: '0g' },
    tags: ['fresh', 'potassium']
  },
  {
    id: 'apples-gala',
    name: 'Gala Apples',
    description: 'Sweet and crisp Gala apples',
    price: 2.49,
    unit: 'lb',
    category: 'produce',
    imageUrl: '/api/placeholder/200/200?text=Apples',
    inStock: true,
    nutritionInfo: { calories: 80, carbs: '22g', protein: '0g', fat: '0g' },
    tags: ['fresh', 'sweet']
  },
  {
    id: 'spinach-organic',
    name: 'Organic Baby Spinach',
    description: 'Fresh organic baby spinach leaves',
    price: 3.99,
    unit: '5oz bag',
    category: 'produce',
    imageUrl: '/api/placeholder/200/200?text=Spinach',
    inStock: true,
    nutritionInfo: { calories: 7, carbs: '1g', protein: '1g', fat: '0g' },
    tags: ['organic', 'leafy-green']
  },
  {
    id: 'avocados',
    name: 'Avocados',
    description: 'Ripe Hass avocados, perfect for guacamole',
    price: 1.50,
    unit: 'each',
    category: 'produce',
    imageUrl: '/api/placeholder/200/200?text=Avocado',
    inStock: true,
    nutritionInfo: { calories: 320, carbs: '17g', protein: '4g', fat: '29g' },
    tags: ['healthy-fat', 'fresh']
  },
  {
    id: 'tomatoes-roma',
    name: 'Roma Tomatoes',
    description: 'Fresh Roma tomatoes, great for cooking',
    price: 2.99,
    unit: 'lb',
    category: 'produce',
    imageUrl: '/api/placeholder/200/200?text=Tomatoes',
    inStock: true,
    tags: ['fresh', 'cooking']
  },

  // Dairy & Eggs
  {
    id: 'milk-whole',
    name: 'Whole Milk',
    description: 'Fresh whole milk, gallon size',
    price: 3.49,
    unit: 'gallon',
    category: 'dairy',
    imageUrl: '/api/placeholder/200/200?text=Milk',
    inStock: true,
    nutritionInfo: { calories: 150, carbs: '12g', protein: '8g', fat: '8g' },
    tags: ['dairy', 'calcium']
  },
  {
    id: 'eggs-dozen',
    name: 'Large Eggs',
    description: 'Grade A large eggs, dozen',
    price: 2.99,
    unit: 'dozen',
    category: 'dairy',
    imageUrl: '/api/placeholder/200/200?text=Eggs',
    inStock: true,
    nutritionInfo: { calories: 70, carbs: '0g', protein: '6g', fat: '5g' },
    tags: ['protein', 'breakfast']
  },
  {
    id: 'cheese-cheddar',
    name: 'Sharp Cheddar Cheese',
    description: 'Sharp cheddar cheese block',
    price: 4.99,
    unit: '8oz block',
    category: 'dairy',
    imageUrl: '/api/placeholder/200/200?text=Cheese',
    inStock: true,
    nutritionInfo: { calories: 110, carbs: '1g', protein: '7g', fat: '9g' },
    tags: ['cheese', 'sharp']
  },
  {
    id: 'yogurt-greek',
    name: 'Greek Yogurt',
    description: 'Plain Greek yogurt, high protein',
    price: 5.99,
    unit: '32oz container',
    category: 'dairy',
    imageUrl: '/api/placeholder/200/200?text=Greek+Yogurt',
    inStock: true,
    nutritionInfo: { calories: 100, carbs: '6g', protein: '17g', fat: '0g' },
    tags: ['protein', 'healthy', 'greek']
  },
  {
    id: 'butter-unsalted',
    name: 'Unsalted Butter',
    description: 'Premium unsalted butter sticks',
    price: 4.49,
    unit: '1lb package',
    category: 'dairy',
    imageUrl: '/api/placeholder/200/200?text=Butter',
    inStock: true,
    tags: ['baking', 'cooking']
  },

  // Meat & Seafood
  {
    id: 'chicken-breast',
    name: 'Boneless Chicken Breast',
    description: 'Fresh boneless, skinless chicken breast',
    price: 8.99,
    unit: 'lb',
    category: 'meat',
    imageUrl: '/api/placeholder/200/200?text=Chicken+Breast',
    inStock: true,
    nutritionInfo: { calories: 165, carbs: '0g', protein: '31g', fat: '3.6g' },
    tags: ['protein', 'lean', 'fresh']
  },
  {
    id: 'ground-beef',
    name: 'Ground Beef 80/20',
    description: 'Fresh ground beef, 80% lean',
    price: 6.99,
    unit: 'lb',
    category: 'meat',
    imageUrl: '/api/placeholder/200/200?text=Ground+Beef',
    inStock: true,
    nutritionInfo: { calories: 254, carbs: '0g', protein: '26g', fat: '17g' },
    tags: ['protein', 'beef', 'fresh']
  },
  {
    id: 'salmon-fillet',
    name: 'Atlantic Salmon Fillet',
    description: 'Fresh Atlantic salmon fillet',
    price: 12.99,
    unit: 'lb',
    category: 'meat',
    imageUrl: '/api/placeholder/200/200?text=Salmon',
    inStock: true,
    nutritionInfo: { calories: 206, carbs: '0g', protein: '22g', fat: '12g' },
    tags: ['seafood', 'omega-3', 'fresh']
  },

  // Pantry Staples
  {
    id: 'rice-jasmine',
    name: 'Jasmine Rice',
    description: 'Premium jasmine rice, 2lb bag',
    price: 3.99,
    unit: '2lb bag',
    category: 'pantry',
    imageUrl: '/api/placeholder/200/200?text=Rice',
    inStock: true,
    nutritionInfo: { calories: 205, carbs: '45g', protein: '4g', fat: '0g' },
    tags: ['grain', 'staple']
  },
  {
    id: 'pasta-penne',
    name: 'Penne Pasta',
    description: 'Italian penne pasta, 1lb box',
    price: 1.99,
    unit: '1lb box',
    category: 'pantry',
    imageUrl: '/api/placeholder/200/200?text=Pasta',
    inStock: true,
    nutritionInfo: { calories: 220, carbs: '43g', protein: '8g', fat: '1g' },
    tags: ['pasta', 'italian']
  },
  {
    id: 'olive-oil',
    name: 'Extra Virgin Olive Oil',
    description: 'Premium extra virgin olive oil',
    price: 7.99,
    unit: '16.9oz bottle',
    category: 'pantry',
    imageUrl: '/api/placeholder/200/200?text=Olive+Oil',
    inStock: true,
    tags: ['cooking', 'healthy', 'mediterranean']
  },

  // Frozen Foods
  {
    id: 'pizza-margherita',
    name: 'Margherita Pizza',
    description: 'Frozen margherita pizza with fresh mozzarella',
    price: 6.99,
    unit: 'each',
    category: 'frozen',
    imageUrl: '/api/placeholder/200/200?text=Pizza',
    inStock: true,
    tags: ['frozen', 'quick-meal']
  },
  {
    id: 'ice-cream-vanilla',
    name: 'Vanilla Ice Cream',
    description: 'Premium vanilla ice cream, half gallon',
    price: 4.99,
    unit: 'half gallon',
    category: 'frozen',
    imageUrl: '/api/placeholder/200/200?text=Ice+Cream',
    inStock: true,
    tags: ['dessert', 'frozen']
  },

  // Bakery
  {
    id: 'bread-sourdough',
    name: 'Sourdough Bread',
    description: 'Fresh baked sourdough bread loaf',
    price: 3.99,
    unit: 'loaf',
    category: 'bakery',
    imageUrl: '/api/placeholder/200/200?text=Sourdough',
    inStock: true,
    tags: ['fresh-baked', 'artisan']
  },

  // Snacks & Candy
  {
    id: 'chips-kettle',
    name: 'Kettle Cooked Chips',
    description: 'Sea salt kettle cooked potato chips',
    price: 3.49,
    unit: '8oz bag',
    category: 'snacks',
    imageUrl: '/api/placeholder/200/200?text=Chips',
    inStock: true,
    tags: ['salty', 'crunchy']
  },
  {
    id: 'almonds-raw',
    name: 'Raw Almonds',
    description: 'Raw unsalted almonds',
    price: 8.99,
    unit: '1lb bag',
    category: 'snacks',
    imageUrl: '/api/placeholder/200/200?text=Almonds',
    inStock: true,
    nutritionInfo: { calories: 164, carbs: '6g', protein: '6g', fat: '14g' },
    tags: ['nuts', 'healthy', 'protein']
  },

  // Beverages
  {
    id: 'orange-juice',
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice',
    price: 4.99,
    unit: '64oz carton',
    category: 'beverages',
    imageUrl: '/api/placeholder/200/200?text=Orange+Juice',
    inStock: true,
    nutritionInfo: { calories: 110, carbs: '26g', protein: '2g', fat: '0g' },
    tags: ['fresh', 'vitamin-c']
  },
  {
    id: 'water-spring',
    name: 'Spring Water',
    description: 'Natural spring water, 24-pack',
    price: 3.99,
    unit: '24-pack',
    category: 'beverages',
    imageUrl: '/api/placeholder/200/200?text=Water',
    inStock: true,
    tags: ['hydration', 'natural']
  },

  // Household
  {
    id: 'paper-towels',
    name: 'Paper Towels',
    description: 'Absorbent paper towels, 6-pack',
    price: 12.99,
    unit: '6-pack',
    category: 'household',
    imageUrl: '/api/placeholder/200/200?text=Paper+Towels',
    inStock: true,
    tags: ['cleaning', 'absorbent']
  },
  {
    id: 'dish-soap',
    name: 'Dish Soap',
    description: 'Ultra concentrated dish soap',
    price: 2.99,
    unit: '25oz bottle',
    category: 'household',
    imageUrl: '/api/placeholder/200/200?text=Dish+Soap',
    inStock: true,
    tags: ['cleaning', 'concentrated']
  },

  // Personal Care
  {
    id: 'toothpaste',
    name: 'Whitening Toothpaste',
    description: 'Fluoride whitening toothpaste',
    price: 3.99,
    unit: '6oz tube',
    category: 'personal',
    imageUrl: '/api/placeholder/200/200?text=Toothpaste',
    inStock: true,
    tags: ['dental', 'whitening']
  },
  {
    id: 'shampoo',
    name: 'Moisturizing Shampoo',
    description: 'Gentle moisturizing shampoo for all hair types',
    price: 6.99,
    unit: '12oz bottle',
    category: 'personal',
    imageUrl: '/api/placeholder/200/200?text=Shampoo',
    inStock: true,
    tags: ['hair-care', 'moisturizing']
  }
];

// Utility functions
export const getItemsByCategory = (category: string): GroceryItem[] => {
  return DEMO_GROCERY_ITEMS.filter(item => item.category === category);
};

export const searchItems = (query: string): GroceryItem[] => {
  const lowercaseQuery = query.toLowerCase();
  return DEMO_GROCERY_ITEMS.filter(item =>
    item.name.toLowerCase().includes(lowercaseQuery) ||
    item.description.toLowerCase().includes(lowercaseQuery) ||
    item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const calculateCartTotal = (items: CartItem[]): { subtotal: number; tax: number; total: number; deliveryFee: number } => {
  const subtotal = items.reduce((total, item) => total + item.totalPrice, 0);
  const deliveryFee = 4.99; // Fixed delivery fee
  const taxRate = 0.08; // 8% tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax + deliveryFee;
  
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    deliveryFee,
    total: Math.round(total * 100) / 100
  };
};