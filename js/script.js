// ==================== DOM Elements ====================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollProgress = document.querySelector('.scroll-progress');
const backToTopBtn = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

// ==================== Mobile Menu Toggle ====================
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ==================== Smooth Scrolling ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== Active Navbar Link ====================
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });

    // Update scroll progress
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';

    // Show/Hide back to top button
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

// ==================== Back to Top ====================
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ==================== Typing Animation ====================
class TypingAnimation {
    constructor(elementSelector) {
        this.element = document.querySelector(elementSelector);
        this.words = ['Web Developer', 'UI/UX Designer', 'Creative Thinker'];
        this.wordIndex = 0;
        this.charIndex = 0;
        this.currentWord = '';
        this.isDeleting = false;
        this.speed = 100;
        this.deleteSpeed = 50;
        this.init();
    }

    init() {
        this.type();
    }

    type() {
        const word = this.words[this.wordIndex];

        if (this.isDeleting) {
            this.currentWord = word.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.currentWord = word.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        this.element.textContent = this.currentWord;

        if (!this.isDeleting && this.charIndex === word.length) {
            this.isDeleting = true;
            this.speed = 2000;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.wordIndex = (this.wordIndex + 1) % this.words.length;
            this.speed = 100;
        }

        setTimeout(() => this.type(), this.isDeleting ? this.deleteSpeed : this.speed);
    }
}

// Initialize typing animation
new TypingAnimation('.typing-text');

// ==================== Scroll Reveal Animation ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .about-card, .project-card, .timeline-item').forEach(el => {
    observer.observe(el);
});

// ==================== Counter Animation ====================
class CounterAnimation {
    constructor(element) {
        this.element = element;
        this.target = parseInt(element.dataset.target);
        this.current = 0;
        this.increment = this.target / 50;
        this.isAnimating = false;
    }

    animate() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const animate = () => {
            this.current += this.increment;
            if (this.current < this.target) {
                this.element.textContent = Math.floor(this.current);
                requestAnimationFrame(animate);
            } else {
                this.element.textContent = this.target;
            }
        };

        animate();
    }
}

// Initialize counters on scroll
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = new CounterAnimation(entry.target);
            counter.animate();
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(counter => {
    counterObserver.observe(counter);
});

// ==================== Skill Progress Animation ====================
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillProgress = entry.target.querySelector('.skill-progress');
            if (skillProgress && !skillProgress.style.width) {
                const width = skillProgress.style.width;
                skillProgress.style.width = '0';
                setTimeout(() => {
                    skillProgress.style.width = width;
                }, 100);
            }
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-item').forEach(item => {
    skillObserver.observe(item);
});

// ==================== Project Filter ====================
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');

        // Filter projects
        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.classList.remove('hidden');
                card.style.display = 'block';
                setTimeout(() => {
                    card.classList.add('reveal');
                }, 10);
            } else {
                card.classList.add('hidden');
                card.style.display = 'none';
            }
        });
    });
});

// ==================== Form Validation ====================
class FormValidator {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validateForm();
        });
    }

    validateForm() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            this.showMessage('Please fill in all required fields', 'error');
            return false;
        }

        if (!this.isValidEmail(email)) {
            this.showMessage('Please enter a valid email address', 'error');
            return false;
        }

        if (message.length < 10) {
            this.showMessage('Message must be at least 10 characters long', 'error');
            return false;
        }

        this.showMessage('Message sent successfully!', 'success');
        this.form.reset();
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            padding: 12px 20px;
            margin-bottom: 15px;
            border-radius: 8px;
            font-weight: 600;
            animation: slideUp 0.3s ease;
            ${type === 'success' 
                ? 'background: rgba(34, 197, 94, 0.2); border: 1px solid rgba(34, 197, 94, 0.5); color: #86efac;' 
                : 'background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.5); color: #fca5a5;'
            }
        `;

        this.form.insertBefore(messageDiv, this.form.firstChild);

        setTimeout(() => {
            messageDiv.remove();
        }, 4000);
    }
}

// Initialize form validator
new FormValidator('#contactForm');

// ==================== Hire Me Button ====================
document.querySelector('.btn-primary').addEventListener('click', () => {
    const contactSection = document.getElementById('contact');
    contactSection.scrollIntoView({ behavior: 'smooth' });
});

// ==================== Parallax Effect ====================
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrollPosition = window.scrollY;
    hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
});

// ==================== Mouse Cursor Effect ====================
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    // Optional: Add custom cursor effect here
});

// ==================== Page Load Animation ====================
window.addEventListener('load', () => {
    // Fade in hero content
    document.querySelector('.hero-text').style.animation = 'slideInLeft 0.8s ease';
    document.querySelector('.hero-image').style.animation = 'slideInRight 0.8s ease';
});

// ==================== Smooth Navbar ====================
let lastScrollY = 0;
let ticking = false;

function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(5, 8, 22, 0.95)';
        navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(5, 8, 22, 0.8)';
        navbar.style.boxShadow = 'none';
    }
    ticking = false;
}

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
    }
});

// ==================== Resize Event Handler ====================
window.addEventListener('resize', () => {
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// ==================== Initialize AOS-like Animations ====================
const initAnimations = () => {
    const elements = document.querySelectorAll('[data-animation]');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animation = entry.target.dataset.animation;
                entry.target.style.animation = `${animation} 0.6s ease forwards`;
                animationObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => animationObserver.observe(el));
};

initAnimations();

// ==================== Local Storage for Theme ====================
const saveUserPreferences = () => {
    const preferences = {
        visitCount: parseInt(localStorage.getItem('visitCount') || 0) + 1,
        lastVisit: new Date().toISOString()
    };
    localStorage.setItem('visitCount', preferences.visitCount);
    localStorage.setItem('lastVisit', preferences.lastVisit);
};

saveUserPreferences();

// ==================== Keyboard Navigation ====================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// ==================== Page Visibility API ====================
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        console.log('Page hidden');
    } else {
        console.log('Page visible');
    }
});

// ==================== Lazy Load Images ====================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ==================== Console Welcome Message ====================
console.log('%cWelcome to My Portfolio!', 'font-size: 20px; color: #7c3aed; font-weight: bold;');
console.log('%cDesigned & Built with ❤️ using HTML, CSS & JavaScript', 'font-size: 14px; color: #06b6d4;');

// ==================== Smooth Page Transition ====================
const animatePageLoad = () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.3s ease';
    }, 100);
};

window.addEventListener('beforeunload', () => {
    document.body.style.opacity = '0';
});

animatePageLoad();