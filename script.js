// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
    }
});

// Add animation to skill tags
const skillTags = document.querySelectorAll('.skill-tags span');
skillTags.forEach(tag => {
    tag.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.1)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    tag.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1)';
    });
});

// Glitter trail effect
let lastX = 0;
let lastY = 0;
let isMoving = false;
let moveTimeout;

document.addEventListener('mousemove', (e) => {
    const currentX = e.clientX;
    const currentY = e.clientY;
    
    // Calculate distance moved
    const distance = Math.sqrt(
        Math.pow(currentX - lastX, 2) + 
        Math.pow(currentY - lastY, 2)
    );
    
    // Only create glitter if mouse has moved enough
    if (distance > 5) {
        createGlitter(currentX, currentY);
        lastX = currentX;
        lastY = currentY;
    }
});

function createGlitter(x, y) {
    const glitter = document.createElement('div');
    glitter.className = 'glitter';
    
    // Random offset for more natural look
    const offsetX = (Math.random() - 0.5) * 10;
    const offsetY = (Math.random() - 0.5) * 10;
    
    glitter.style.left = `${x + offsetX}px`;
    glitter.style.top = `${y + offsetY}px`;
    
    // Random size for variety
    const size = Math.random() * 5 + 5;
    glitter.style.width = `${size}px`;
    glitter.style.height = `${size}px`;
    
    // Random gold color variation
    const goldColors = [
        'rgba(255, 215, 0, 0.8)',  // Classic gold
        'rgba(255, 223, 0, 0.8)',  // Bright gold
        'rgba(218, 165, 32, 0.8)', // Goldenrod
        'rgba(255, 193, 37, 0.8)'  // Amber gold
    ];
    const randomColor = goldColors[Math.floor(Math.random() * goldColors.length)];
    glitter.style.background = `radial-gradient(circle, 
        ${randomColor} 0%, 
        ${randomColor.replace('0.8', '0.4')} 30%,
        ${randomColor.replace('0.8', '0')} 70%
    )`;
    
    // Random rotation
    const rotation = Math.random() * 360;
    glitter.style.transform = `rotate(${rotation}deg)`;
    
    document.body.appendChild(glitter);
    
    // Remove the element after animation
    setTimeout(() => {
        glitter.remove();
    }, 1000);
}

// Custom cursor
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

const trail = document.createElement('div');
trail.className = 'cursor-trail';
document.body.appendChild(trail);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let trailX = 0;
let trailY = 0;

// Smooth cursor movement using requestAnimationFrame
function updateCursor() {
    // Smooth main cursor movement
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    
    // Smooth trail movement
    trailX += (cursorX - trailX) * 0.3;
    trailY += (cursorY - trailY) * 0.3;
    
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    trail.style.transform = `translate(${trailX}px, ${trailY}px)`;
    
    requestAnimationFrame(updateCursor);
}

// Update mouse position
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Start the animation
updateCursor();

// Audio Player
const audioPlayer = document.querySelector('.audio-player');
const playPauseBtn = document.querySelector('#playBtn');
const volumeSlider = document.querySelector('#volumeSlider');
const audio = document.querySelector('#audioPlayer');

if (audioPlayer && playPauseBtn && volumeSlider && audio) {
    // Set initial volume
    audio.volume = 0.5;
    volumeSlider.value = 50;

    // Play/Pause functionality
    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            audio.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    // Volume control
    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value / 100;
    });

    // Try to autoplay when the page loads
    document.addEventListener('DOMContentLoaded', () => {
        audio.play().catch(() => {
            // If autoplay fails, set up one-time click listener
            document.addEventListener('click', () => {
                audio.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }, { once: true });
        });
    });
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, save current state
        localStorage.setItem('audioPlaying', audio.paused ? 'false' : 'true');
    } else {
        // Page is visible again, restore state
        if (!audio.paused) {
            audio.play();
        }
    }
});

// Handle page load
window.addEventListener('load', () => {
    if (localStorage.getItem('audioPlaying') === 'true') {
        // Try to start playback after a short delay
        setTimeout(() => {
            audio.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }, 100);
    }
});

// Handle audio loading
audio.addEventListener('loadeddata', () => {
    if (localStorage.getItem('audioPlaying') === 'true') {
        audio.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
});

// Handle audio errors
audio.addEventListener('error', (e) => {
    console.error('Audio error:', e);
    audio.pause();
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
});

document.addEventListener('DOMContentLoaded', () => {
    // Navigation active state
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}); 