// ── SHARED UTILITIES ───────────────────────────────

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

// ── LANDING PAGE LOGIC ─────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // CURSOR
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;
  
  if (cursor && ring) {
    document.addEventListener('mousemove', e => { 
      mx = e.clientX; 
      my = e.clientY; 
      cursor.style.left = mx + 'px'; 
      cursor.style.top = my + 'px'; 
    });
    
    (function animRing() { 
      rx += (mx - rx) * 0.13; 
      ry += (my - ry) * 0.13; 
      ring.style.left = rx + 'px'; 
      ring.style.top = ry + 'px'; 
      requestAnimationFrame(animRing); 
    })();
    
    document.querySelectorAll('a,button,.menu-card,.filter-btn,.back-home,.qty-btn,.remove-item').forEach(el => {
      el.addEventListener('mouseenter', () => { 
        cursor.style.width = '20px'; 
        cursor.style.height = '20px'; 
        ring.style.width = '56px'; 
        ring.style.height = '56px'; 
        ring.style.borderColor = 'rgba(245,196,0,0.7)'; 
      });
      el.addEventListener('mouseleave', () => { 
        cursor.style.width = '13px'; 
        cursor.style.height = '13px'; 
        ring.style.width = '38px'; 
        ring.style.height = '38px'; 
        ring.style.borderColor = 'rgba(90,171,255,0.6)'; 
      });
    });
  }

  // MARQUEE
  function buildMarquee(id, items, dot = '✦') {
    const el = document.getElementById(id);
    if (!el) return;
    const rep = [...items, ...items, ...items, ...items];
    el.innerHTML = rep.map(i => `<span class="marquee-item">${i} <span style="opacity:.45">${dot}</span> </span>`).join('');
  }
  buildMarquee('mq1', ['PREMIUM BURGERS', 'CRISPY CHICKEN', 'LOADED FRIES', 'BY RHS', 'MODEL TOWN LHR'], '✦');
  buildMarquee('mq2', ['TOT RESTAURANT', 'BOLD FLAVORS', 'UNIQUE TASTE', 'LAHORE EATS', 'RHS FOOD'], '●');

  // SCROLL REVEAL
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => { if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 70); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  // COUNTERS
  const cObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target; 
      const target = parseInt(el.dataset.count);
      const suffix = target === 1 ? 'M+' : target === 100 ? '%' : target === 5 ? '★' : '+';
      let cur = 0; 
      const inc = target / 55;
      const t = setInterval(() => { 
        cur += inc; 
        if (cur >= target) { cur = target; clearInterval(t); } 
        el.textContent = Math.floor(cur) + suffix; 
      }, 18);
      cObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(c => cObs.observe(c));

  // MENU FILTER (Preview Menu)
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('#menuGrid .menu-card').forEach(card => {
        card.classList.toggle('hidden', f !== 'all' && card.dataset.category !== f);
      });
    });
  });

  // CARD 3D TILT
  document.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateY(-10px)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });

  // ADD BUTTON (Preview Menu)
  document.querySelectorAll('#menuGrid .menu-card-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const o = this.textContent;
      this.textContent = '✓ Added!';
      this.style.background = 'var(--yellow)';
      this.style.color = 'var(--text)';
      setTimeout(() => {
        this.textContent = o;
        this.style.background = '';
        this.style.color = '';
      }, 1500);
    });
  });

  // PAGE SWITCHER
  const navMenuLinks = document.querySelectorAll('a[href="tot-menu/menu.html"], .menu-cta-btn');
  const backHomeBtn = document.querySelector('.back-home');
  const landingView = document.getElementById('landing-page');
  const menuView = document.getElementById('menu-page');

  const showMenu = (e) => {
    if (e) e.preventDefault();
    landingView.style.display = 'none';
    menuView.style.display = 'block';
    window.scrollTo(0, 0);
    initMenu(); // Initialize menu data if needed
  };

  const showLanding = (e) => {
    if (e) e.preventDefault();
    menuView.style.display = 'none';
    landingView.style.display = 'block';
    window.scrollTo(0, 0);
  };

  navMenuLinks.forEach(link => link.addEventListener('click', showMenu));
  if (backHomeBtn) backHomeBtn.addEventListener('click', showLanding);
});

