document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const messageDiv = document.getElementById('message');
    
    // Validasi input saat user mengetik
    usernameInput.addEventListener('input', clearMessage);
    passwordInput.addEventListener('input', clearMessage);
    
    // Event listener untuk form submission
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        // Validasi input
        if (validateInput(username, password)) {
            // Tampilkan loading
            showMessage('Sedang memproses...', 'loading');
            
            // Simulasi proses login (dalam aplikasi nyata, ini akan diganti dengan panggilan API)
            simulateLogin(username, password);
        }
    });
    
    // Fungsi validasi input
    function validateInput(username, password) {
        // Clear pesan sebelumnya
        clearMessage();
        
        // Validasi username/email
        if (username === '') {
            showMessage('Username atau email harus diisi!', 'error');
            usernameInput.focus();
            return false;
        }
        
        // Validasi password
        if (password === '') {
            showMessage('Password harus diisi!', 'error');
            passwordInput.focus();
            return false;
        }
        
        if (password.length < 6) {
            showMessage('Password harus minimal 6 karakter!', 'error');
            passwordInput.focus();
            return false;
        }
        
        return true;
    }
    
    // Fungsi untuk mensimulasikan proses login
    function simulateLogin(username, password) {
        // Simulasi waktu tunggu untuk koneksi server
        setTimeout(() => {
            // Kredensial valid untuk demo
            const validCredentials = [
                { username: 'user', password: 'password' },
                { username: 'admin', password: 'admin123' },
                { username: 'admin@example.com', password: 'admin123' }
            ];
            
            // Cek apakah kredensial valid
            const isValid = validCredentials.some(cred => 
                (cred.username === username || cred.username + '@example.com' === username) && 
                cred.password === password
            );
            
            if (isValid) {
                showMessage('Login berhasil! Mengalihkan...', 'success');
                
                // Simulasi redirect setelah 2 detik
                setTimeout(() => {
                    window.location.href='home.html'
                    // Dalam aplikasi nyata: window.location.href = 'dashboard.html';
                }, 2000);
            } else {
                showMessage('Username atau password salah!', 'error');
            }
        }, 1500);
    }
    
    // Fungsi untuk menampilkan pesan
    function showMessage(text, type) {
        messageDiv.innerHTML = type === 'loading' ? 
            '<span class="spinner"></span>' + text : text;
        messageDiv.className = 'message ' + type;
        messageDiv.style.display = 'block';
        
        // Sembunyikan pesan setelah 5 detik (kecuali untuk loading)
        if (type !== 'loading') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }
    
    // Fungsi untuk menghapus pesan
    function clearMessage() {
        messageDiv.style.display = 'none';
        messageDiv.className = 'message';
    }
    
    // Fitur tambahan: Enter untuk submit
    passwordInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
});