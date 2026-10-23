document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("products-grid");
  const searchToggle = document.getElementById("search-toggle");
  const searchBox = document.getElementById("search-box");
  const searchInput = document.getElementById("search-input");
  const categoryButtons = document.querySelectorAll(".category-pill");

  let activeCategory = "todas";

  // Alternar barra de busca ao tocar na lupa
  if (searchToggle && searchBox) {
    searchToggle.addEventListener("click", () => {
      searchBox.classList.toggle("active");
      if (searchBox.classList.contains("active")) {
        searchInput.focus();
      }
    });
  }

  // Identificar loja e cor da etiqueta
  function getStoreTag(loja) {
    const l = (loja || "").toLowerCase();
    if (l.includes("shopee")) return { label: "Shopee", class: "tag-shopee" };
    if (l.includes("mercado livre")) return { label: "Mercado Livre", class: "tag-ml" };
    return { label: loja || "Oferta", class: "tag-default" };
  }

  // Renderizar os cartões
  function renderProducts(items) {
    if (!grid) return;
    grid.innerHTML = "";

    if (!items || items.length === 0) {
      grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 40px 0; color: #888;">Nenhum produto encontrado nesta categoria.</p>`;
      return;
    }

    items.forEach(prod => {
      const card = document.createElement("article");
      card.className = "product-card";

      const storeTag = getStoreTag(prod.loja);

      // Desconto automático se houver preço anterior
      let discountBadge = "";
      let oldPriceHtml = "";
      if (prod.precoAnterior && prod.precoAnterior > prod.precoAtual) {
        const pct = Math.round(((prod.precoAnterior - prod.precoAtual) / prod.precoAnterior) * 100);
        discountBadge = `<span class="discount-tag">-${pct}%</span>`;
        oldPriceHtml = `<span class="old-price">R$ ${prod.precoAnterior.toFixed(2).replace('.', ',')}</span>`;
      }

      card.innerHTML = `
        <div class="card-top">
          <span class="tag-store ${storeTag.class}">${storeTag.label}</span>
          <img src="${prod.imagemUrl}" alt="${prod.nome}" loading="lazy">
        </div>
        <div class="card-info">
          <h2 class="prod-title">${prod.nome}</h2>
          <div class="pricing-area">
            <div class="old-price-line">
              ${oldPriceHtml}
              ${discountBadge}
            </div>
            <div class="current-price">R$ ${Number(prod.precoAtual).toFixed(2).replace('.', ',')}</div>
          </div>
          <a href="${prod.afiliadoUrl}" target="_blank" rel="noopener noreferrer" class="btn-buy">
            <i class="fa-solid fa-cart-shopping"></i> VER OFERTA
          </a>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  // Filtragem dinâmica
  function filterCatalog() {
    if (!window.PRODUCTS_DATA) return;

    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    let list = PRODUCTS_DATA.filter(p => p.ativo);

    if (activeCategory !== "todas") {
      list = list.filter(p => p.categoria.toLowerCase() === activeCategory.toLowerCase());
    }

    if (query) {
      list = list.filter(p => p.nome.toLowerCase().includes(query) || (p.descricao && p.descricao.toLowerCase().includes(query)));
    }

    renderProducts(list);
  }

  // Ouvintes de Categoria
  categoryButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      categoryButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.cat;
      filterCatalog();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", filterCatalog);
  }

  filterCatalog();
});
