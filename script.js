const categoryGrid = document.getElementById("categoryGrid");
const productGrid = document.getElementById("productGrid");

// Group products by category
const grouped = {};
products.forEach(p => {
  if (!grouped[p.category]) grouped[p.category] = [];
  grouped[p.category].push(p);
});

// Render category cards
function renderCategories() {
  categoryGrid.innerHTML = '<h2>Select a Category</h2>';
  const grid = document.createElement("div");
  grid.className = "products";

  Object.keys(grouped).sort().forEach(category => {
    const card = document.createElement("div");
    card.className = "product";
    card.innerHTML = `
      <h3>${category}</h3>
      <button onclick="showProducts('${category}')">View Products</button>
    `;
    grid.appendChild(card);
  });

  categoryGrid.appendChild(grid);
}

// Show products in selected category
function showProducts(category) {
  categoryGrid.style.display = "none";
  productGrid.style.display = "block";
  productGrid.innerHTML = `
    <h2>${category}</h2>
    <button class="back-button" onclick="goBack()">← Back to Categories</button>
  `;

  const grid = document.createElement("div");
  grid.className = "products";

  grouped[category].forEach(product => {
    const discountedPrice = product.price - product.price * product.discount;
    const safeId = product.name.replace(/\W+/g, "-");

    const card = document.createElement("div");
    card.className = "product";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p><strong>₹${discountedPrice.toFixed(2)}</strong> <small>(₹${product.price})</small></p>
      <input type="number" min="1" value="1" id="qty-${safeId}" style="width:60px;" />
      <button onclick="addToCart('${product.name}', ${discountedPrice.toFixed(2)}, '${safeId}')">Add to Cart</button>
    `;
    grid.appendChild(card);
  });

  productGrid.appendChild(grid);
}

// Go back to category view
function goBack() {
  productGrid.style.display = "none";
  categoryGrid.style.display = "block";
}

// Add item to cart
function addToCart(productName, price, safeId) {
  const qtyInput = document.getElementById(`qty-${safeId}`);
  const quantity = parseInt(qtyInput.value);

  if (isNaN(quantity) || quantity < 1) {
    alert("Please enter a valid quantity.");
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.name === productName);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ name: productName, price, quantity });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert(`${productName} x${quantity} added to cart!`);
}

// Optional: update cart count badge
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.querySelector(".cart-count");
  if (badge) badge.textContent = count;
}

// Initialize
renderCategories();
updateCartCount();
