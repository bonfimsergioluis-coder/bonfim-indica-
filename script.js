document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("products-grid");
  const searchInput = document.getElementById("search-input");
  const chipsContainer = document.getElementById("categories-chips");

  let selectedCategory = "todas";

  // Montar pílulas dinamicamente
  function renderCategoryChips() {
    const activeProducts = PRODUCTS_DATA.filter(p => p.ativo);
    const categories = [...new Set(activeProducts.map(p => p.categoria))];

    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = "chip-btn";
      btn.dataset.category = cat;
      btn.textContent = cat;
      btn.addEventListener("click", () => {
        document.querySelectorAll(".chip-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedCategory = cat;
        applyFilters();
      });
      chipsContainer.appendChild(btn);
    });

    chipsContainer.querySelector('[data-category="todas"]').addEventListener("click", (e) => {
      document.querySelectorAll(".chip-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      selectedCategory = "todas";
      applyFilters();
    });
  }

  // Estilo do selo por loja
  function getBadgeClass(loja) {
    const lower = loja.toLowerCase();
    if (lower.includes("shopee")) return "badge-shopee";
    if (lower.includes("mercado livre")) return "badge-ml";
    return "badge-padrao";
  }

  // Renderizar cartões
  function renderProducts(items) {
    grid.innerHTML = "";

    if (items.length === 0) {
      grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 40px 0; color: #6c757d;">Nenhum achadinho encontrado.</p>`;
      return;
    }

    items.forEach(prod => {
      const card = document.createElement("article");
      card.className = "product-card";

      let priceHtml = "";
      if (prod.precoAtual) {
        priceHtml = `
          <div class="card-pricing">
            ${prod.precoAnterior ? `<span class="price-old">R$ ${prod.precoAnterior.toFixed(2).replace('.', ',')}</span>` : ""}
            <span class="price-val">R$ ${prod.precoAtual.toFixed(2).replace('.', ',')}</span>
          </div>
        `;
      }

      const badgeClass = getBadgeClass(prod.loja);

      card.innerHTML = `
        <div class="card-img-holder">
          <span class="badge-store ${badgeClass}">${prod.loja}</span>
          <img src="${prod.imagemUrl}" alt="${prod.nome}" loading="lazy">
        </div>
        <div class="card-content">
          <h2 class="card-title">${prod.nome}</h2>
          <p class="card-desc">${prod.descricao}</p>
          ${priceHtml}
          <a href="${prod.afiliadoUrl}" target="_blank" rel="noopener noreferrer" class="btn-card">Ver oferta</a>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  function applyFilters() {
    const term = searchInput.value.toLowerCase().trim();
    let filtered = PRODUCTS_DATA.filter(p => p.ativo);

    if (selectedCategory !== "todas") {
      filtered = filtered.filter(p => p.categoria === selectedCategory);
    }

    if (term) {
      filtered = filtered.filter(p => p.nome.toLowerCase().includes(term) || p.descricao.toLowerCase().includes(term));
    }

    renderProducts(filtered);
  }

  searchInput.addEventListener("input", applyFilters);

  renderCategoryChips();
  applyFilters();
});
