// Load cart items from localStorage
const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
const cartList = document.getElementById("cart");
const totalDisplay = document.getElementById("total");
let total = 0;

// Display each item
cartItems.forEach(item => {
  const itemTotal = item.price * item.quantity;
  total += itemTotal;

  const li = document.createElement("li");
  li.textContent = `${item.name} x${item.quantity} = ₹${itemTotal.toFixed(2)}`;
  cartList.appendChild(li);
});

totalDisplay.textContent = `Total: ₹${total.toFixed(2)}`;

// Handle order placement
document.getElementById("placeOrder").addEventListener("click", () => {
  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();

  if (!name || !phone || !address) {
    alert("Please fill in all customer details.");
    return;
  }

  if (!/^\d{10}$/.test(phone)) {
    alert("Please enter a valid 10-digit phone number.");
    return;
  }

  const order = {
    time: new Date().toLocaleString(),
    customer: { name, phone, address },
    items: cartItems,
    total: total.toFixed(2)
  };

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.removeItem("cart");

  const success = document.createElement("div");
  success.className = "success-message";
  success.textContent = "🎉 Order placed successfully!";
  document.querySelector("main").prepend(success);

  setTimeout(() => {
    location.href = "index.html";
  }, 2000);
});
