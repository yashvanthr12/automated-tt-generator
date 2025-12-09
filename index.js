document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const roleSelect = document.getElementById('role');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = usernameInput.value;
        const password = passwordInput.value;
        const role = roleSelect.value;

        // Basic validation
        if (!username || !password || !role) {
            showError('Please fill in all fields.');
            return;
        }

        // Login will be handled by Flask backend later
        console.log('Attempting login with:', { username, password, role });
        const dummyToken = 'your_dummy_jwt_token_for_' + role;
        localStorage.setItem('jwt_token', dummyToken);
        localStorage.setItem('user_role', role); // Store the role
        localStorage.setItem('username', username); // Store username for display

        // Redirect to respective dashboard
        window.location.href = `/${role}.html`;
        // --- END SIMULATED LOGIN ---
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('visible');
        setTimeout(() => {
            errorMessage.classList.remove('visible');
        }, 5000);
    }
});