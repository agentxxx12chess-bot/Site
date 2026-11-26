// Family Chess Dashboard JavaScript
// Handles all interactive functionality for the family-focused chess platform

document.addEventListener('DOMContentLoaded', function() {
    // Initialize family dashboard
    initFamilyDashboard();
    setupEventListeners();
    updateCurrentDateTime();
});

function initFamilyDashboard() {
    // Initialize family setup modal
    const familySetupBtn = document.querySelector('.family-login .btn-primary');
    const familySetupModal = document.getElementById('family-setup-modal');
    const closeModal = document.querySelector('.close-modal');
    
    if (familySetupBtn && familySetupModal) {
        familySetupBtn.addEventListener('click', function() {
            familySetupModal.style.display = 'block';
        });
    }
    
    if (closeModal && familySetupModal) {
        closeModal.addEventListener('click', function() {
            familySetupModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === familySetupModal) {
            familySetupModal.style.display = 'none';
        }
    });
    
    // Initialize family setup form
    const familySetupForm = document.getElementById('family-setup-form');
    if (familySetupForm) {
        familySetupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFamilySetup();
        });
    }
    
    // Initialize navigation
    initNavigation();
    
    // Initialize interactive charts and visualizations
    initProgressCharts();
    
    // Initialize equipment recommendations
    initEquipmentRecommendations();
    
    // Initialize family activities
    initFamilyActivities();
}

function setupEventListeners() {
    // Navigation click handlers
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            navigateToSection(target);
        });
    });
    
    // Learning path interaction
    document.querySelectorAll('.lesson-item').forEach(item => {
        item.addEventListener('click', function() {
            toggleLessonProgress(this);
        });
    });
    
    // Tournament registration
    document.querySelectorAll('.btn-primary').forEach(btn => {
        if (btn.textContent.includes('Register')) {
            btn.addEventListener('click', function() {
                showRegistrationForm(this);
            });
        }
    });
    
    // Equipment recommendation actions
    document.querySelectorAll('.recommendation-action .btn-primary').forEach(btn => {
        btn.addEventListener('click', function() {
            showEquipmentDetails(this);
        });
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            performSearch(this.value);
        }, 300));
    }
    
    // Responsive menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            toggleMobileMenu();
        });
    }
}

function initNavigation() {
    // Update active navigation based on current section
    const sections = document.querySelectorAll('.dashboard');
    const navLinks = document.querySelectorAll('.main-nav a');
    
    function updateActiveNavigation() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 100) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavigation);
    updateActiveNavigation();
}

function navigateToSection(target) {
    const section = document.querySelector(target);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for fixed header
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function toggleLessonProgress(lessonItem) {
    if (lessonItem.classList.contains('completed')) {
        // Mark as in-progress
        lessonItem.classList.remove('completed');
        lessonItem.classList.add('active');
        showNotification('Lesson marked as in-progress!');
    } else if (lessonItem.classList.contains('active')) {
        // Mark as completed
        lessonItem.classList.remove('active');
        lessonItem.classList.add('completed');
        showNotification('Lesson completed! Great job!');
    }
    
    updateFamilyProgress();
}

function handleFamilySetup() {
    const formData = {
        familyName: document.getElementById('family-name').value,
        parentName: document.getElementById('parent-name').value,
        childNames: document.getElementById('child-names').value,
        experienceLevel: document.getElementById('chess-experience').value
    };
    
    // Validate form
    if (!formData.familyName || !formData.parentName) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Process family setup
    processFamilySetup(formData);
}

function processFamilySetup(formData) {
    // Simulate API call to save family setup
    showLoading(true);
    
    setTimeout(() => {
        // Generate family ID and initialize data
        const familyId = 'fam_' + Math.random().toString(36).substr(2, 9);
        const welcomeMessage = `Welcome to your chess family journey, ${formData.familyName}!`;
        
        showNotification(welcomeMessage, 'success');
        
        // Close modal
        document.getElementById('family-setup-modal').style.display = 'none';
        
        // Initialize family dashboard with new data
        initializeFamilyDashboard(familyId, formData);
        
        showLoading(false);
    }, 1500);
}

function initializeFamilyDashboard(familyId, formData) {
    // Set up family data structure
    window.familyData = {
        id: familyId,
        name: formData.familyName,
        parents: [formData.parentName],
        children: formData.childNames.split(',').map(name => name.trim()).filter(name => name),
        experienceLevel: formData.experienceLevel,
        progress: {
            totalLessons: 28,
            completedLessons: 15,
            currentStreak: 5,
            familyPoints: 1250
        },
        achievements: ['Strategic Thinker', 'Equipment Champion'],
        upcomingEvents: [],
        equipmentRecommendations: [],
        tournamentRegistrations: []
    };
    
    // Update dashboard with family data
    updateFamilyDashboardUI();
    
    // Generate personalized recommendations
    generatePersonalizedRecommendations();
}

function initProgressCharts() {
    // Initialize interactive progress charts
    const chartBars = document.querySelectorAll('.chart-bar');
    
    chartBars.forEach(bar => {
        bar.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.1)';
        });
        
        bar.addEventListener('mouseleave', function() {
            this.style.filter = 'brightness(1)';
        });
    });
    
    // Animate charts on load
    animateProgressBars();
}

