// ==================== MAIN INITIALIZATION ====================

class WebsiteController {
    constructor() {
        this.animationEngine = new AnimationEngine();
        this.scrollAnimationManager = new ScrollAnimationManager();
        this.interactiveElements = new InteractiveElements();
        this.parallaxScroll = new ParallaxScroll();
        this.mouseTracking = new MouseTracking();
        this.smoothScroll = new SmoothScroll();
        this.themeToggle = new ThemeToggle();
        this.navbarScrollEffect = new NavbarScrollEffect();
        this.mobileMenu = new MobileMenu();
        
        this.init();
    }
    
    init() {
        this.setupPageAnimations();
        this.setupScrollAnimations();
        this.setupCounters();
        this.setupVehicleCards();
        this.setupEventListeners();
    }
    
    setupPageAnimations() {
        // Animate hero content
        const heroBadge = document.querySelector('.hero-badge');
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroSearch = document.querySelector('.hero-search');
        const heroStats = document.querySelector('.hero-stats');
        
        if (heroBadge) this.animationEngine.fadeIn(heroBadge, 600, 0);
        if (heroTitle) this.animationEngine.slideInFromBottom(heroTitle, 800, 200);
        if (heroSubtitle) this.animationEngine.slideInFromBottom(heroSubtitle, 800, 400);
        if (heroSearch) this.animationEngine.slideInFromBottom(heroSearch, 800, 600);
        if (heroStats) this.animationEngine.slideInFromBottom(heroStats, 800, 800);
    }
    
    setupScrollAnimations() {
        // Register scroll animations for different elements
        this.scrollAnimationManager.register('.step-card', 'fadeInUp');
        this.scrollAnimationManager.register('.feature-card', 'fadeInUp');
        this.scrollAnimationManager.register('.vehicle-card', 'scaleIn');
        this.scrollAnimationManager.register('.testimonial-card', 'fadeInLeft');
        this.scrollAnimationManager.register('.city-card', 'fadeInRight');
        this.scrollAnimationManager.register('.floating-card', 'float-animation');
        
        // Add stagger effect
        document.querySelectorAll('.stagger-children > *').forEach((child, index) => {
            child.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    setupCounters() {
        CounterAnimation.setupCounters();
    }
    
    setupVehicleCards() {
        // Example vehicle data
        const vehicles = [
            { name: 'Honda City', category: 'car', price: '₹299/day', emoji: '🚗', rating: 4.8 },
            { name: 'Maruti Suzuki Swift', category: 'car', price: '₹199/day', emoji: '🚙', rating: 4.6 },
            { name: 'Mahindra XUV500', category: 'suv', price: '₹499/day', emoji: '🚕', rating: 4.9 },
            { name: 'Royal Enfield Bullet', category: 'bike', price: '₹99/day', emoji: '🏍️', rating: 4.7 },
            { name: 'Bajaj Pulsar', category: 'bike', price: '₹79/day', emoji: '🏍️', rating: 4.5 },
            { name: 'Toyota Fortuner', category: 'suv', price: '₹649/day', emoji: '🚙', rating: 5.0 }
        ];
        
        const vehiclesGrid = document.getElementById('vehicles-grid');
        if (!vehiclesGrid) return;
        
        vehicles.forEach(vehicle => {
            const card = this.createVehicleCard(vehicle);
            vehiclesGrid.appendChild(card);
        });
        
        // Setup category filter
        this.setupCategoryFilter(vehicles);
    }
    
    createVehicleCard(vehicle) {
        const card = document.createElement('div');
        card.className = 'vehicle-card';
        card.dataset.category = vehicle.category;
        card.innerHTML = `
            <div class="vehicle-image">
                ${vehicle.emoji}
                <div class="vehicle-badge">Popular</div>
            </div>
            <div class="vehicle-info">
                <div class="vehicle-name">${vehicle.name}</div>
                <div class="vehicle-specs">
                    <span>⭐ ${vehicle.rating}</span>
                    <span>🔧 ${vehicle.category}</span>
                </div>
                <div class="vehicle-price">${vehicle.price}</div>
                <button class="vehicle-action">Book Now</button>
            </div>
        `;
        
        card.addEventListener('click', () => {
            this.animationEngine.pulse(card, 600, 0);
            this.showVehicleDetails(vehicle);
        });
        
        return card;
    }
    
    setupCategoryFilter(vehicles) {
        const categoryBtns = document.querySelectorAll('.category-btn');
        const vehicleCards = document.querySelectorAll('.vehicle-card');
        
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const category = btn.dataset.category;
                
                // Filter vehicles
                vehicleCards.forEach(card => {
                    if (category === 'all' || card.dataset.category === category) {
                        card.style.display = 'block';
                        this.animationEngine.scaleIn(card, 400, 0);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    showVehicleDetails(vehicle) {
        // Create a modal or detail view
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 20px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            animation: slideInFromBottom 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        `;
        
        content.innerHTML = `
            <div style="font-size: 4rem; text-align: center; margin-bottom: 1rem;">${vehicle.emoji}</div>
            <h2 style="text-align: center; margin-bottom: 0.5rem;">${vehicle.name}</h2>
            <p style="text-align: center; color: #6B7280; margin-bottom: 1.5rem;">Category: ${vehicle.category}</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="background: #f9fafb; padding: 1rem; border-radius: 10px; text-align: center;">
                    <div style="font-size: 0.75rem; color: #6B7280; margin-bottom: 0.5rem;">Rating</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: #2563EB;">⭐ ${vehicle.rating}</div>
                </div>
                <div style="background: #f9fafb; padding: 1rem; border-radius: 10px; text-align: center;">
                    <div style="font-size: 0.75rem; color: #6B7280; margin-bottom: 0.5rem;">Price</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: #2563EB;">${vehicle.price}</div>
                </div>
            </div>
            
            <button class="btn btn-primary" style="width: 100%; margin-bottom: 0.75rem;">Book This Vehicle</button>
            <button class="btn btn-ghost" style="width: 100%;" onclick="this.closest('div').parentElement.parentElement.remove()">Close</button>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    setupEventListeners() {
        // Search button
        const searchBtn = document.getElementById('search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const city = document.getElementById('search-city').value;
                const pickup = document.getElementById('search-pickup').value;
                const returnDate = document.getElementById('search-return').value;
                
                if (city && pickup && returnDate) {
                    console.log('Searching for vehicles:', { city, pickup, returnDate });
                    this.animationEngine.pulse(searchBtn, 600, 0);
                    alert(`Searching for vehicles in ${city} from ${pickup} to ${returnDate}`);
                }
            });
        }
    }
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the website controller
    const controller = new WebsiteController();
    
    // Make it globally accessible for debugging
    window.websiteController = controller;
    window.AnimationEngine = AnimationEngine;
    
    console.log('✨ Website initialized with animations and 3D effects!');
});

// Handle visibility change for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden - reducing animation activity');
    } else {
        console.log('Page visible - resuming animations');
    }
});
