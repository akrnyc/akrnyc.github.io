// Enhanced particle system with mouse interaction
let particles = [];
let mouseX = 0;
let mouseY = 0;
let connections = [];

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 250;

    // Clear existing particles
    particlesContainer.innerHTML = '';
    particles = [];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Assign random sizes and types
        const rand = Math.random();
        if (rand < 0.7) {
            particle.classList.add('small');
        } else if (rand < 0.9) {
            particle.classList.add('medium');  
        } else {
            particle.classList.add('large');
        }
        
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        particle.style.left = x + '%';
        particle.style.top = y + '%';
        particle.style.animationDelay = Math.random() * 25 + 's';
        particle.style.animationDuration = (Math.random() * 15 + 15) + 's';
        
        // Store particle data for interactions
        particles.push({
            element: particle,
            x: x,
            y: y,
            originalX: x,
            originalY: y,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        });
        
        particlesContainer.appendChild(particle);
    }
}

// Mouse tracking
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 100;
    mouseY = (e.clientY / window.innerHeight) * 100;
    
    // Interact with nearby particles
    particles.forEach(particle => {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 15) {
            // Attract particles to mouse
            particle.x += dx * 0.02;
            particle.y += dy * 0.02;
            particle.element.style.left = particle.x + '%';
            particle.element.style.top = particle.y + '%';
            particle.element.classList.add('glowing');
        } else {
            // Return to original position
            particle.x += (particle.originalX - particle.x) * 0.02;
            particle.y += (particle.originalY - particle.y) * 0.02;
            particle.element.style.left = particle.x + '%';
            particle.element.style.top = particle.y + '%';
            particle.element.classList.remove('glowing');
        }
    });
    
    // Create connections between nearby particles
    createConnections();
});

// Click burst effect
document.addEventListener('click', (e) => {
    createClickBurst(e.clientX, e.clientY);
    
    // Push particles away from click
    const clickX = (e.clientX / window.innerWidth) * 100;
    const clickY = (e.clientY / window.innerHeight) * 100;
    
    particles.forEach(particle => {
        const dx = particle.x - clickX;
        const dy = particle.y - clickY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 20) {
            const force = (20 - distance) / 20;
            particle.vx += (dx / distance) * force * 2;
            particle.vy += (dy / distance) * force * 2;
        }
    });
});

function createClickBurst(x, y) {
    for (let i = 0; i < 12; i++) {
        const burst = document.createElement('div');
        burst.className = 'click-burst';
        burst.style.left = x + 'px';
        burst.style.top = y + 'px';
        
        const angle = (i / 12) * Math.PI * 2;
        const distance = 100 + Math.random() * 100;
        
        burst.style.setProperty('--end-x', Math.cos(angle) * distance + 'px');
        burst.style.setProperty('--end-y', Math.sin(angle) * distance + 'px');
        
        document.body.appendChild(burst);
        
        setTimeout(() => {
            burst.remove();
        }, 800);
    }
}

function createConnections() {
    // Remove old connections
    connections.forEach(line => line.remove());
    connections = [];
    
    // Create new connections between nearby particles
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 8 && Math.random() < 0.1) {
                const line = document.createElement('div');
                line.className = 'connection-line visible';
                
                const centerX = (particles[i].x + particles[j].x) / 2;
                const centerY = (particles[i].y + particles[j].y) / 2;
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                
                line.style.left = centerX + '%';
                line.style.top = centerY + '%';
                line.style.width = distance * (window.innerWidth / 100) + 'px';
                line.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
                
                document.getElementById('particles').appendChild(line);
                connections.push(line);
                
                // Remove connection after short time
                setTimeout(() => {
                    line.classList.remove('visible');
                    setTimeout(() => line.remove(), 300);
                }, 1000);
                
                break; // Limit connections per particle
            }
        }
    }
}

// Update particle physics
function updateParticles() {
    particles.forEach(particle => {
        // Apply velocity
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Apply friction
        particle.vx *= 0.95;
        particle.vy *= 0.95;
        
        // Boundary conditions
        if (particle.x < 0 || particle.x > 100) particle.vx *= -0.5;
        if (particle.y < 0 || particle.y > 100) particle.vy *= -0.5;
        
        particle.x = Math.max(0, Math.min(100, particle.x));
        particle.y = Math.max(0, Math.min(100, particle.y));
        
        // Update position
        particle.element.style.left = particle.x + '%';
        particle.element.style.top = particle.y + '%';
    });
    
    requestAnimationFrame(updateParticles);
}

// Start particle physics loop
requestAnimationFrame(updateParticles);

// Smooth reveal animation
function revealOnScroll() {
    const cards = document.querySelectorAll('.glass-card');
    const triggerBottom = window.innerHeight / 5 * 4;

    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        if (cardTop < triggerBottom) {
            card.classList.add('visible');
        }
    });
}

// Smooth scrolling for anchor links
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

// Magnetic hover effect for buttons
document.querySelectorAll('.glow-button, .submit-btn').forEach(button => {
    button.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translate(0, 0)';
    });
});

// Initialize
window.addEventListener('load', () => {
    createParticles();
    revealOnScroll();
});

window.addEventListener('scroll', revealOnScroll);

// Form submission feedback
document.querySelector('form').addEventListener('submit', function(e) {
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
});