function animateProgressBars() {
    const chartBars = document.querySelectorAll('.chart-bar');
    
    chartBars.forEach((bar, index) => {
        setTimeout(() => {
            const height = bar.style.height;
            bar.style.height = '0%';
            bar.style.transition = 'height 1s ease-in-out';
            
            setTimeout(() => {
                bar.style.height = height;
            }, 100);
        }, index * 200);
    });
}

function initEquipmentRecommendations() {
    const recommendationItems = document.querySelectorAll('.recommendation-item');
    
    recommendationItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function initFamilyActivities() {
    const activityItems = document.querySelectorAll('.activity-item');
    
    activityItems.forEach(item => {
        item.addEventListener('click', function() {
            const activityTitle = this.querySelector('h4').textContent;
            showActivityDetails(activityTitle);
        });
    });
}

function showRegistrationForm(button) {
    const tournamentCard = button.closest('.tournament-card');
    const tournamentTitle = tournamentCard.querySelector('h3').textContent;
    
    showNotification(`Registration form for ${tournamentTitle} would open here!`, 'info');
}

function showEquipmentDetails(button) {
    const recommendationItem = button.closest('.recommendation-item');
    const equipmentTitle = recommendationItem.querySelector('h4').textContent;
    
    showNotification(`${equipmentTitle} details would open here!`, 'info');
}

function showActivityDetails(activityTitle) {
    showNotification(`Activity details for ${activityTitle} would open here!`, 'info');
}

function updateFamilyProgress() {
    // Simulate progress updates
    if (window.familyData) {
        const completedLessons = document.querySelectorAll('.lesson-item.completed').length;
        const totalLessons = document.querySelectorAll('.lesson-item').length;
        
        window.familyData.progress.completedLessons = completedLessons;
        window.familyData.progress.totalLessons = totalLessons;
        
        updateFamilyDashboardUI();
    }
}

function generatePersonalizedRecommendations() {
    // Generate family-specific recommendations based on progress and preferences
    if (!window.familyData) return;
    
    const recommendations = [
        { type: 'equipment', title: 'Beginner Chess Set', reason: 'Perfect for family learning' },
        { type: 'tournament', title: 'Family Chess Night', reason: 'Great practice for weekend events' },
        { type: 'lesson', title: 'Pawn Endgame Mastery', reason: 'Next skill milestone' }
    ];
    
    window.familyData.equipmentRecommendations = recommendations;
    console.log('Personalized recommendations generated:', recommendations);
}

function updateFamilyDashboardUI() {
    if (!window.familyData) return;
    
    // Update family stats
    document.querySelectorAll('.stat-number').forEach((stat, index) => {
        const stats = [
            window.familyData.parents.length + window.familyData.children.length,
            window.familyData.progress.completedLessons,
            Math.floor(Math.random() * 20) + 5,
            window.familyData.progress.familyPoints
        ];
        
        if (index < stats.length) {
            stat.textContent = stats[index];
        }
    });
    
    // Update achievement count
    const achievementCards = document.querySelectorAll('.achievement-card');
    if (achievementCards.length > 0 && window.familyData.achievements) {
        achievementCards[0].querySelector('h3').textContent = 
            `${window.familyData.achievements.length} Achievements Earned`;
    }
}

function performSearch(query) {
    // Implement search functionality
    console.log('Searching for:', query);
    showNotification(`Search results for "${query}" would appear here`, 'info');
}

function toggleMobileMenu() {
    const nav = document.querySelector('.main-nav');
    nav.classList.toggle('active');
}

function showLoading(show) {
    const loader = document.querySelector('.loading');
    if (loader) {
        loader.style.display = show ? 'block' : 'none';
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function updateCurrentDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('en-US', options);
    
    // Update any date displays
    document.title = `Family Chess Academy - ${formattedDate}`;
}

// Utility functions
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

// Initialize the application
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}

function main() {
    console.log('Family Chess Academy Dashboard initialized successfully!');
    
    // Add smooth scrolling for better user experience
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Add interactive hover effects to cards
    const cards = document.querySelectorAll('.learning-card, .tournament-card, .achievement-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
}