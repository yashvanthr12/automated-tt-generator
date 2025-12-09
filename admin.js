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
    const recipientSelect = document.getElementById('notificationRecipient');
    const messageTextarea = document.getElementById('notificationMessage');
    const notificationsList = document.getElementById('sentNotificationsList');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const recipient = recipientSelect.value;
            const message = messageTextarea.value.trim();
            
            // Validate inputs
            if (!recipient) {
                if (typeof showToast === 'function') {
                    showToast('Please select a recipient', 'warning');
                }
                recipientSelect.focus();
                return;
            }
            
            if (!message) {
                if (typeof showToast === 'function') {
                    showToast('Please enter a notification message', 'warning');
                }
                messageTextarea.focus();
                return;
            }
            
            // Get recipient display text
            let recipientText = '';
            switch(recipient) {
                case 'teachers':
                    recipientText = 'Teachers Only';
                    break;
                case 'students':
                    recipientText = 'Students Only';
                    break;
                case 'both':
                    recipientText = 'Both Teachers & Students';
                    break;
            }
            
            // Get current timestamp
            const now = new Date();
            const timestamp = now.toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // Get admin username
            const adminUsername = localStorage.getItem('username') || 'Admin';
            
            // Add notification to history
            const notificationItem = document.createElement('li');
            notificationItem.className = 'notification-item';
            notificationItem.innerHTML = `
                <span class="notification-time">[${timestamp}]</span>
                <span class="notification-sender"><strong>${adminUsername}:</strong></span>
                <span class="notification-text">${message}</span>
                <span class="notification-recipient-badge">(To: ${recipientText})</span>
            `;
            
            // Add to top of list
            if (notificationsList.firstChild) {
                notificationsList.insertBefore(notificationItem, notificationsList.firstChild);
            } else {
                notificationsList.appendChild(notificationItem);
            }
            
            // Show success message
            if (typeof showToast === 'function') {
                showToast(`Notification sent to ${recipientText}`, 'success');
            }
            
            // Reset form
            form.reset();
            
            // Log for backend integration (will be replaced with Flask API call)
            console.log('Notification sent:', {
                recipient: recipient,
                message: message,
                timestamp: timestamp
            });
            
            // TODO: Replace with Flask backend API call
            // fetch('/api/notifications', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         recipient: recipient,
            //         message: message
            //     })
            // });
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
