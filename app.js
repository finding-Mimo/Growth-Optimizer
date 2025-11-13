// Tab Navigation
const navTabs = document.querySelectorAll('.nav-tab');
const tabContents = document.querySelectorAll('.tab-content');
const hamburger = document.getElementById('hamburger');
const navTabsContainer = document.getElementById('navTabs');

navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        // Update active tab
        navTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update active content
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === targetTab) {
                content.classList.add('active');
            }
        });
        
        // Close mobile menu
        if (window.innerWidth <= 768) {
            navTabsContainer.classList.remove('active');
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Trigger animations for new tab
        setTimeout(() => {
            animateOnScroll();
        }, 100);
        
        // Initialize carousel if switching to current state tab
        if (targetTab === 'current-state') {
            startCarousel();
        } else {
            stopCarousel();
        }
    });
});

// Hamburger Menu Toggle
hamburger.addEventListener('click', () => {
    navTabsContainer.classList.toggle('active');
});

// Carousel Functionality
let currentSlide = 0;
let carouselInterval;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');
const carouselTrack = document.querySelector('.carousel-track');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (index + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    // Animate metric counter
    const metricElement = slides[currentSlide].querySelector('.slide-metric');
    animateCounter(metricElement);
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function startCarousel() {
    stopCarousel();
    carouselInterval = setInterval(nextSlide, 6000);
}

function stopCarousel() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
}

// Carousel controls
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopCarousel();
        startCarousel();
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopCarousel();
        startCarousel();
    });
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
        stopCarousel();
        startCarousel();
    });
});

// Pause carousel on hover
if (carouselTrack) {
    carouselTrack.addEventListener('mouseenter', stopCarousel);
    carouselTrack.addEventListener('mouseleave', () => {
        if (document.getElementById('current-state').classList.contains('active')) {
            startCarousel();
        }
    });
}

// Touch swipe for mobile
let touchStartX = 0;
let touchEndX = 0;

if (carouselTrack) {
    carouselTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    carouselTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    if (touchStartX - touchEndX > 50) {
        nextSlide();
        stopCarousel();
        startCarousel();
    }
    if (touchEndX - touchStartX > 50) {
        prevSlide();
        stopCarousel();
        startCarousel();
    }
}

// Animate Counter
function animateCounter(element) {
    const text = element.textContent;
    const hasRupee = text.includes('₹');
    const hasPercent = text.includes('%');
    const hasX = text.includes('x');
    
    // Extract number from text
    let numStr = text.replace(/[^0-9.]/g, '');
    const targetNum = parseFloat(numStr);
    
    if (isNaN(targetNum)) return;
    
    const duration = 1000;
    const steps = 30;
    const increment = targetNum / steps;
    let current = 0;
    let step = 0;
    
    const timer = setInterval(() => {
        current += increment;
        step++;
        
        if (step >= steps) {
            current = targetNum;
            clearInterval(timer);
        }
        
        let displayValue = current.toLocaleString('en-IN', {
            maximumFractionDigits: text.includes('.') ? 1 : 0
        });
        
        if (hasRupee) displayValue = '₹' + displayValue;
        if (hasPercent) displayValue = displayValue + '%';
        if (hasX) displayValue = displayValue + 'x';
        
        element.textContent = displayValue;
    }, duration / steps);
}

// Accordion Functionality
const accordions = document.querySelectorAll('.accordion');

accordions.forEach(accordion => {
    const header = accordion.querySelector('.accordion-header');
    header.addEventListener('click', () => {
        accordion.classList.toggle('active');
    });
});

// Scroll Animations
function animateOnScroll() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Growth Chart
function initializeChart() {
    const ctx = document.getElementById('growthChart');
    if (!ctx) return;
    
    const data = {
        labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
        datasets: [
            {
                label: 'Monthly Active Users',
                data: [311860, 325000, 340000, 358000, 375000, 390000],
                borderColor: '#6366F1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true,
                yAxisID: 'y'
            },
            {
                label: 'Paid Users',
                data: [10915, 13450, 16830, 20640, 24375, 26520],
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true,
                yAxisID: 'y'
            },
            {
                label: 'MRR (₹ Lakhs)',
                data: [87.21, 107.46, 134.47, 164.91, 194.76, 211.89],
                borderColor: '#8B5CF6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                tension: 0.4,
                fill: true,
                yAxisID: 'y1'
            }
        ]
    };
    
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 13,
                            family: 'Inter'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#1E293B',
                    bodyColor: '#64748B',
                    borderColor: '#E2E8F0',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                if (context.dataset.label === 'MRR (₹ Lakhs)') {
                                    label += '₹' + context.parsed.y.toFixed(2) + 'L';
                                } else {
                                    label += context.parsed.y.toLocaleString('en-IN');
                                }
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Users',
                        font: {
                            size: 12,
                            family: 'Inter'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return (value / 1000).toFixed(0) + 'K';
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'MRR (₹ Lakhs)',
                        font: {
                            size: 12,
                            family: 'Inter'
                        }
                    },
                    grid: {
                        drawOnChartArea: false
                    },
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toFixed(0) + 'L';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    };
    
    new Chart(ctx, config);
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
    initializeChart();
    
    // Start carousel if on current state tab
    if (document.getElementById('current-state').classList.contains('active')) {
        startCarousel();
    }
});

// Reinitialize animations on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        animateOnScroll();
    }, 250);
});