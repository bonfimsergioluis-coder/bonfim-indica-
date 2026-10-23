document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("products-grid");
  const searchInput = document.getElementById("search-input");
  const categorySelect = document.getElementById("category-select");
  const storeSelect = document.getElementById("store-select");
  const sortSelect = document.getElementById("sort-select");

  function populateCategories() {
    const activeProducts = PRODUCTS_DATA.filter(p => p.ativo);
    const categories = [...new Set(activeProducts.map(p => p.categoria))];
    
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    });
  }

  function renderProducts(items) {
    grid.innerHTML = "";

    if (items.length === 0) {
      grid.innerHTML = `<div class="empty-state"><p>Nenhum produto encontrado para estes filtros.</p></div>`;
      return;
    }

    items.forEach(prod => {
      const card = document.createElement("article");
      card.className = "product-card";

      let priceHtml = "";
      if (prod.precoAtual !== null && prod.precoAtual !== undefined) {
        priceHtml = `
          <div class="card-pricing">
            ${prod.precoAnterior ? `<span class="price-previous">R$ ${prod.precoAnterior.toFixed(2).replace('.', ',')}</span><br>` : ""}
            <span class="price-current">R$ ${prod.precoAtual.toFixed(2).replace('.', ',')}</span>
            ${prod.dataVerificacao ? `<span class="price-date">Verificado em: ${prod.dataVerificacao}</span>` : ""}
          </div>
        `;
      }

      card.innerHTML = `
        <div class="card-image-wrap">
          <span class="badge-store">${prod.loja}</span>
          <img src="${prod.imagemUrl}" alt="${prod.nome}" loading="lazy">
        </div>
        <div class="card-body">
          <span class="card-category">${prod.categoria}</span>
          <h3 class="card-title">${prod.nome}</h3>
          <p class="card-desc">${prod.descricao}</p>
          ${priceHtml}
          <a href="${prod.afiliadoUrl}" target="_blank" rel="noopener noreferrer" class="btn-offer">Ver oferta</a>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  function applyFilters() {
    const term = searchInput.value.toLowerCase().trim();
    const cat = categorySelect.value;
    const store = storeSelect.value;
    const sort = sortSelect.value;

    let filtered = PRODUCTS_DATA.filter(p => p.ativo);

    if (term) {
      filtered = filtered.filter(p => p.nome.toLowerCase().includes(term) || p.descricao.toLowerCase().includes(term));
    }

    if (cat !== "todas") {
      filtered = filtered.filter(p => p.categoria === cat);
    }

    if (store !== "todas") {
      filtered = filtered.filter(p => p.loja === store);
    }

    if (sort === "menor-preco") {
      filtered.sort((a, b) => (a.precoAtual || Infinity) - (b.precoAtual || Infinity));
    } else if (sort === "destaque") {
      filtered.sort((a, b) => (b.destaque === true ? 1 : 0) - (a.destaque === true ? 1 : 0));
    }

    renderProducts(filtered);
  }

  searchInput.addEventListener("input", applyFilters);
  categorySelect.addEventListener("change", applyFilters);
  storeSelect.addEventListener("change", applyFilters);
  sortSelect.addEventListener("change", applyFilters);

  populateCategories();
  applyFilters();
});
