const API = "/products";
const WHATSAPP_NUMBER = "919100289406";

async function loadProducts() {
  const search = document.getElementById("search").value;
  const category = document.getElementById("category").value;

  const res = await fetch(`${API}?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`);
  const data = await res.json();

  const container = document.getElementById("products");
  container.innerHTML = "";

  data.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <img src="${p.image_url}" alt="${p.name}" />
        <div class="card-body">
          <h3>${p.name}</h3>
          <span class="price">₹${p.price}</span>
          <p>${p.size} • ${p.material}</p>
          <div class="card-buttons">
            <button onclick="view(${p.id})">View</button>
            <button onclick="contact('${p.name}')">Enquire</button>
          </div>
        </div>
      </div>
    `;
  });
}

function view(id) {
  window.location.href = `product.html?id=${id}`;
}

function contact(name) {
  const msg = `Hello BKP Homes, I am interested in ${name}.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
}

document.getElementById("search").addEventListener("input", loadProducts);
document.getElementById("category").addEventListener("change", loadProducts);

loadProducts();
