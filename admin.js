// Admin Dashboard JavaScript
// Handles timetable management, teachers, students, and notifications

// Prevent multiple initializations
let adminInitialized = false;

document.addEventListener('DOMContentLoaded', () => {
    if (adminInitialized) {
        console.warn('Admin dashboard already initialized, skipping duplicate initialization');
        return;
    }
    initializeAdminDashboard();
    adminInitialized = true;
});

function initializeAdminDashboard() {
    // Initialize teacher form handlers
    setupTeacherForm();
    
    // Initialize student form handlers
    setupStudentForm();
    
    // Initialize notification form
    setupNotificationForm();
}

// ============================================
// TEACHER FORM HANDLERS
// ============================================

let teacherFormSetup = false;

function setupTeacherForm() {
    if (teacherFormSetup) {
        return; // Already setup, prevent duplicate listeners
    }
    
    const addBtn = document.getElementById('addTeacherBtn');
    const formContainer = document.getElementById('teacher-form-container');
    const form = document.getElementById('teacherForm');
    const cancelBtn = document.getElementById('cancelTeacherEditBtn');

    if (addBtn && formContainer) {
        addBtn.addEventListener('click', () => {
            formContainer.classList.remove('hidden');
            form.reset();
            document.getElementById('teacherId').value = '';
        }, { passive: true });
    }

    if (cancelBtn && formContainer) {
        cancelBtn.addEventListener('click', () => {
            formContainer.classList.add('hidden');
            form.reset();
        }, { passive: true });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Handle form submission
            console.log('Teacher form submitted');
            // Add your save logic here
        }, { passive: false });
    }
    
    teacherFormSetup = true;
}

// ============================================
// STUDENT FORM HANDLERS
// ============================================

let studentFormSetup = false;

function setupStudentForm() {
    if (studentFormSetup) {
        return; // Already setup, prevent duplicate listeners
    }
    
    const addBtn = document.getElementById('addStudentBtn');
    const formContainer = document.getElementById('student-form-container');
    const form = document.getElementById('studentForm');
    const cancelBtn = document.getElementById('cancelStudentEditBtn');

    if (addBtn && formContainer) {
        addBtn.addEventListener('click', () => {
            formContainer.classList.remove('hidden');
            form.reset();
            document.getElementById('studentId').value = '';
        }, { passive: true });
    }

    if (cancelBtn && formContainer) {
        cancelBtn.addEventListener('click', () => {
            formContainer.classList.add('hidden');
            form.reset();
        }, { passive: true });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Handle form submission
            console.log('Student form submitted');
            // Add your save logic here
        }, { passive: false });
    }
    
    studentFormSetup = true;
}

// ============================================
// NOTIFICATION FORM HANDLERS
// ============================================

let notificationFormSetup = false;

function setupNotificationForm() {
    if (notificationFormSetup) {
        return; // Already setup, prevent duplicate listeners
    }
    
    const form = document.getElementById('notificationForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Handle notification submission
            console.log('Notification form submitted');
            // Add your notification logic here
        }, { passive: false });
    }
    
    notificationFormSetup = true;
}

// Show a specific section and hide others (OPTIMIZED - batch DOM updates)
function showSectionAdmin(sectionName) {
    // Use requestAnimationFrame for smoother rendering
    requestAnimationFrame(() => {
        const allSections = document.querySelectorAll('.content-section');
        const targetSection = document.getElementById(`${sectionName}-section`);
        
        // Batch DOM updates
        allSections.forEach(section => {
            if (section === targetSection) {
                section.classList.remove('hidden');
                section.classList.add('active');
                
                // Load empty timetable when timetable section is shown
                if (sectionName === 'timetable') {
                    loadEmptyTimetable();
                }
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
    });
}

// Make showSectionAdmin available globally for onclick handlers
window.showSectionAdmin = showSectionAdmin;
