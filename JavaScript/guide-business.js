// Guide Business Page - Interactive Features

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeScrollProgress();
    initializeScrollIndicator();
    initializeChecklistPersistence();
    initializeLazyAnimations();
    initializeCardHoverEffects();
    console.log('Guide Business page initialized');
});

// Scroll Progress Bar
function initializeScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    
    window.addEventListener('scroll', function() {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / docHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Scroll Indicator
function initializeScrollIndicator() {
    const indicator = document.getElementById('scrollIndicator');
    const indicatorText = document.getElementById('indicatorText');
    let scrollTimeout;
    
    window.addEventListener('scroll', function() {
        // Show indicator
        indicator.classList.add('show');
        
        // Clear previous timeout
        clearTimeout(scrollTimeout);
        
        // Get scroll position percentage
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / docHeight) * 100;
        
        // Update text based on scroll position
        if (scrolled < 25) {
            indicatorText.textContent = 'Start Reading...';
        } else if (scrolled < 50) {
            indicatorText.textContent = 'Keep Going! ⬇️';
        } else if (scrolled < 75) {
            indicatorText.textContent = 'Halfway There! 🚀';
        } else if (scrolled < 100) {
            indicatorText.textContent = 'Almost Done! ✨';
        } else {
            indicatorText.textContent = 'Completed! ✅';
        }
        
        // Hide indicator after scrolling stops
        scrollTimeout = setTimeout(function() {
            indicator.classList.remove('show');
        }, 2000);
    });
}

// Lazy load animations on scroll
function initializeLazyAnimations() {
    const elements = document.querySelectorAll('.section, .guide-card, .card-header, .card-content');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation
                setTimeout(() => {
                    entry.target.classList.add('fade-in', 'visible');
                }, index * 100);
                
                // Optional: Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    elements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
}

// Persist checklist state in localStorage
function initializeChecklistPersistence() {
    const checkboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
    
    // Load saved state
    checkboxes.forEach((checkbox, index) => {
        const savedState = localStorage.getItem(`guide-checklist-item-${index}`);
        if (savedState === 'true') {
            checkbox.checked = true;
        }
    });
    
    // Save state on change
    checkboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', function() {
            localStorage.setItem(`guide-checklist-item-${index}`, this.checked);
            showChecklistFeedback();
        });
    });
}

// Show checklist feedback
function showChecklistFeedback() {
    const checkboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
    const totalItems = checkboxes.length;
    const checkedItems = Array.from(checkboxes).filter(cb => cb.checked).length;
    
    if (checkedItems > 0 && checkedItems % 3 === 0) {
        const messages = ['Great Progress! ☕', 'You\'re Doing Great! 🎯', 'Almost There! 🚀'];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        console.log(randomMsg + ` (${checkedItems}/${totalItems})`);
    }
}

// Enhance card hover effects
function initializeCardHoverEffects() {
    const cards = document.querySelectorAll('.guide-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 12px 24px rgba(111, 78, 55, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
}

// Print guide functionality
function printGuide() {
    window.print();
}

// Reset checklist
function resetChecklist() {
    const checkboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
    checkboxes.forEach((checkbox, index) => {
        checkbox.checked = false;
        localStorage.removeItem(`guide-checklist-item-${index}`);
    });
    alert('Checklist has been reset!');
}

// Scroll to section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Export checklist progress
function exportChecklistProgress() {
    const checkboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
    const checkedItems = [];
    const totalItems = checkboxes.length;
    
    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            checkedItems.push(index);
        }
    });
    
    const progress = {
        completed: checkedItems.length,
        total: totalItems,
        percentage: Math.round((checkedItems.length / totalItems) * 100),
        timestamp: new Date().toLocaleString()
    };
    
    console.log('Checklist Progress:', progress);
    return progress;
}

// Display progress
function displayProgress() {
    const progress = exportChecklistProgress();
    alert(
        `Coffee Shop Business Guide Progress\n\n` +
        `Completed: ${progress.completed}/${progress.total}\n` +
        `Progress: ${progress.percentage}%\n\n` +
        `Last Updated: ${progress.timestamp}`
    );
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+P or Cmd+P to print
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        printGuide();
    }
});

// Smooth anchor links
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

// Track scroll position for navbar shadow
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }
});
