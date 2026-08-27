const truckSection = document.querySelector("#truck-reveal");
const truck = document.querySelector(".truck");
const heading = document.querySelector(".heading-reveal");
const container = document.querySelector("#cardsContainer");

const products = [
   {
    img:"public/images/bangles.jpg",
    name:"DIY Bangles",
    price:"Rs. 180",
    seller:"Ayesha Crafts",
    company:"Jewelry",
    color: "pink"
},
{
    img:"public/images/crochet heart dish.jpg",
    name:"Crochet Dish",
    price:"Rs. 250",
    seller:"Handmade by Sana",
    company:"Crochet",
    color:"blue"
},
{
    img:"public/images/gajre.jpg",
    name:"Floral Gajra",
    price:"Rs. 320",
    seller:"Noor Creations",
    company:"Floral Accessories",
    color:"green"
},
{
    img:"public/images/flower.jpg",
    name:"Decorative Flower",
    price:"Rs. 280",
    seller:"Bloom Studio",
    company:"Home Décor",
    color: "yellow"
}
];

let truckX = -250;
let started = false;
let lastTimestamp = null;
const speed = 500;

function animateTruck(timestamp){
    if (lastTimestamp === null) lastTimestamp = timestamp;
    const deltaSeconds = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    truckX += speed * deltaSeconds;
    truck.style.left = truckX + "px";

    // Reveal window: text starts uncovering once truck enters this zone,
    // fully revealed by the time truck exits it
    const revealStart = window.innerWidth * 0.30;
    const revealEnd   = window.innerWidth * 0.65;

    let revealPercent = ((truckX - revealStart) / (revealEnd - revealStart)) * 100;
    revealPercent = Math.max(0, Math.min(100, revealPercent));

    heading.style.clipPath = `inset(0 ${100 - revealPercent}% 0 0)`;

    if (truckX < window.innerWidth + 500){
        requestAnimationFrame(animateTruck);
    }
}

const truckObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
        if (entry.isIntersecting && !started){
            started = true;
            truck.classList.add("drive");
            requestAnimationFrame(animateTruck);
        }
    });
},{ threshold:0.1 });

truckObserver.observe(truckSection);

function renderCards(){
    products.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <div class="card-image">
                <img src="${p.img}" alt="${p.name}">
            </div>
            <div class="card-info">
                <h3>${p.name}</h3>
                <p class="card-seller">${p.seller}</p>
                <p class="card-price">${p.price}</p>
            </div>
        `;
        container.appendChild(card);
    });
}
renderCards();

const cardObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
        if (entry.isIntersecting){
            const cards = container.querySelectorAll(".product-card");
            cards.forEach((card, i)=>{
                setTimeout(()=> card.classList.add("show"), i * 150);
            });
            cardObserver.unobserve(container);
        }
    });
},{ threshold:0.2 });
cardObserver.observe(container);


const mission = document.querySelector(".mission-section");

const missionObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){
            mission.classList.add("show");
        }

    });

},{
    threshold:0.3
});
const cards = document.querySelectorAll(".craft-card");

const craftObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            cards.forEach((card,index)=>{

                setTimeout(()=>{

                    card.classList.add("show");

                },index*350);

            });

        }

    });

},{threshold:.3});

craftObserver.observe(document.querySelector(".craft-story"));
missionObserver.observe(mission);

// ================= FOCUS CAROUSEL =================

const focusCards = document.querySelectorAll(".focus-card");

focusCards.forEach(card => {
    card.addEventListener("mouseenter", () => {
        focusCards.forEach(c => c.classList.remove("active"));
        card.classList.add("active");
    });
});



const menuIcon = document.getElementById("menu-icon");
const menu = document.getElementById("menuOverlay");
const closeBtn = document.querySelector(".close-menu");

menuIcon.addEventListener("click", () => {
    menu.classList.add("active");
});

closeBtn.addEventListener("click", () => {
    menu.classList.remove("active");
});

menu.addEventListener("click", (e) => {
    if (e.target === menu) {
        menu.classList.remove("active");
    }
});