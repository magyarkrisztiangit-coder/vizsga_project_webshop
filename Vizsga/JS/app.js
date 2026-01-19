let initialLastAddedId = null;

const state = {
  products: [],
  filtered: [],
  cart: loadCart(),
  lastAddedId: initialLastAddedId,
  filters: {
    search: "",
    make: "",
    brand: "",
    category: ""
  },
  makeModels: new Map(), // make -> Set(models)
  categories: new Set(),
  currentPage: 1,
  itemsPerPage: 9
};

document.addEventListener("DOMContentLoaded", async () => {
  await loadData();
  buildFilters();
  applyFilters();
  mountEvents();
  updateCartCount();
});

async function loadData() {
  // DATA/data.json betöltése
  const res = await fetch("DATA/data.json");
  const data = await res.json();
  state.products = Array.isArray(data) ? data : [];
  // collect make-models and categories
  for (const p of state.products) {
    if (p.category) state.categories.add(p.category);
    if (Array.isArray(p.compatible)) {
      for (const c of p.compatible) {
        const make = c.make || "";
        const model = c.model || "";
        if (!state.makeModels.has(make)) state.makeModels.set(make, new Set());
        if (model) state.makeModels.get(make).add(model);
      }
    }
  }
}

function buildFilters() {
  const brandSelect = document.getElementById("brandFilter");
  const makeSelect = document.getElementById("makeFilter");
  const categorySelect = document.getElementById("categoryFilter");

  // Canonical brand list requested by the user
  const CANONICAL_BRANDS = [
    'Bosch','Febi Bilstein','Mann Filter','NGK','Castrol','Mobil 1','ATE','TRW','Delphi','Valeo'
  ];

  // Brands (use canonical list if brand select exists)
  if (brandSelect) {
    CANONICAL_BRANDS.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b;
      opt.textContent = b;
      brandSelect.appendChild(opt);
    });
    brandSelect.addEventListener('change', () => {
      state.filters.brand = brandSelect.value;
      applyFilters();
    });
  }

  // Makes (only populate if the legacy makeFilter is present)
  if (makeSelect) {
    [...state.makeModels.keys()].sort().forEach(make => {
      const opt = document.createElement("option");
      opt.value = make;
      opt.textContent = make;
      makeSelect.appendChild(opt);
    });
  }

  // Categories
  // Categories: use canonical list requested by the user (replace derived list)
  const CANONICAL_CATEGORIES = [
    'Fékrendszer',
    'Futómű',
    'Motor',
    'Olajok és szűrők',
    'Elektromos rendszer',
    'Hűtés',
    'Kipufogó',
    'Világítás',
    'Karosszéria'
  ];
  CANONICAL_CATEGORIES.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });

  // Make change (legacy element) — models removed per request
  if (makeSelect) {
    makeSelect.addEventListener("change", () => {
      state.filters.make = makeSelect.value;
      applyFilters();
    });
  }

  categorySelect.addEventListener("change", () => {
    state.filters.category = categorySelect.value;
    applyFilters();
  });
}

// (Model select removed) Previously fillModels populated model options — removed per user request.

function mountEvents() {
  const searchInput = document.getElementById("searchInput");
  const resetBtn = document.getElementById("resetFilters");
  const cartBtn = document.getElementById("cartButton");
  const closeCart = document.getElementById("closeCart");
  const clearCartBtn = document.getElementById("clearCartBtn");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const accountBtn = document.getElementById("accountButton");

  accountBtn.addEventListener("click", () => {
    window.location.href = "login.html";
  });

  searchInput.addEventListener("input", debounce(e => {
    state.filters.search = e.target.value.trim().toLowerCase();
    applyFilters();
  }, 200));

  resetBtn.addEventListener("click", () => {
    state.filters = { search: "", make: "", brand: "", category: "" };
    document.getElementById("searchInput").value = "";
    const brandEl = document.getElementById("brandFilter");
    if (brandEl) brandEl.value = "";
    const makeEl = document.getElementById("makeFilter");
    if (makeEl) makeEl.value = "";
    const categoryEl = document.getElementById("categoryFilter");
    if (categoryEl) categoryEl.value = "";
    applyFilters();
  });

  cartBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleCart();
  });
  closeCart.addEventListener("click", closeCartModal);
  document.querySelector(".modal-backdrop").addEventListener("click", closeCartModal);

  clearCartBtn.addEventListener("click", () => {
    state.cart = [];
    state.lastAddedId = null;
    localStorage.removeItem("cartLastAdded");
    saveCart();
    renderCart();
    updateCartCount();
  });

  checkoutBtn.addEventListener("click", () => {
    // Navigáljunk a pénztár oldalra — a checkout.html a kosár adatokat a localStorage-ból olvassa
    window.location.href = 'checkout.html';
  });

  // Kosár bezárása, ha az oldal bármelyik pontjára kattintunk
  document.addEventListener("click", (e) => {
    const modal = document.getElementById("cartModal");
    const cartBtn = document.getElementById("cartButton");
    const modalContent = document.querySelector(".modal-content");
    
    // Ha a kosár nyitva van és nem a kosáron vagy a kosár gombján kattintunk
    // és nem linkre kattintunk
    if (!modal.classList.contains("hidden") && !modal.contains(e.target) && e.target !== cartBtn && e.target.tagName !== "A") {
      closeCartModal();
    }
  });
}

