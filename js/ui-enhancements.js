/* ======================================================
   UI Enhancements (SAFE, OPTIMIZED VERSION)
   No infinite loops, no heavy observers, no memory leaks
   ====================================================== */

// Prevent multiple initializations
let uiEnhancementsInitialized = false;
const observers = new Set(); // Track all observers for cleanup

// Wait for DOM
document.addEventListener("DOMContentLoaded", () => {
    if (uiEnhancementsInitialized) {
        console.warn('UI enhancements already initialized, skipping duplicate initialization');
        return;
    }

    initDarkModeToggle();
    initFAB();
    initBreadcrumbs();
    initContentAnimations();
    
    uiEnhancementsInitialized = true;
});

/* ======================================================
   A) DARK MODE TOGGLE
   ====================================================== */

let darkModeSetup = false;

function initDarkModeToggle() {
    if (darkModeSetup) {
        return; // Prevent duplicate setup
    }
    
    const toggleBtn = document.getElementById("darkModeToggle");
    if (!toggleBtn) return;

    // Load saved mode (cache localStorage read)
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.documentElement.classList.add("dark-mode");
        toggleBtn.classList.add("active");
    }

    toggleBtn.addEventListener("click", () => {
        document.documentElement.classList.toggle("dark-mode");

        if (document.documentElement.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
            toggleBtn.classList.add("active");
        } else {
            localStorage.setItem("theme", "light");
            toggleBtn.classList.remove("active");
        }
    }, { passive: true });
    
    darkModeSetup = true;
}

/* ======================================================
   B) FLOATING ACTION BUTTON (FAB)
   ====================================================== */

let fabSetup = false;

function initFAB() {
    if (fabSetup) {
        return; // Prevent duplicate setup
    }
    
    const fab = document.getElementById("mainFAB");
    const fabMenu = document.getElementById("fabMenu");

    if (!fab || !fabMenu) return;

    fab.addEventListener("click", (e) => {
        e.stopPropagation();
        fabMenu.classList.toggle("active");
    }, { passive: true });

    // Auto-close FAB when clicking outside (use event delegation)
    document.addEventListener("click", (e) => {
        if (!fab.contains(e.target) && !fabMenu.contains(e.target)) {
            fabMenu.classList.remove("active");
        }
    }, { passive: true, once: false });

    // Show options based on user role (cached read)
    const role = localStorage.getItem("user_role");

    document.querySelectorAll("[data-role]").forEach(item => {
        const roles = item.dataset.role.split(",");
        item.style.display = roles.includes(role) ? "flex" : "none";
    });
    
    fabSetup = true;
}

/* ======================================================
   C) BREADCRUMB BAR (SAFE OBSERVER VERSION - OPTIMIZED)
   ====================================================== */

let breadcrumbSetup = false;

function initBreadcrumbs() {
    if (breadcrumbSetup) {
        return; // Prevent duplicate setup
    }
    
    const breadcrumb = document.getElementById("breadcrumb");
    if (!breadcrumb) return;

    const sections = document.querySelectorAll(".content-section");
    if (sections.length === 0) return;

    function updateBreadcrumb() {
        // Use for...of for early exit (faster)
        for (const section of sections) {
            if (section.classList.contains("active")) {
                breadcrumb.textContent = section.dataset.title || "Home";
                break; // Stop after finding active section
            }
        }
    }

    // Run once at start
    updateBreadcrumb();

    // SAFE MutationObserver with throttling
    let updateScheduled = false;
    
    const observer = new MutationObserver(() => {
        if (!updateScheduled) {
            updateScheduled = true;
            requestAnimationFrame(() => {
                updateBreadcrumb();
                updateScheduled = false;
            });
        }
    });

    // Observe ONLY real content sections (not whole page!)
    sections.forEach(section => {
        observer.observe(section, {
            attributes: true,
            attributeFilter: ["class"],
            subtree: false // Don't observe children
        });
    });

    // Track observer for cleanup
    observers.add(observer);
    window.breadcrumbObserver = observer;
    
    breadcrumbSetup = true;
}

/* ======================================================
   D) CONTENT ANIMATIONS (NO LOOPS - OPTIMIZED)
   ====================================================== */

let contentAnimationsSetup = false;

function initContentAnimations() {
    if (contentAnimationsSetup) {
        return; // Prevent duplicate setup
    }
    
    const sections = document.querySelectorAll(".content-section");
    if (!sections.length) return;

    sections.forEach(section => {
        // Throttle animations with requestAnimationFrame
        let animationScheduled = false;
        
        const observer = new MutationObserver(() => {
            if (!animationScheduled && section.classList.contains("active")) {
                animationScheduled = true;
                requestAnimationFrame(() => {
                    section.classList.add("fade-in");
                    setTimeout(() => {
                        if (section.classList.contains("fade-in")) {
                            section.classList.remove("fade-in");
                        }
                        animationScheduled = false;
                    }, 400);
                });
            }
        });

        // Observe ONLY this section — not full DOM
        observer.observe(section, {
            attributes: true,
            attributeFilter: ["class"],
            subtree: false // Don't observe children
        });

        // Track observer for cleanup
        observers.add(observer);
        section.animationObserver = observer;
    });
    
    contentAnimationsSetup = true;
}

/* ======================================================
   E) MICRO-INTERACTIONS (Lightweight, No Loops - OPTIMIZED)
   ====================================================== */

// Use event delegation for better performance
document.addEventListener("mouseover", (e) => {
    if (e.target.classList.contains("card")) {
        e.target.classList.add("hover-card");
    }
}, { passive: true });

document.addEventListener("mouseout", (e) => {
    if (e.target.classList.contains("card")) {
        e.target.classList.remove("hover-card");
    }
}, { passive: true });

// Ripple effect for buttons (throttled)
let rippleInProgress = false;

document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn");
    if (!btn || rippleInProgress) return;

    rippleInProgress = true;
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");

    const rect = btn.getBoundingClientRect();
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;

    btn.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
        rippleInProgress = false;
    }, 500);
}, { passive: true });

/* ======================================================
   F) CLEANUP FUNCTION (Prevent memory leaks)
   ====================================================== */

function cleanupUIEnhancements() {
    // Disconnect all observers
    observers.forEach(observer => {
        observer.disconnect();
    });
    observers.clear();
    
    console.log('UI enhancements cleaned up');
}

// Cleanup on page unload
window.addEventListener('beforeunload', cleanupUIEnhancements, { passive: true });