// ── MENU PAGE LOGIC ─────────────────────────────

// Menu Data
const menuData = {
  appetizers: [
    { id: 'a1', name: 'Buffalo Wings', price: 690, icon: '🍗', desc: 'Crispy wings tossed in spicy buffalo sauce' },
    { id: 'a2', name: 'BBQ Wings', price: 690, icon: '🍖', desc: 'Smoky BBQ glazed chicken wings' },
    { id: 'a3', name: 'Thai Sweet Chilli Wings', price: 690, icon: '🌶️', desc: 'Sweet and spicy Thai chilli wings' },
    { id: 'a4', name: 'Tenders', price: 540, icon: '🍗', desc: 'Crispy chicken tenders' },
    { id: 'a5', name: 'Tender Platter', price: 1490, icon: '🍱', desc: 'Generous serving of tenders with sides' }
  ],
  burgers: [
    { id: 'b1', name: 'Real TOT', price: 800, doublePrice: 1150, icon: '🍔', desc: 'Double Australian beef patty, American cheese slice, OG sauce, sun-dried tomato, potato bun' },
    { id: 'b2', name: 'Jammy Jack', price: 800, doublePrice: 1030, icon: '🍔', desc: 'Double Australian beef patty, American cheese slice, gangsta sauce, smoky sweet bacon jam' },
    { id: 'b3', name: 'Shroomster', price: 800, doublePrice: 1030, icon: '🍔', desc: 'Double Australian beef patty, American cheese slice, gangsta sauce, sautéed mushrooms' },
    { id: 'b4', name: 'Mini TOT', price: 1590, icon: '🍔', desc: 'Flat mini burgers & parini pressed - 8 pcs (Beef/Chicken/Half n Half)' }
  ],
  sandos: [
    { id: 's1', name: 'Dijon Don', price: 990, icon: '🥪', desc: 'Fried crispy chicken, lettuce, fried onion, sautéed mushrooms, dijon sauce & brioche bread' },
    { id: 's2', name: 'JOJO', price: 990, icon: '🥪', desc: 'Fried crispy chicken, lettuce, jalapeño slices, chipotle sauce & brioche bread' },
    { id: 's3', name: 'Chitotley', price: 1190, icon: '🥪', desc: 'Fried crispy chicken, lettuce, smoky sweet onion marmalade, chipotle & signature sauce, brioche bread' },
    { id: 's4', name: 'Bacon Drip', price: 1190, icon: '🥪', desc: 'Fried crispy chicken, lettuce, signature sauce, streaky turkey bacon & brioche bread' }
  ],
  fries: [
    { id: 'f1', name: 'Fries (Plain/Masala)', price: 240, icon: '🍟', desc: 'Classic crispy fries with your choice of seasoning' },
    { id: 'f2', name: 'Loaded Fries', price: 890, icon: '🍟', desc: 'Fries topped with cheese, sauce & toppings' },
    { id: 'f3', name: 'Curly Fries', price: 390, icon: '🌀', desc: 'Twisted curly fries' },
    { id: 'f4', name: 'Waffle Fries', price: 390, icon: '🧇', desc: 'Crispy waffle-cut fries' },
    { id: 'f5', name: 'Potato Wedges', price: 390, icon: '🥔', desc: 'Seasoned potato wedges' },
    { id: 'f6', name: 'Long Bois Fries', price: 490, icon: '🍟', desc: 'Japanese-style long fries, hot seasoning' }
  ],
  meals: [
    { id: 'm1', name: 'Meal 01 - With Fries & Drink', price: 290, icon: '🍱', desc: 'Add fries and a drink to your order' },
    { id: 'm2', name: 'Meal 02 - With Fries & Signature Sip', price: 490, icon: '🍱', desc: 'Add fries and a signature drink' },
    { id: 'm3', name: 'Upgrade - Curly Fries', price: 100, icon: '🌀', desc: 'Upgrade to curly fries' },
    { id: 'm4', name: 'Upgrade - Potato Wedges', price: 100, icon: '🥔', desc: 'Upgrade to potato wedges' },
    { id: 'm5', name: 'Upgrade - Waffle Fries', price: 100, icon: '🧇', desc: 'Upgrade to waffle fries' }
  ],
  sips: [
    { id: 'si1', name: 'Blue Voltage', price: 350, icon: '💙', desc: 'Refreshing blue energy drink' },
    { id: 'si2', name: 'Sunset Passion', price: 350, icon: '🧡', desc: 'Tropical passion fruit blend' },
    { id: 'si3', name: 'Kiwi Drift', price: 350, icon: '💚', desc: 'Fresh kiwi cooler' },
    { id: 'si4', name: 'Apple Volt', price: 350, icon: '🍎', desc: 'Zesty apple energy drink' },
    { id: 'si5', name: 'Berry Spritz', price: 350, icon: '🫐', desc: 'Mixed berry sparkling drink' },
    { id: 'si6', name: 'Fanta', price: 150, icon: '🥤', desc: 'Classic orange soda' },
    { id: 'si7', name: 'Sprite', price: 150, icon: '🥤', desc: 'Lemon-lime soda' },
    { id: 'si8', name: 'Coke', price: 150, icon: '🥤', desc: 'Classic cola' },
    { id: 'si9', name: 'Diet Coke', price: 150, icon: '🥤', desc: 'Zero sugar cola' },
    { id: 'si10', name: 'Diet Sprite', price: 150, icon: '🥤', desc: 'Zero sugar lemon-lime' },
    { id: 'si11', name: 'Water', price: 50, icon: '💧', desc: 'Fresh mineral water' }
  ],
  shakes: [
    { id: 'sh1', name: 'Lotus Shake', price: 790, icon: '🥤', desc: 'Creamy lotus biscuit shake' },
    { id: 'sh2', name: 'Oreo Shake', price: 790, icon: '🥤', desc: 'Classic Oreo cookie shake' },
    { id: 'sh3', name: 'S.Berry Cheesecake Shake', price: 790, icon: '🥤', desc: 'Strawberry cheesecake milkshake' },
    { id: 'sh4', name: 'Nutella Brownie Shake', price: 790, icon: '🥤', desc: 'Rich Nutella brownie shake' },
    { id: 'sh5', name: 'Peanut Butter Shake', price: 790, icon: '🥤', desc: 'Creamy peanut butter shake' },
    { id: 'sh6', name: 'Hazelnut Frappe', price: 790, icon: '🥤', desc: 'Iced hazelnut coffee frappe' }
  ],
  dessert: [
    { id: 'd1', name: 'Lotus Bar - Small', price: 1050, icon: '🍰', desc: 'Lotus biscuit dessert bar' },
    { id: 'd2', name: 'Lotus Bar - Large', price: 1990, icon: '🍰', desc: 'Large Lotus biscuit dessert bar' },
    { id: 'd3', name: 'Fudge Bar - Small', price: 990, icon: '🍫', desc: 'Chocolate fudge dessert bar' },
    { id: 'd4', name: 'Fudge Bar - Large', price: 1830, icon: '🍫', desc: 'Large chocolate fudge dessert bar' }
  ],
  addons: [
    { id: 'ad1', name: 'Jalapeño', price: 50, icon: '🌶️', desc: 'Add spicy jalapeños' },
    { id: 'ad2', name: 'Mushroom', price: 50, icon: '🍄', desc: 'Add sautéed mushrooms' },
    { id: 'ad3', name: 'Cheese Slice', price: 50, icon: '🧀', desc: 'Extra cheese slice' },
    { id: 'ad4', name: 'Pickle', price: 50, icon: '🥒', desc: 'Add pickles' },
    { id: 'ad5', name: 'Lettuce', price: 50, icon: '🥬', desc: 'Extra lettuce' },
    { id: 'ad6', name: 'Chicken Fillet', price: 290, icon: '🍗', desc: 'Add chicken fillet' },
    { id: 'ad7', name: 'Patty & Cheese', price: 290, icon: '🍔', desc: 'Extra patty with cheese' },
    { id: 'ad8', name: 'Bacon Jam', price: 290, icon: '🥓', desc: 'Sweet bacon jam' },
    { id: 'ad9', name: 'Onion Marmalade', price: 290, icon: '🧅', desc: 'Sweet onion marmalade' },
    { id: 'ad10', name: 'Turkey Bacon', price: 290, icon: '🥓', desc: 'Streaky turkey bacon' }
  ],
  dips: [
    { id: 'dp1', name: 'Dijon Sauce', price: 99, icon: '🥣', desc: 'Creamy dijon mustard sauce' },
    { id: 'dp2', name: 'Creamy Aioli', price: 99, icon: '🥣', desc: 'Garlic aioli dip' },
    { id: 'dp3', name: 'Jalapeño Sauce', price: 99, icon: '🥣', desc: 'Spicy jalapeño dip' },
    { id: 'dp4', name: 'Gangsta Sauce', price: 99, icon: '🥣', desc: 'Signature gangsta sauce' },
    { id: 'dp5', name: 'Chipotle Sauce', price: 99, icon: '🥣', desc: 'Smoky chipotle dip' }
  ]
};

