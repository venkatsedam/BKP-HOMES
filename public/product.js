const WHATSAPP_NUMBER = "91xxxxxxxxx"; // Replace with actual number

const id = new URLSearchParams(window.location.search).get("id");

fetch(`/products/${id}`)
  .then(res => res.json())
  .then(p => {
    document.getElementById("detail").innerHTML = `
      <h1>${p.name}</h1>
      <img src="${p.image_url}" alt="${p.name}" />
      <p><strong>Price:</strong> ₹${p.price}</p>
      <p><strong>Size:</strong> ${p.size}</p>
      <p><strong>Material:</strong> ${p.material}</p>
      <p>${p.description}</p>
      <button onclick="contact('${p.name}')">Enquire</button>
    `;
  });

function contact(name) {
  const msg = `Hello BKP Homes, I am interested in ${name}.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
}