function applyFilters() {
  const { search, make, category, brand } = state.filters;
  state.filtered = state.products.filter(p => {
    // search in name, brand, oem
    const needle = search;
    const hay = `${p.name || ""} ${p.brand || ""} ${p.oem || ""}`.toLowerCase();
    const matchSearch = needle ? hay.includes(needle) : true;

    const matchCategory = category ? p.category === category : true;

    let matchMake = true;
    if (make) {
      const compat = Array.isArray(p.compatible) ? p.compatible : [];
      matchMake = compat.some(c => (c.make || "") === make);
    }

    // Brand matching: normalize by removing non-alphanumerics and lowercasing
    let matchBrand = true;
    if (brand) {
      const norm = s => (s || '').toString().toLowerCase().replace(/[^a-z0-9]+/g, '');
      const pbrand = norm(p.brand || '');
      const sbrand = norm(brand || '');
      matchBrand = pbrand.includes(sbrand) || sbrand.includes(pbrand);
    }

    return matchSearch && matchCategory && matchMake && matchBrand;
  });

  // Reset to page 1 when filters change
  state.currentPage = 1;
  renderProducts();
}

function renderProducts() {
  const container = document.getElementById("products");
  container.innerHTML = "";
  if (!state.filtered.length) {
    container.innerHTML = `<p>Nincs találat a megadott szűrők alapján.</p>`;
    renderPagination();
    return;
  }

  // Calculate pagination
  const totalPages = Math.ceil(state.filtered.length / state.itemsPerPage);
  const startIdx = (state.currentPage - 1) * state.itemsPerPage;
  const endIdx = startIdx + state.itemsPerPage;
  const pageItems = state.filtered.slice(startIdx, endIdx);

  const tpl = document.getElementById("productCardTpl");
  pageItems.forEach(p => {
    const node = tpl.content.cloneNode(true);
    const img = node.querySelector(".card-img");
    const title = node.querySelector(".card-title");
    const metaBrand = node.querySelector(".brand");
    const metaCat = node.querySelector(".category");
    const oem = node.querySelector(".oem");
    const compat = node.querySelector(".compat");
    const desc = node.querySelector(".desc");
    const price = node.querySelector(".price");
    const stock = node.querySelector(".stock");
    const addBtn = node.querySelector(".addToCart");

    img.src = p.image || "";
    img.alt = p.name || "Termék";
    title.textContent = p.name;
    metaBrand.textContent = p.brand || "Ismeretlen márka";
    metaCat.textContent = p.category || "Kategória nélkül";
    oem.textContent = p.oem ? `OEM: ${p.oem}` : "";
    compat.textContent = Array.isArray(p.compatible) && p.compatible.length
      ? `Kompatibilis: ${p.compatible.map(c => `${c.make} ${c.model} (${c.yearFrom || ""}-${c.yearTo || ""})`).join(", ")}`
      : "Kompatibilitás nincs megadva";

    desc.textContent = p.description || "";
    price.textContent = `${formatPrice(p.price)} Ft`;
    stock.textContent = p.stock > 0 ? `Raktáron: ${p.stock} db` : "Nincs raktáron";

    addBtn.disabled = p.stock <= 0;
    addBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(p);
    });

    container.appendChild(node);
  });

  // Render pagination controls
  renderPagination();
}

function addToCart(product) {
  // Biztosítja, hogy az újonnan hozzáadott vagy frissített tételek a kosár tetején jelenjenek meg
  const idx = state.cart.findIndex(i => i.id === product.id);
  if (idx !== -1) {
    // existing item: increase qty (respect stock) and move to top
    const existing = state.cart[idx];
    existing.qty = Math.min((existing.qty || 0) + 1, product.stock || existing.qty);
    // move to front
    state.cart.splice(idx, 1);
    state.cart.unshift(existing);
    state.lastAddedId = existing.id;
  } else {
    // new item: always add to top
    const newItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
      qty: 1
    };
    state.cart.unshift(newItem);
    state.lastAddedId = newItem.id;
  }
  saveCart();
  updateCartCount();
  
  // Ha a kosár nyitva van, frissítsd a tartalmát és görgess a tetejére
  const modal = document.getElementById("cartModal");
  if (!modal.classList.contains("hidden")) {
    renderCart();
    const wrap = document.getElementById("cartItems");
    if (wrap) requestAnimationFrame(() => { wrap.scrollTop = 0; });
  }
}

function updateCartCount() {
  const count = state.cart.reduce((sum, i) => sum + i.qty, 0);
  document.getElementById("cartCount").textContent = String(count);
}

