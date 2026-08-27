// ================= DATA =================

const products = [
    { img:"public/images/bangles.jpg", name:"DIY Bangles", price:180, seller:"Ayesha Crafts", category:"Jewelry", rating:4.8, added:5 },
    { img:"public/images/crochet heart dish.jpg", name:"Crochet Heart Dish", price:250, seller:"Handmade by Sana", category:"Crochet", rating:4.6, added:2 },
    { img:"public/images/gajre.jpg", name:"Floral Gajra", price:320, seller:"Noor Creations", category:"Floral Accessories", rating:4.9, added:8 },
    { img:"public/images/flower.jpg", name:"Decorative Flower", price:280, seller:"Bloom Studio", category:"Home Decor", rating:4.5, added:4 },
    { img:"public/images/slide2.jpg", name:"Silver Jhumka Earrings", price:450, seller:"Ayesha Crafts", category:"Jewelry", rating:4.9, added:1 },
    { img:"public/images/embroidery-art.jpg", name:"Embroidered Clutch", price:950, seller:"Zainab Threads", category:"Embroidery", rating:4.7, added:6 },
    { img:"public/images/slide1.jpg", name:"Hand-Woven Changair", price:600, seller:"Rural Weaves Co.", category:"Home Decor", rating:4.8, added:9 },
    { img:"public/images/pottery.jpg", name:"Glazed Clay Bowl", price:520, seller:"Earthen Studio", category:"Pottery", rating:4.6, added:3 },
    { img:"public/images/crochet.jpg", name:"Crochet Tote Bag", price:780, seller:"Handmade by Sana", category:"Crochet", rating:4.7, added:7 },
    { img:"public/images/slide4.jpg", name:"Organic Mehndi Cones (Set of 6)", price:350, seller:"Henna House", category:"Floral Accessories", rating:4.4, added:10 },
    { img:"public/images/raft.jpg", name:"Macrame Wall Hanging", price:890, seller:"Rural Weaves Co.", category:"Home Decor", rating:4.9, added:0 },
    { img:"public/images/slide5.jpg", name:"Hand-Embroidered Dupatta", price:1200, seller:"Zainab Threads", category:"Embroidery", rating:5.0, added:11 },
];

const sellers = [
    { name:"Ayesha Crafts", specialty:"Jewelry & Bangles", location:"Lahore, Punjab" },
    { name:"Handmade by Sana", specialty:"Crochet", location:"Karachi, Sindh" },
    { name:"Noor Creations", specialty:"Floral Accessories", location:"Multan, Punjab" },
    { name:"Bloom Studio", specialty:"Home Décor", location:"Islamabad" },
    { name:"Zainab Threads", specialty:"Hand Embroidery", location:"Faisalabad, Punjab" },
    { name:"Earthen Studio", specialty:"Pottery", location:"Hala, Sindh" },
    { name:"Rural Weaves Co.", specialty:"Woven Home Decor", location:"Bahawalpur, Punjab" },
    { name:"Henna House", specialty:"Mehndi & Floral", location:"Peshawar, KP" },
];

const categoryColors = {
    "Jewelry": "#d81b5f",
    "Crochet": "#1a9b8a",
    "Floral Accessories": "#f4c81f",
    "Home Decor": "#e8622c",
    "Embroidery": "#5c1a1a",
    "Pottery": "#a85c32",
};

const PAGE_SIZE = 8;

let state = {
    category: "all",
    search: "",
    sort: "popular",
    page: 1,
};

// ================= ELEMENTS =================

const productsGrid = document.getElementById("productsGrid");
const sellersGrid = document.getElementById("sellersGrid");
const resultsCount = document.getElementById("resultsCount");
const emptyState = document.getElementById("emptyState");
const paginationEl = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const filterChips = document.getElementById("filterChips");

// ================= HELPERS =================

function textColorFor(hex){
    // yellow needs dark text for contrast, everything else stays white
    return hex === "#f4c81f" ? "#241512" : "#ffffff";
}

