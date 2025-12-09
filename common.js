// Common functionality for all dashboard pages

// Prevent multiple initializations
let isInitialized = false;

document.addEventListener('DOMContentLoaded', () => {
    if (isInitialized) {
        console.warn('Dashboard already initialized, skipping duplicate initialization');
        return;
    }
    
    // Check authentication
    checkAuthentication();
    
    // Initialize dashboard
    initializeDashboard();
    
    isInitialized = true;
});

// Check if user is authenticated
function checkAuthentication() {
    // If skipCommonAuth is set (e.g., for students who bypass login), skip authentication
    if (window.skipCommonAuth) {
        return true;
    }
    
    const token = localStorage.getItem('jwt_token');
    const userRole = localStorage.getItem('user_role');
    
    if (!token || !userRole) {
        // Redirect to login if not authenticated
        window.location.href = 'index.html';
        return false;
    }
    
    // Display username
    const username = localStorage.getItem('username') || 'User';
    const usernameElement = document.getElementById('loggedInUsername');
    if (usernameElement) {
        usernameElement.textContent = username;
    }
    
    return true;
}

// Initialize dashboard features
function initializeDashboard() {
    // Setup hamburger menu
    setupHamburgerMenu();
    
    // Setup navigation links
    setupNavigation();
    
    // Setup logout button
    setupLogout();
}

// Hamburger menu toggle for mobile
function setupHamburgerMenu() {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const sidebar = document.getElementById('sidebar');
    const dashboardContainer = document.querySelector('.dashboard-container');
    
    if (hamburgerMenu && sidebar) {
        // Remove existing listener to prevent duplicates
        const newHamburger = hamburgerMenu.cloneNode(true);
        hamburgerMenu.parentNode.replaceChild(newHamburger, hamburgerMenu);
        
        newHamburger.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            if (dashboardContainer) {
                dashboardContainer.classList.toggle('sidebar-open');
            }
        }, { passive: true });
    }
}

// Navigation section switching
let navigationSetup = false;

function setupNavigation() {
    if (navigationSetup) {
        return; // Already setup, prevent duplicate listeners
    }
    
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            if (section) {
                showSection(section);
                
                // Update active nav link
                navLinks.forEach(nl => nl.classList.remove('active'));
                link.classList.add('active');
            }
        }, { passive: false });
    });
    
    navigationSetup = true;
}

// Setup logout functionality
let logoutSetup = false;

function setupLogout() {
    if (logoutSetup) {
        return; // Already setup, prevent duplicate listeners
    }
    
    const logoutBtn = document.getElementById('logoutBtn');
    const profileLogout = document.getElementById('profileLogout');
    
    const handleLogout = (e) => {
        e.preventDefault();
        
        // Clear authentication data
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('username');
        
        // Redirect to role selection page
        window.location.href = 'index.html';
    };
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout, { once: true, passive: false });
    }
    
    if (profileLogout) {
        profileLogout.addEventListener('click', handleLogout, { once: true, passive: false });
    }
    
    logoutSetup = true;
}

// Toast notification function
function showToast(message, type = 'info') {
    const container = document.getElementById('toastNotifications');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'notification-toast';
    toast.textContent = message;
    
    // Add type-specific styling if needed
    if (type === 'success') {
        toast.style.backgroundColor = 'rgba(76, 175, 80, 0.9)';
    } else if (type === 'error') {
        toast.style.backgroundColor = 'rgba(244, 67, 54, 0.9)';
    } else if (type === 'warning') {
        toast.style.backgroundColor = 'rgba(255, 193, 7, 0.9)';
    }
    
    container.appendChild(toast);
    
    // Remove toast after animation
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// Make showSection available globally for onclick handlers
// Use admin version if available, otherwise use common version
window.showSection = function(sectionName) {
    // If we're in the admin dashboard and have the enhanced version, use it
    if (typeof window.showSectionAdmin !== 'undefined') {
        window.showSectionAdmin(sectionName);
    } else {
        // Fallback to basic implementation
        const allSections = document.querySelectorAll('.content-section');
        const targetSection = document.getElementById(`${sectionName}-section`);
        
        allSections.forEach(section => {
            if (section === targetSection) {
                section.classList.remove('hidden');
                section.classList.add('active');
            } else {
                section.classList.remove('active');
                section.classList.add('hidden');
            }
        });
        
        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 768) {
            const sidebar = document.getElementById('sidebar');
            const dashboardContainer = document.querySelector('.dashboard-container');
            if (sidebar && dashboardContainer) {
                sidebar.classList.remove('active');
                dashboardContainer.classList.remove('sidebar-open');
            }
        }
    }
};