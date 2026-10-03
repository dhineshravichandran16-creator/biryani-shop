const API = 'http://localhost:5000/api';
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Products Load
async function loadProducts(category = 'all', btn = null) {
  const res = await fetch(`${API}/products/${category}`);
  const products = await res.json();
  const container = document.getElementById('products');
  container.innerHTML = '';

  products.forEach(p => {
    container.innerHTML += `
      <div class="product-card">
        <div class="emoji">${p.image}</div>
        <h3>${p.name}</h3>
        <p class="desc">${p.desc}</p>
        <p class="price">₹${p.price}</p>
        <button onclick="addToCart(${p.id}, '${p.name}', ${p.price}, '${p.image}')">Add to Cart</button>
      </div>
    `;
  });

  if (btn) {
    document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
}

// Cart Operations
function addToCart(id, name, price, image) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, name, price, image, qty: 1 });
  }
  saveCart();
  updateCartUI();
  toggleCart(true);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else {
    saveCart();
    updateCartUI();
  }
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {
  const cartItems = document.getElementById('cartItems');
  const cartCount = document.getElementById('cart-count');
  const cartTotal = document.getElementById('cartTotal');

  let total = 0;
  let count = 0;
  cartItems.innerHTML = '';

  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="text-align:center;color:#999;padding:30px 0;">Cart is empty</p>';
  } else {
    cart.forEach(item => {
      total += item.price * item.qty;
      count += item.qty;
      cartItems.innerHTML += `
        <div class="cart-item">
          <div class="cart-item-info">
            <h4>${item.image} ${item.name}</h4>
            <p>₹${item.price} × ${item.qty} = ₹${item.price * item.qty}</p>
          </div>
          <div class="qty-controls">
            <button onclick="changeQty(${item.id}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </div>
      `;
    });
  }

  cartCount.innerText = count;
  cartTotal.innerText = total;
}

function toggleCart(open) {
  const sidebar = document.getElementById('cartSidebar');
  if (open === true) sidebar.classList.add('open');
  else sidebar.classList.toggle('open');
}

function openCheckout() {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }
  document.getElementById('checkoutModal').classList.add('active');
}

function closeCheckout() {
  document.getElementById('checkoutModal').classList.remove('active');
}

async function placeOrder() {
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const address = document.getElementById('custAddress').value.trim();

  if (!name || !phone || !address) {
    alert("Please fill all fields!");
    return;
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const res = await fetch(`${API}/order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone, address, items: cart, total })
  });

  const data = await res.json();
  if (data.success) {
    alert(`✅ Order Placed!\nOrder ID: ${data.orderId}\nTotal: ₹${total}`);
    cart = [];
    saveCart();
    updateCartUI();
    closeCheckout();
    toggleCart(false);
  } else {
    alert("Order failed. Try again.");
  }
}

// Init
loadProducts();
updateCartUI();