function getFilteredProducts(){
    let list = products.filter(p => {
        const matchesCategory = state.category === "all" || p.category === state.category;
        const q = state.search.trim().toLowerCase();
        const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.seller.toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
    });

    switch(state.sort){
        case "price-low":
            list.sort((a,b) => a.price - b.price);
            break;
        case "price-high":
            list.sort((a,b) => b.price - a.price);
            break;
        case "newest":
            list.sort((a,b) => a.added - b.added);
            break;
        default:
            list.sort((a,b) => b.rating - a.rating);
    }

    return list;
}

// ================= RENDER =================

function renderProducts(){
    const filtered = getFilteredProducts();
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    state.page = Math.min(state.page, totalPages);

    const start = (state.page - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(start, start + PAGE_SIZE);

    resultsCount.textContent = filtered.length
        ? `Showing ${start + 1}-${Math.min(start + pageItems.length, filtered.length)} of ${filtered.length} products`
        : "Showing 0 products";

    emptyState.hidden = filtered.length !== 0;
    productsGrid.innerHTML = "";

    pageItems.forEach((p, i) => {
        const color = categoryColors[p.category] || "#5c1a1a";
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <div class="card-image">
                <span class="category-tag" style="background:${color};color:${textColorFor(color)}">${p.category}</span>
                <img src="${p.img}" alt="${p.name}">
            </div>
            <div class="card-info">
                <h3>${p.name}</h3>
                <p class="card-seller"><i class="fa-solid fa-store"></i>${p.seller}</p>
                <div class="card-footer">
                    <p class="card-price">Rs. ${p.price}</p>
                    <div class="card-rating"><i class="fa-solid fa-star"></i>${p.rating.toFixed(1)}</div>
                </div>
            </div>
        `;
        productsGrid.appendChild(card);
        setTimeout(() => card.classList.add("show"), i * 60);
    });

    renderPagination(totalPages);
}

function renderPagination(totalPages){
    paginationEl.innerHTML = "";
    if (totalPages <= 1) return;

    const prev = document.createElement("button");
    prev.className = "page-btn";
    prev.innerHTML = `<i class="fa-solid fa-chevron-left"></i>`;
    prev.disabled = state.page === 1;
    prev.addEventListener("click", () => { state.page--; renderProducts(); scrollToListing(); });
    paginationEl.appendChild(prev);

    for (let i = 1; i <= totalPages; i++){
        const btn = document.createElement("button");
        btn.className = "page-btn" + (state.page === i ? " active" : "");
        btn.textContent = i;
        btn.addEventListener("click", () => { state.page = i; renderProducts(); scrollToListing(); });
        paginationEl.appendChild(btn);
    }

    const next = document.createElement("button");
    next.className = "page-btn";
    next.innerHTML = `<i class="fa-solid fa-chevron-right"></i>`;
    next.disabled = state.page === totalPages;
    next.addEventListener("click", () => { state.page++; renderProducts(); scrollToListing(); });
    paginationEl.appendChild(next);
}

function scrollToListing(){
    document.querySelector(".products-listing").scrollIntoView({ behavior:"smooth", block:"start" });
}

function renderSellers(){
    sellersGrid.innerHTML = "";
    sellers.forEach((s, i) => {
        const color = categoryColors[Object.keys(categoryColors).find(c => s.specialty.includes(c.split(" ")[0]))] || "#5c1a1a";
        const initials = s.name.split(" ").map(w => w[0]).slice(0,2).join("").toUpperCase();

        const card = document.createElement("div");
        card.className = "seller-card";
        card.innerHTML = `
            <div class="seller-avatar" style="background:${color}">${initials}</div>
            <div class="seller-details">
                <h3>${s.name}</h3>
                <p class="seller-specialty">${s.specialty}</p>
                <p class="seller-location"><i class="fa-solid fa-location-dot"></i> ${s.location}</p>
            </div>
        `;
        sellersGrid.appendChild(card);
        setTimeout(() => card.classList.add("show"), i * 80);
    });
}

// ================= EVENTS =================

filterChips.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    filterChips.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    state.category = chip.dataset.category;
    state.page = 1;
    renderProducts();
});

let searchDebounce;
searchInput.addEventListener("input", (e) => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
        state.search = e.target.value;
        state.page = 1;
        renderProducts();
    }, 200);
});

sortSelect.addEventListener("change", (e) => {
    state.sort = e.target.value;
    state.page = 1;
    renderProducts();
});

// ================= INIT =================

renderProducts();
renderSellers();
