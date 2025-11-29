document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('errorMessage');
            
            // Simple validation
            if(username === 'admin' && password === 'admin123') {
                // Login successful - redirect to dashboard
                window.location.href = 'dashboard.php';
            } else {
                errorDiv.textContent = 'Username atau password salah!';
                errorDiv.style.display = 'block';
            }
        });