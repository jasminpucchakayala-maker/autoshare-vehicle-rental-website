// ==================== ANIMATION ENGINE ====================

class AnimationEngine {
    constructor() {
        this.animations = new Map();
        this.activeAnimations = new Set();
    }
    
    // Fade in animation
    fadeIn(element, duration = 600, delay = 0) {
        return this.animate(element, {
            opacity: [0, 1]
        }, duration, delay);
    }
    
    // Fade out animation
    fadeOut(element, duration = 600, delay = 0) {
        return this.animate(element, {
            opacity: [1, 0]
        }, duration, delay);
    }
    
    // Slide in from left
    slideInFromLeft(element, duration = 600, delay = 0) {
        return this.animate(element, {
            opacity: [0, 1],
            transform: ['translateX(-30px)', 'translateX(0)']
        }, duration, delay);
    }
    
    // Slide in from right
    slideInFromRight(element, duration = 600, delay = 0) {
        return this.animate(element, {
            opacity: [0, 1],
            transform: ['translateX(30px)', 'translateX(0)']
        }, duration, delay);
    }
    
    // Slide in from top
    slideInFromTop(element, duration = 600, delay = 0) {
        return this.animate(element, {
            opacity: [0, 1],
            transform: ['translateY(-30px)', 'translateY(0)']
        }, duration, delay);
    }
    
    // Slide in from bottom
    slideInFromBottom(element, duration = 600, delay = 0) {
        return this.animate(element, {
            opacity: [0, 1],
            transform: ['translateY(30px)', 'translateY(0)']
        }, duration, delay);
    }
    
    // Scale in animation
    scaleIn(element, duration = 600, delay = 0) {
        return this.animate(element, {
            opacity: [0, 1],
            transform: ['scale(0.8)', 'scale(1)']
        }, duration, delay);
    }
    
    // Bounce animation
    bounce(element, duration = 600, delay = 0) {
        return this.animate(element, {
            transform: [
                'translateY(0)',
                'translateY(-20px)',
                'translateY(0)',
                'translateY(-10px)',
                'translateY(0)'
            ]
        }, duration, delay, 'ease-in-out');
    }
    
    // Pulse animation
    pulse(element, duration = 1000, delay = 0) {
        return this.animate(element, {
            transform: ['scale(1)', 'scale(1.1)', 'scale(1)']
        }, duration, delay, 'ease-in-out');
    }
    
    // Rotate animation
    rotate(element, degrees = 360, duration = 2000, delay = 0) {
        return this.animate(element, {
            transform: [`rotate(0deg)`, `rotate(${degrees}deg)`]
        }, duration, delay, 'linear');
    }
    
    // Generic animate function
    animate(element, keyframes, duration = 600, delay = 0, easing = 'ease-in-out') {
        return new Promise((resolve) => {
            setTimeout(() => {
                const animation = element.animate(keyframes, {
                    duration,
                    easing,
                    fill: 'forwards'
                });
                
                animation.onfinish = () => {
                    this.activeAnimations.delete(animation);
                    resolve();
                };
                
                this.activeAnimations.add(animation);
            }, delay);
        });
    }
    
    // Stagger animation for multiple elements
    async stagger(elements, animationFn, delayBetween = 100) {
        for (let i = 0; i < elements.length; i++) {
            setTimeout(() => {
                animationFn(elements[i], 600, 0);
            }, i * delayBetween);
        }
    }
    
    // Cancel all animations
    cancelAll() {
        this.activeAnimations.forEach(animation => animation.cancel());
        this.activeAnimations.clear();
    }
}

// ==================== SCROLL ANIMATIONS ====================

class ScrollAnimationManager {
    constructor() {
        this.elements = [];
        this.observer = null;
        this.animationEngine = new AnimationEngine();
        this.init();
    }
    
    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
    }
    
    register(selector, animationType = 'fadeInUp') {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.dataset.animationType = animationType;
            this.observer.observe(element);
            this.elements.push(element);
        });
    }
    
    animateElement(element) {
        const animationType = element.dataset.animationType || 'fadeInUp';
        const delay = element.dataset.animationDelay || 0;
        
        switch(animationType) {
            case 'fadeIn':
                this.animationEngine.fadeIn(element, 600, delay);
                break;
            case 'fadeInUp':
                this.animationEngine.slideInFromBottom(element, 600, delay);
                break;
            case 'fadeInDown':
                this.animationEngine.slideInFromTop(element, 600, delay);
                break;
            case 'fadeInLeft':
                this.animationEngine.slideInFromLeft(element, 600, delay);
                break;
            case 'fadeInRight':
                this.animationEngine.slideInFromRight(element, 600, delay);
                break;
            case 'scaleIn':
                this.animationEngine.scaleIn(element, 600, delay);
                break;
            default:
                this.animationEngine.fadeIn(element, 600, delay);
        }
    }
    
    dispose() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.elements = [];
    }
}

// ==================== PARTICLE SYSTEM ====================

class ParticleSystem {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.particles = [];
        this.maxParticles = 50;
        this.isActive = false;
    }
    
    start() {
        this.isActive = true;
        this.createParticles();
    }
    
    stop() {
        this.isActive = false;
    }
    
    createParticles() {
        if (!this.isActive) return;
        
        for (let i = 0; i < this.maxParticles; i++) {
            const particle = this.createParticle();
            this.container.appendChild(particle.element);
            this.particles.push(particle);
        }
        
        this.animateParticles();
    }
    
    createParticle() {
        const element = document.createElement('div');
        element.className = 'particle';
        element.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: linear-gradient(135deg, #2563EB, #F59E0B);
            border-radius: 50%;
            pointer-events: none;
            box-shadow: 0 0 10px rgba(37, 99, 235, 0.6);
        `;
        
        return {
            element,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 1,
            maxLife: 1 + Math.random()
        };
    }
    
    animateParticles() {
        const animate = () => {
            this.particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.1; // gravity
                particle.life -= 1 / 60;
                
                particle.element.style.left = particle.x + 'px';
                particle.element.style.top = particle.y + 'px';
                particle.element.style.opacity = Math.max(0, particle.life);
                
                if (particle.life <= 0) {
                    particle.element.remove();
                }
            });
            
            this.particles = this.particles.filter(p => p.life > 0);
            
            if (this.isActive && this.particles.length < this.maxParticles) {
                const newParticles = Math.floor(this.maxParticles / 10);
                for (let i = 0; i < newParticles; i++) {
                    const particle = this.createParticle();
                    this.container.appendChild(particle.element);
                    this.particles.push(particle);
                }
            }
            
            if (this.isActive) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnimationEngine, ScrollAnimationManager, ParticleSystem };
}
