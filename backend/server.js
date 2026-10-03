const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const FRONTEND_PATH = path.join(__dirname, '../frontend');

// Middleware
app.use(cors());
app.use(express.json());

// Frontend static files serve 
app.use(express.static(FRONTEND_PATH));

// Products data
const products = [
  { id: 1, name: "Chicken Biryani", price: 180, category: "biryani", image: "🍗", desc: "Spicy Chicken Biryani" },
  { id: 2, name: "Mutton Biryani", price: 250, category: "biryani", image: "🍖", desc: "Tender Mutton Biryani" },
  { id: 3, name: "Veg Biryani", price: 150, category: "biryani", image: "🍚", desc: "Fresh Veg Biryani" },
  { id: 4, name: "Chapathi (2 pcs)", price: 40, category: "chapathi", image: "🫓", desc: "Soft Chapathi" },
  { id: 5, name: "Chapathi + Chicken Curry", price: 120, category: "chapathi", image: "🍛", desc: "Combo Pack" },
  { id: 6, name: "Parotta (2 pcs)", price: 60, category: "chapathi", image: "🥞", desc: "Kerala Parotta" },
  { id: 7, name: "Samosa (2 pcs)", price: 30, category: "snacks", image: "🥟", desc: "Crispy Samosa" },
  { id: 8, name: "Bajji (4 pcs)", price: 40, category: "snacks", image: "🧆", desc: "Hot Bajji" },
  { id: 9, name: "Vada (2 pcs)", price: 25, category: "snacks", image: "🍩", desc: "Medu Vada" },
  { id: 10, name: "Tea", price: 15, category: "snacks", image: "☕", desc: "Filter Coffee/Tea" }
];

// API Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:category', (req, res) => {
  const category = req.params.category;
  if (category === 'all') return res.json(products);
  const filtered = products.filter(p => p.category === category);
  res.json(filtered);
});

// Order place 
app.post('/api/order', (req, res) => {
  const { name, phone, address, items, total } = req.body;
  
  if (!name || !phone || !address || !items) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }

  const orderId = 'ORD' + Date.now();
  const order = { orderId, name, phone, address, items, total, date: new Date() };
  
  console.log("New Order:", order);
  res.json({ success: true, orderId, message: "Order placed successfully!" });
});

// Frontend serve 
app.get('/', (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📁 Frontend path: ${FRONTEND_PATH}`);
});