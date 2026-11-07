const products = [
    {
        id: 1,
        name: "Resident Evil 4 Remake",
        platform: "PlayStation 5 / Xbox Series X|S / PC",
        rating: "⭐ 4.9/5",
        image: "images/re4.jpg",
        description: "Survival horror returns with over-the-shoulder camera and modern gameplay mechanics.",
        category: "action",
        isNew: true
    },
    {
        id: 2,
        name: "Resident Evil Village",
        platform: "PlayStation 5 / Xbox Series X|S / PC",
        rating: "⭐ 4.7/5",
        image: "images/village.jpg",
        description: "Experience survival horror like never before in this first-person adventure.",
        category: "horror",
        isNew: false
    },
    {
        id: 3,
        name: "Resident Evil 2 Remake",
        platform: "PlayStation 4 / Xbox One / PC",
        rating: "⭐ 4.8/5",
        image: "images/re2.jpg",
        description: "A reimagined classic with stunning graphics and intense survival horror gameplay.",
        category: "horror",
        isNew: false
    },
    {
        id: 4,
        name: "Resident Evil 3 Remake",
        platform: "PlayStation 4 / Xbox One / PC",
        rating: "⭐ 4.5/5",
        image: "images/re3.jpg",
        description: "Escape from Nemesis in this action-packed remake of a survival horror classic.",
        category: "action",
        isNew: false
    },
    {
        id: 5,
        name: "Resident Evil 7 Biohazard",
        platform: "PlayStation 4 / Xbox One / PC / VR",
        rating: "⭐ 4.6/5",
        image: "images/re7.jpg",
        description: "Return to survival horror roots with terrifying first-person perspective.",
        category: "horror",
        isNew: false
    },
    {
        id: 6,
        name: "Resident Evil 5",
        platform: "PlayStation 4 / Xbox One / PC",
        rating: "⭐ 4.3/5",
        image: "images/re5.jpg",
        description: "Join Chris Redfield and Sheva Alomar in co-op action horror adventure.",
        category: "action",
        isNew: false
    },
    {
        id: 7,
        name: "Resident Evil 6",
        platform: "PlayStation 4 / Xbox One / PC",
        rating: "⭐ 4.0/5",
        image: "images/re6.jpg",
        description: "Experience multiple interwoven campaigns in this action-packed entry.",
        category: "action",
        isNew: false
    },
    {
        id: 8,
        name: "Resident Evil Revelations",
        platform: "PlayStation 4 / Xbox One / PC",
        rating: "⭐ 4.7/5",
        image: "images/rereva.jpg",
        description: "Where it all began. Experience the classic survival horror remastered.",
        category: "horror",
        isNew: false
    },
    {
        id: 9,
        name: "Resident Evil Requiem",
        platform: "PlayStation 4 / PlayStation 5 / Switch / PC",
        rating: "⭐ 4.9/5",
        image: "images/re9.jpg",
        description: "The final chapter in the survival horror saga.",
        category: "horror",
        isNew: true
    }
];

let currentFilters = {
    category: 'all'
};

function renderCatalog(filteredProducts = products) {
    const catalogSection = document.querySelector('#games-section');
    if (!catalogSection) return;
    
    catalogSection.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const gameCard = document.createElement('article');
        gameCard.className = 'game-card';
        
        let badges = '';
        if (product.isNew) {
            badges += '<div class="game-badge new">NEW</div>';
        }
        
        gameCard.innerHTML = `
            <div class="game-image">
                <img src="${product.image}" alt="${product.name}">
                ${badges}
            </div>
            <div class="game-info">
                <h3>${product.name}</h3>
                <p class="platform">${product.platform}</p>
                <p>${product.description}</p>
                <div class="game-meta">
                    <span class="rating">${product.rating}</span>
                </div>
            </div>
        `;
        
        catalogSection.appendChild(gameCard);
    });
    
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        resultsCount.textContent = `${filteredProducts.length} games found`;
    }
}

function filterProducts() {
    let filtered = [...products];
    
    if (currentFilters.category !== 'all') {
        filtered = filtered.filter(p => p.category === currentFilters.category);
    }
    
    renderCatalog(filtered);
}

function setFilter(filterType, value) {
    currentFilters[filterType] = value;
    filterProducts();
    updateActiveButtons();
}

function updateActiveButtons() {
    const filterGroups = document.querySelectorAll('.filter-group');
    filterGroups.forEach(group => {
        const buttons = group.querySelectorAll('.filter-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        buttons.forEach(btn => {
            const text = btn.textContent.toLowerCase().trim();
            if (currentFilters.category === 'all' && text === 'all') btn.classList.add('active');
            if (currentFilters.category === 'horror' && text === 'horror') btn.classList.add('active');
            if (currentFilters.category === 'action' && text === 'action') btn.classList.add('active');
        });
    });
}

function resetFilters() {
    currentFilters = { category: 'all' };
    filterProducts();
    const allButtons = document.querySelectorAll('.filter-btn');
    allButtons.forEach(btn => btn.classList.remove('active'));
    const filterGroups = document.querySelectorAll('.filter-group');
    filterGroups.forEach(group => {
        const firstBtn = group.querySelector('.filter-btn');
        if (firstBtn) firstBtn.classList.add('active');
    });
}

function toggleFilters() {
    const modal = document.getElementById('filter-modal');
    const overlay = document.querySelector('.filter-overlay');
    if (modal && overlay) {
        modal.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

function updateUserProfile() {
    if (window.RE_PROFILE) {
        const name = window.RE_PROFILE.getName();
        document.querySelectorAll('.user-name').forEach(node => { node.textContent = name || window.RE_PROFILE.ui().enter; });
        document.querySelectorAll('.profile-link').forEach(node => { node.title = window.RE_PROFILE.ui().profile; });
        return;
    }
    let isLoggedIn, userName;
    try { isLoggedIn = localStorage.getItem('isLoggedIn'); userName = localStorage.getItem('userName'); } catch { /* Guest mode remains available. */ }
    const userNameElements = document.querySelectorAll('.user-name');
    if (isLoggedIn === 'true' && userName) {
        userNameElements.forEach(el => el.textContent = userName);
    } else {
        userNameElements.forEach(el => el.textContent = typeof getCurrentLang === 'function' && getCurrentLang() === 'ru' ? 'Гость' : 'Guest');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateUserProfile();
    if (document.querySelector('#games-section') && window.location.pathname.includes('games.html')) {
        renderCatalog();
    }
});
function logout() {
    if (window.RE_PROFILE) { window.RE_PROFILE.clear(); return; }
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isLoggedIn');
    applyLang(getCurrentLang());
    updateUserProfile();
}
