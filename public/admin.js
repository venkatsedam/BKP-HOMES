const adminStatusUrl = "/admin/status";
const adminLoginUrl = "/admin/login";
const adminLogoutUrl = "/admin/logout";
const productsUrl = "/products";

const loginPanel = document.getElementById("login-panel");
const dashboardPanel = document.getElementById("dashboard-panel");
const loginError = document.getElementById("login-error");
const productList = document.getElementById("product-list");

async function checkAdmin() {
  const res = await fetch(adminStatusUrl, { credentials: "include" });
  const data = await res.json();
  if (data.isAdmin) {
    showDashboard();
  } else {
    showLogin();
  }
}

function showLogin() {
  loginPanel.style.display = "block";
  dashboardPanel.style.display = "none";
}

function showDashboard() {
  loginPanel.style.display = "none";
  dashboardPanel.style.display = "block";
  loadProducts();
}

async function login() {
  loginError.textContent = "";
  const username = document.getElementById("admin-username").value;
  const password = document.getElementById("admin-password").value;

  const res = await fetch(adminLoginUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password })
  });

  if (res.ok) {
    showDashboard();
  } else {
    const data = await res.json();
    loginError.textContent = data.error || "Login failed";
  }
}

async function logout() {
  await fetch(adminLogoutUrl, { method: "POST", credentials: "include" });
  showLogin();
}

async function addProduct() {
  const formData = new FormData();
  formData.append("name", document.getElementById("name").value);
  formData.append("price", document.getElementById("price").value);
  formData.append("category", document.getElementById("category").value);
  formData.append("material", document.getElementById("material").value);
  formData.append("size", document.getElementById("size").value);
  formData.append("description", document.getElementById("desc").value);

  const imageFile = document.getElementById("image_file").files[0];
  const imageUrl = document.getElementById("image").value;

  if (imageFile) {
    formData.append("image_file", imageFile);
  }

  if (imageUrl) {
    formData.append("image_url", imageUrl);
  }

  const res = await fetch(productsUrl, {
    method: "POST",
    credentials: "include",
    body: formData
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    alert(data.error || "You must be logged in to add products.");
    return;
  }

  clearForm();
  loadProducts();
}

async function loadProducts() {
  const res = await fetch(productsUrl);
  const data = await res.json();
  productList.innerHTML = "";

  if (!data.length) {
    productList.innerHTML = "<p>No products found.</p>";
    return;
  }

  data.forEach(product => {
    const item = document.createElement("div");
    item.className = "product-item";
    item.innerHTML = `
      <div>
        <strong>${product.name}</strong>
        <p class="small-text">${product.category} • ${product.size} • ${product.material}</p>
      </div>
      <div class="product-actions">
        <button class="secondary-btn" onclick="deleteProduct(${product.id})">Delete</button>
      </div>
    `;
    productList.appendChild(item);
  });
}

async function deleteProduct(id) {
  const confirmed = confirm("Delete this product?");
  if (!confirmed) return;

  const res = await fetch(`${productsUrl}/${id}`, {
    method: "DELETE",
    credentials: "include"
  });

  if (res.ok) {
    loadProducts();
  } else {
    alert("Unable to delete product.");
  }
}

function clearForm() {
  ["name", "price", "category", "material", "size", "image", "desc"].forEach(id => {
    document.getElementById(id).value = "";
  });
  document.getElementById("image_file").value = "";
}

document.getElementById("login-button").addEventListener("click", login);
document.getElementById("logout-button").addEventListener("click", logout);
document.getElementById("add-button").addEventListener("click", addProduct);

checkAdmin();
