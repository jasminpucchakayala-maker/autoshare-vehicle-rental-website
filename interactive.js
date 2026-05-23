// ==================== INTERACTIVE ELEMENTS ====================

class InteractiveElements {
    constructor() {
        this.setupRippleEffect();
        this.setupButtonInteractions();
        this.setupCardInteractions();
        this.setupFormInteractions();
    }
    
    setupRippleEffect() {
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button, .btn, a[href]');
            if (!button) return;
            
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    }
    
    setupButtonInteractions() {
        const buttons = document.querySelectorAll('.btn, button');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
            
            button.addEventListener('mousedown', () => {
                button.style.transform = 'translateY(0)';
            });
            
            button.addEventListener('mouseup', () => {
                button.style.transform = 'translateY(-2px)';
            });
        });
    }
    
    setupCardInteractions() {
        const cards = document.querySelectorAll('.vehicle-card, .step-card, .feature-card, .testimonial-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-12px)';
                card.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
            });
        });
    }
    
    setupFormInteractions() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.borderColor = 'var(--primary)';
                input.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
            });
            
            input.addEventListener('blur', () => {
                input.style.borderColor = 'var(--gray-200)';
                input.style.boxShadow = 'none';
            });
        });
    }
}

// ==================== PARALLAX SCROLL ====================

class ParallaxScroll {
    constructor() {
        this.elements = [];
        this.init();
    }
    
    init() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(element => {
            this.elements.push({
                element,
                speed: parseFloat(element.dataset.parallax) || 0.5
            });
        });
        
        window.addEventListener('scroll', () => this.update());
    }
    
    update() {
        const scrollY = window.scrollY;
        
        this.elements.forEach(item => {
            const offset = scrollY * item.speed;
            item.element.style.transform = `translateY(${offset}px)`;
        });
    }
}

// ==================== MOUSE TRACKING ====================

class MouseTracking {
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.elements = [];
        this.init();
    }
    
    init() {
        const trackingElements = document.querySelectorAll('[data-mouse-track]');
        
        trackingElements.forEach(element => {
            this.elements.push({
                element,
                strength: parseFloat(element.dataset.mouseTrack) || 10
            });
        });
        
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.update();
        });
    }
    
    update() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        this.elements.forEach(item => {
            const x = (this.mouseX - centerX) / item.strength;
            const y = (this.mouseY - centerY) / item.strength;
            
            item.element.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
}

// ==================== SMOOTH SCROLL ====================

class SmoothScroll {
    constructor() {
        this.setupSmoothScroll();
    }
    
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ==================== COUNTER ANIMATION ====================

class CounterAnimation {
    static animateCounter(element, target, duration = 2000) {
        const start = parseInt(element.textContent) || 0;
        const increment = (target - start) / (duration / 16);
        let current = start;
        
        const counter = setInterval(() => {
            current += increment;
            
            if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
                current = target;
                clearInterval(counter);
            }
            
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }
    
    static setupCounters() {
        const counters = document.querySelectorAll('[data-count]');
        let hasAnimated = false;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    counters.forEach(counter => {
                        const target = parseInt(counter.dataset.count);
                        CounterAnimation.animateCounter(counter, target);
                    });
                }
            });
        }, { threshold: 0.5 });
        
        if (counters.length > 0) {
            observer.observe(counters[0]);
        }
    }
}

// ==================== THEME TOGGLE ====================

class ThemeToggle {
    constructor() {
        this.toggleBtn = document.getElementById('theme-toggle');
        this.init();
    }
    
    init() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggle());
        }
    }
    
    toggle() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateToggleButton(theme);
    }
    
    updateToggleButton(theme) {
        if (!this.toggleBtn) return;
        
        const sunIcon = this.toggleBtn.querySelector('.icon-sun');
        const moonIcon = this.toggleBtn.querySelector('.icon-moon');
        
        if (theme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }
}

// ==================== NAVBAR SCROLL EFFECT ====================

class NavbarScrollEffect {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.init();
    }
    
    init() {
        if (!this.navbar) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });
    }
}

// ==================== MOBILE MENU ====================

class MobileMenu {
    constructor() {
        this.hamburger = document.getElementById('hamburger');
        this.navLinks = document.getElementById('nav-links');
        this.init();
    }
    
    init() {
        if (!this.hamburger) return;
        
        this.hamburger.addEventListener('click', () => this.toggle());
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => this.close());
        });
    }
    
    toggle() {
        this.hamburger.classList.toggle('active');
        this.navLinks.style.display = this.navLinks.style.display === 'flex' ? 'none' : 'flex';
    }
    
    close() {
        this.hamburger.classList.remove('active');
        this.navLinks.style.display = 'none';
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        InteractiveElements,
        ParallaxScroll,
        MouseTracking,
        SmoothScroll,
        CounterAnimation,
        ThemeToggle,
        NavbarScrollEffect,
        MobileMenu
    };
}