// Cart State
let cart = [];

// Initialize Menu
function initMenu() {
  const containerCheck = document.getElementById('appetizers');
  if (!containerCheck) return;
  
  renderSection('appetizers', menuData.appetizers);
  renderSection('burgers', menuData.burgers);
  renderSection('sandos', menuData.sandos);
  renderSection('fries', menuData.fries);
  renderSection('meals', menuData.meals);
  renderSection('sips', menuData.sips);
  renderSection('shakes', menuData.shakes);
  renderSection('dessert', menuData.dessert);
  renderSection('addons', menuData.addons);
  renderSection('dips', menuData.dips);
}

// Render Menu Section
function renderSection(sectionId, items) {
  const container = document.getElementById(sectionId);
  if (!container) return;
  container.innerHTML = items.map(item => `
    <div class="menu-page-card">
      <div class="card-image">
        <span class="food-icon">${item.icon}</span>
      </div>
      <div class="card-content">
        <span class="category-label">${sectionId.toUpperCase()}</span>
        <h3 class="item-name">${item.name}</h3>
        <p class="item-description">${item.desc}</p>
        <div class="item-footer">
          <span class="item-price">Rs. ${item.price}/-</span>
          <button class="add-btn" onclick="addToCart('${item.id}', '${item.name}', ${item.price}, '${item.icon}')">
            <span>+</span> ADD
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Add to Cart
function addToCart(id, name, price, icon) {
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id, name, price, icon, quantity: 1 });
  }

  updateCart();
  showToast('✅ Added to cart!');
}

// Update Cart UI
function updateCart() {
  const cartCount = document.getElementById('cartCount');
  const cartItems = document.getElementById('cartItems');
  const totalAmount = document.getElementById('totalAmount');

  if (!cartCount || !cartItems || !totalAmount) return;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  cartCount.textContent = totalItems;
  totalAmount.textContent = `Rs. ${totalPrice}/-`;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <p class="empty-cart-text">Your cart is empty!<br>Add some delicious items!</p>
      </div>
    `;
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-icon">${item.icon}</div>
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">Rs. ${item.price}/-</div>
        </div>
        <div class="quantity-control">
          <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
        </div>
        <button class="remove-item" onclick="removeItem('${item.id}')">🗑️</button>
      </div>
    `).join('');
  }
}

// Update Quantity
function updateQuantity(id, change) {
  const item = cart.find(item => item.id === id);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeItem(id);
    } else {
      updateCart();
    }
  }
}

// Remove Item
function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
  showToast('❌ Item removed');
}

// Toggle Cart Sidebar
function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('overlay');
  if (sidebar && overlay) {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  }
}

// Order via WhatsApp
function orderViaWhatsApp() {
  if (cart.length === 0) {
    showToast('⚠️ Your cart is empty!');
    return;
  }

  const phoneNumber = '923338010986'; // WhatsApp number in international format

  let message = '🍔 *TOT ORDER* 🍔\n\n';
  message += 'Hello! I would like to order:\n\n';

  cart.forEach(item => {
    message += `• ${item.name} x${item.quantity} - Rs. ${item.price * item.quantity}/-\n`;
  });

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  message += `\n*Total: Rs. ${total}/-*`;
  message += '\n\nPlease confirm my order. Thank you! 🙏';

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  window.open(whatsappUrl, '_blank');
}
