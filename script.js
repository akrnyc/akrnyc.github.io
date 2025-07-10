// Global state
let currentPage = 'homepage';
let mouseX = 0;
let mouseY = 0;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    setupMouseTracking();
});

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            navigateToPage(target);
        });
    });

    // NYC page functionality
    setupNYCPage();
    
    // Parallax and scroll effects
    setupParallaxEffects();
}

function setupMouseTracking() {
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (currentPage === 'homepage') {
            updateBackgroundGradient();
        }
    });
}

function updateBackgroundGradient() {
    const bg = document.getElementById('animatedBg');
    const x = (mouseX / window.innerWidth) * 100;
    const y = (mouseY / window.innerHeight) * 100;
    
    bg.style.background = `radial-gradient(circle at ${x}% ${y}%, #FD3866 0%, #093c3d 30%, #000000 70%)`;
}

function navigateToPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });

    // Update body class and show target page
    const body = document.getElementById('body');
    body.className = '';
    
    if (pageName === 'home' || pageName === 'homepage') {
        body.className = 'homepage';
        document.getElementById('homepage').style.display = 'block';
        currentPage = 'homepage';
    } else if (pageName === 'nyc') {
        body.className = 'page-nyc';
        document.getElementById('nyc').style.display = 'block';
        currentPage = 'nyc';
    } else if (pageName === 'lab') {
        body.className = 'page-lab';
        document.getElementById('lab').style.display = 'block';
        currentPage = 'lab';
    }
}

function setupNYCPage() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainImage');
    const dropdown = document.getElementById('collectionsDropdown');

    // Thumbnail click handlers
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main display
            const title = this.getAttribute('data-title');
            const id = this.getAttribute('data-id');
            mainImage.textContent = `${title} - Full View`;
            mainImage.style.background = `linear-gradient(45deg, #093c3d, #FD3866)`;
        });
    });

    // Collection dropdown handler
    dropdown.addEventListener('change', function() {
        const collection = this.value;
        updateThumbnailsForCollection(collection);
    });
}

function updateThumbnailsForCollection(collection) {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const collections = {
        'fw26': ['Urban Edge', 'Night Vision', 'City Lights', 'Metro Flow', 'Street Art'],
        'ss27': ['Solar Flare', 'Ocean Breeze', 'Summer Nights', 'Beach Vibes', 'Sunset Glow'],
        'fw27': ['Winter Storm', 'Ice Crystal', 'Snow Fall', 'Frozen Lake', 'Aurora']
    };

    const titles = collections[collection] || collections['fw26'];
    
    thumbnails.forEach((thumb, index) => {
        if (titles[index]) {
            thumb.setAttribute('data-title', titles[index]);
            thumb.style.background = `linear-gradient(135deg, #093c3d, #${Math.floor(Math.random()*16777215).toString(16)})`;
        }
    });

    // Reset active state
    thumbnails.forEach(t => t.classList.remove('active'));
    if (thumbnails[0]) {
        thumbnails[0].classList.add('active');
        document.getElementById('mainImage').textContent = `${titles[0]} - Full View`;
    }
}

function setupParallaxEffects() {
    window.addEventListener('scroll', function() {
        if (currentPage === 'lab') {
            const scrolled = window.pageYOffset;
            const parallaxBg = document.querySelector('.parallax-bg');
            
            if (parallaxBg) {
                parallaxBg.style.transform = `translateY(${scrolled * 0.5}px) rotate(${scrolled * 0.01}deg)`;
            }
        }
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.tech-card, .about-content');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
});

// Preload and optimize performance
function preloadImages() {
    // Preload any background images or assets
    const imageUrls = [
        // Add any image URLs here when you have them
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Call preload when DOM is ready
document.addEventListener('DOMContentLoaded', preloadImages);

// Smooth page transitions
function smoothTransition(callback) {
    document.body.style.opacity = '0.7';
    document.body.style.transform = 'scale(0.98)';
    
    setTimeout(() => {
        callback();
        document.body.style.opacity = '1';
        document.body.style.transform = 'scale(1)';
    }, 200);
}

// Enhanced navigation with smooth transitions
function navigateToPageSmooth(pageName) {
    smoothTransition(() => {
        navigateToPage(pageName);
    });
}

// Update navigation event listeners to use smooth transitions
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.removeEventListener('click', function() {}); // Remove old listeners
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            navigateToPageSmooth(target);
        });
    });
});

// Form handling with better UX
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('.form-submit');
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Re-enable after 3 seconds (form will redirect anyway)
            setTimeout(() => {
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
            }, 3000);
        });
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && currentPage !== 'homepage') {
        navigateToPageSmooth('homepage');
    }
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Swipe right to go back (only if significant horizontal movement)
    if (deltaX > 50 && Math.abs(deltaY) < 100 && currentPage !== 'homepage') {
        navigateToPageSmooth('homepage');
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll handler
const debouncedScrollHandler = debounce(function() {
    if (currentPage === 'lab') {
        const scrolled = window.pageYOffset;
        const parallaxBg = document.querySelector('.parallax-bg');
        
        if (parallaxBg) {
            parallaxBg.style.transform = `translateY(${scrolled * 0.5}px) rotate(${scrolled * 0.01}deg)`;
        }
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Add loading state for better UX
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
});

// Set initial loading state
document.body.style.opacity = '0';