function toggleCart() {
  const modal = document.getElementById("cartModal");
  if (modal.classList.contains("hidden")) {
    renderCart();
    modal.classList.remove("hidden");
    // biztosítja, hogy a kosár görgetése a tetején legyen megnyitáskor (a festés után)
    const wrap = document.getElementById("cartItems");
    if (wrap) requestAnimationFrame(() => { wrap.scrollTop = 0; });
  } else {
    modal.classList.add("hidden");
  }
}

function openCart() {
  renderCart();
  document.getElementById("cartModal").classList.remove("hidden");
}

function closeCartModal() {
  document.getElementById("cartModal").classList.add("hidden");
}

function renderCart() {
  const wrap = document.getElementById("cartItems");
  wrap.innerHTML = "";

  if (!state.cart.length) {
    wrap.innerHTML = "<p>A kosár üres.</p>";
    document.getElementById("cartTotal").textContent = "0 Ft";
    return;
  }

  state.cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item";

    const img = document.createElement("img");
    img.src = item.image || "";
    img.alt = item.name || "Termék";

    const info = document.createElement("div");
    const title = document.createElement("div");
    title.className = "title";
    title.textContent = item.name;
    const price = document.createElement("div");
    price.className = "muted";
    price.textContent = `${formatPrice(item.price)} Ft / db`;

    info.appendChild(title);
    info.appendChild(price);

    const controls = document.createElement("div");
    controls.className = "qty-controls";

    const minus = document.createElement("button");
    minus.textContent = "−";
    minus.addEventListener("click", () => changeQty(item.id, -1));

    const qty = document.createElement("span");
    qty.textContent = String(item.qty);

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.addEventListener("click", () => changeQty(item.id, +1));

    const remove = document.createElement("button");
    remove.textContent = "Eltávolítás";
    remove.addEventListener("click", () => removeItem(item.id));

    controls.appendChild(minus);
    controls.appendChild(qty);
    controls.appendChild(plus);
    controls.appendChild(remove);

    row.appendChild(img);
    row.appendChild(info);
    row.appendChild(controls);
    wrap.appendChild(row);
  });

  const total = state.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  document.getElementById("cartTotal").textContent = `${formatPrice(total)} Ft`;

  // ensure the cart viewport is scrolled to the top so newest (first) item is visible
  requestAnimationFrame(() => {
    try {
      wrap.scrollTop = 0;
    } catch (e) {
      // figyelmen kívül hagyjuk a hibát
    }
  });
}

function changeQty(id, delta) {
  const item = state.cart.find(i => i.id === id);
  if (!item) return;
  const newQty = Math.max(0, Math.min((item.qty || 1) + delta, item.stock || Infinity));
  if (newQty === 0) {
    removeItem(id);
    return;
  }
  item.qty = newQty;
  saveCart();
  renderCart();
  updateCartCount();
}

function removeItem(id) {
  state.cart = state.cart.filter(i => i.id !== id);
  if (state.lastAddedId === id) state.lastAddedId = null;
  saveCart();
  renderCart();
  updateCartCount();
}

function formatPrice(n) {
  const val = Number(n || 0);
  return val.toLocaleString("hu-HU");
}

function debounce(fn, ms = 200) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

function loadCart() {
  try {
    const raw = localStorage.getItem("cart");
    // also read the lastAddedId if present
    try {
      initialLastAddedId = localStorage.getItem("cartLastAdded") || null;
    } catch (e) {
      initialLastAddedId = null;
    }
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(state.cart));
  try {
    if (state.lastAddedId) localStorage.setItem("cartLastAdded", String(state.lastAddedId));
    else localStorage.removeItem("cartLastAdded");
  } catch (e) {
    // figyelmen kívül hagyjuk a tárolási hibákat
  }
}

function renderPagination() {
  const container = document.getElementById("pagination");
  if (!container) return;
  
  container.innerHTML = "";
  
  if (!state.filtered.length) {
    container.innerHTML = "";
    return;
  }

  const totalPages = Math.ceil(state.filtered.length / state.itemsPerPage);
  
  if (totalPages <= 1) {
    container.innerHTML = "";
    return;
  }

  // Previous button
  const prevBtn = document.createElement("button");
  prevBtn.className = "pagination-btn";
  prevBtn.textContent = "← Előző";
  prevBtn.disabled = state.currentPage === 1;
  prevBtn.addEventListener("click", () => {
    if (state.currentPage > 1) {
      state.currentPage--;
      renderProducts();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
  container.appendChild(prevBtn);

  // Page info
  const info = document.createElement("span");
  info.className = "pagination-info";
  info.textContent = `Oldal ${state.currentPage} / ${totalPages}`;
  container.appendChild(info);

  // Next button
  const nextBtn = document.createElement("button");
  nextBtn.className = "pagination-btn";
  nextBtn.textContent = "Következő →";
  nextBtn.disabled = state.currentPage === totalPages;
  nextBtn.addEventListener("click", () => {
    if (state.currentPage < totalPages) {
      state.currentPage++;
      renderProducts();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
  container.appendChild(nextBtn);
}
