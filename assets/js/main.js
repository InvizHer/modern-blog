        // Mobile Menu Toggle with Animation
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');
    let isMenuOpen = false;

    // Initially hide close icon
    closeIcon.classList.add('hidden-icon');

    mobileMenuButton.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        
        // Toggle icons
        menuIcon.classList.toggle('hidden-icon');
        closeIcon.classList.toggle('hidden-icon');
        
        if (isMenuOpen) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('slide-down');
            mobileMenu.classList.remove('slide-up');
        } else {
            mobileMenu.classList.add('slide-up');
            mobileMenu.classList.remove('slide-down');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
        }
    });

        // Header Scroll Effect
        const header = document.getElementById('header');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                header.classList.remove('py-2');
                return;
            }
            
            if (currentScroll > lastScroll) {
                header.classList.add('-translate-y-full');
            } else {
                header.classList.remove('-translate-y-full');
            }
            
            if (currentScroll > 100) {
                header.classList.add('py-2');
            } else {
                header.classList.remove('py-2');
            }
            
            lastScroll = currentScroll;
        });


        // Add to your existing style section
const scrollRevealStyles = `
.scroll-reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    will-change: opacity, transform;
}

.scroll-reveal.revealed {
    opacity: 1;
    transform: translateY(0);
}
`;

// Create and append style element
const styleSheet = document.createElement('style');
styleSheet.textContent = scrollRevealStyles;
document.head.appendChild(styleSheet);

// Initialize scroll reveal
const scrollReveal = () => {
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(element => {
        observer.observe(element);
    });
};

// Run on DOM load
document.addEventListener('DOMContentLoaded', scrollReveal);


// cookiesssssssssssssss
class CookieConsentManager {
    constructor() {
        // DOM Elements
        this.consentBanner = document.getElementById('cookieConsent');
        this.modal = document.getElementById('cookieModal');
        this.modalOverlay = this.modal.querySelector('.modal-overlay');
        this.buttons = {
            customize: document.getElementById('customizeBtn'),
            acceptAll: document.getElementById('acceptAllBtn'),
            savePreferences: document.getElementById('savePreferencesBtn')
        };
        this.toggles = {
            analytics: document.getElementById('analyticsToggle'),
            marketing: document.getElementById('marketingToggle')
        };

        this.init();

        // Add visibility change listener
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                // User left the page, clean up any pending consent banner timer
                if (this.consentTimer) {
                    clearTimeout(this.consentTimer);
                }
            }
        });
    }

    init() {
    if (!this.getStoredConsent()) {
        // Add 10 second delay before showing the consent banner
        setTimeout(() => {
            // Check if user is still on the page
            if (document.visibilityState === 'visible') {
                this.showConsentBanner();
            }
        }, 10000); // 10000 milliseconds = 10 seconds
    }
    this.bindEvents();
}

    bindEvents() {
        // Bind button events
        this.buttons.customize.addEventListener('click', () => this.openModal());
        this.buttons.acceptAll.addEventListener('click', () => this.handleAcceptAll());
        this.buttons.savePreferences.addEventListener('click', () => this.handleSavePreferences());

        // Bind modal overlay click
        this.modalOverlay.addEventListener('click', () => this.closeModal());

        // Bind ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });

        // Bind toggle switches
        Object.values(this.toggles).forEach(toggle => {
            toggle.addEventListener('change', (e) => this.handleToggleChange(e.target));
        });
    }

    showConsentBanner() {
        requestAnimationFrame(() => {
            this.consentBanner.style.display = 'block';
            requestAnimationFrame(() => {
                this.consentBanner.classList.remove('translate-y-full', 'opacity-0');
            });
        });
    }

    hideConsentBanner() {
        return new Promise(resolve => {
            this.consentBanner.classList.add('translate-y-full', 'opacity-0');
            setTimeout(() => {
                this.consentBanner.style.display = 'none';
                resolve();
            }, 300);
        });
    }

    openModal() {
    document.body.style.overflow = 'hidden';
    this.loadSavedPreferences();
    this.modal.classList.remove('hidden');
    requestAnimationFrame(() => {
        const modalContent = this.modal.querySelector('.transform.scale-95');
        if (modalContent) {
            modalContent.classList.remove('scale-95');
        }
    });
}

closeModal() {
    const modalContent = this.modal.querySelector('.transform');
    if (modalContent) {
        modalContent.classList.add('scale-95');
    }
    
    setTimeout(() => {
        this.modal.classList.add('hidden');
        document.body.style.overflow = '';
        if (modalContent) {
            modalContent.classList.remove('scale-95');
        }
    }, 300);
}

    handleToggleChange(toggle) {
        const dot = toggle.nextElementSibling;
        dot.style.transform = toggle.checked ? 'translateX(-24px)' : 'translateX(0)';
    }

    async handleAcceptAll() {
        const preferences = {
            analytics: true,
            marketing: true
        };
        
        this.setStoredConsent(preferences);
        await this.hideConsentBanner();
    }

    async handleSavePreferences() {
        const preferences = {
            analytics: this.toggles.analytics.checked,
            marketing: this.toggles.marketing.checked
        };
        
        this.setStoredConsent(preferences);
        this.closeModal();
        await this.hideConsentBanner();
    }

    loadSavedPreferences() {
        const savedPreferences = this.getStoredConsent();
        if (savedPreferences) {
            this.toggles.analytics.checked = savedPreferences.analytics;
            this.toggles.marketing.checked = savedPreferences.marketing;
            
            Object.values(this.toggles).forEach(toggle => {
                this.handleToggleChange(toggle);
            });
        }
    }

    getStoredConsent() {
        try {
            return JSON.parse(localStorage.getItem('cookieConsent'));
        } catch {
            return null;
        }
    }

    setStoredConsent(preferences) {
        localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CookieConsentManager();
});

