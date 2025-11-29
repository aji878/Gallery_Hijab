<?php
session_start();
if(!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

// Handle logout
if(isset($_GET['logout'])) {
    session_destroy();
    header('Location: login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Admin - Galeri Hijab</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        :root {
            --primary-color: #a777e3;
            --secondary-color: #6e8efb;
            --accent-color: #ff6b8b;
            --text-dark: #333;
            --text-light: #666;
            --bg-light: #f8f9fa;
            --white: #ffffff;
            --border-color: #e0e0e0;
            --sidebar-width: 250px;
        }
        
        body {
            background: var(--bg-light);
            display: flex;
            min-height: 100vh;
        }
        
        /* Sidebar */
        .sidebar {
            width: var(--sidebar-width);
            background: var(--white);
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
            position: fixed;
            height: 100vh;
            overflow-y: auto;
            z-index: 1000;
        }
        
        .sidebar-header {
            padding: 25px 20px;
            border-bottom: 1px solid var(--border-color);
            text-align: center;
        }
        
        .sidebar-header h2 {
            color: var(--primary-color);
            font-size: 1.3rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .sidebar-menu {
            padding: 20px 0;
        }
        
        .menu-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 15px 25px;
            color: var(--text-dark);
            text-decoration: none;
            transition: all 0.3s;
            border-left: 3px solid transparent;
            cursor: pointer;
        }
        
        .menu-item:hover, .menu-item.active {
            background: rgba(167, 119, 227, 0.1);
            color: var(--primary-color);
            border-left-color: var(--primary-color);
        }
        
        .menu-item i {
            width: 20px;
            text-align: center;
        }
        
        /* Main Content */
        .main-content {
            flex: 1;
            margin-left: var(--sidebar-width);
            padding: 20px;
        }
        
        .header {
            background: var(--white);
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .header h1 {
            color: var(--text-dark);
            font-size: 1.5rem;
        }
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--text-light);
        }
        
        .logout-btn {
            background: var(--accent-color);
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            font-size: 0.9rem;
        }
        
        .logout-btn:hover {
            background: #ff4d7a;
        }
        
        /* Content Area */
        .content-area {
            background: var(--white);
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 25px;
            margin-bottom: 25px;
        }
        
        /* Stats Cards */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
        }
        
        .stat-card i {
            font-size: 2rem;
            margin-bottom: 15px;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .stat-label {
            opacity: 0.9;
            font-size: 0.9rem;
        }
        
        /* Forms */
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--text-dark);
        }
        
        .form-group input, .form-group select, .form-group textarea {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid var(--border-color);
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s;
        }
        
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
            border-color: var(--primary-color);
            outline: none;
        }
        
        .form-group textarea {
            resize: vertical;
            min-height: 100px;
        }
        
        .btn-primary {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            transition: background 0.3s;
        }
        
        .btn-primary:hover {
            background: var(--secondary-color);
        }
        
        /* Tables */
        .table-container {
            overflow-x: auto;
        }
        
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        
        .data-table th, .data-table td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }
        
        .data-table th {
            background: var(--bg-light);
            font-weight: 600;
            color: var(--text-dark);
        }
        
        .data-table tr:hover {
            background: var(--bg-light);
        }
        
        .action-buttons {
            display: flex;
            gap: 8px;
        }
        
        .btn-edit, .btn-delete {
            padding: 6px 12px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.8rem;
            text-decoration: none;
        }
        
        .btn-edit {
            background: #28a745;
            color: white;
        }
        
        .btn-delete {
            background: #dc3545;
            color: white;
        }
        
        .btn-edit:hover {
            background: #218838;
        }
        
        .btn-delete:hover {
            background: #c82333;
        }
        
        /* Image Preview */
        .image-preview {
            border: 2px dashed var(--border-color);
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin-top: 10px;
            background: var(--bg-light);
        }
        
        .image-preview img {
            max-width: 200px;
            max-height: 200px;
            border-radius: 5px;
            display: none;
        }
        
        .preview-text {
            color: var(--text-light);
            font-style: italic;
        }
        
        /* Notification */
        .notification {
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: none;
        }
        
        .notification.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .notification.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .sidebar {
                width: 70px;
            }
            
            .sidebar-header h2 span, .menu-item span {
                display: none;
            }
            
            .main-content {
                margin-left: 70px;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
            }
        }
        
        @media (max-width: 480px) {
            .sidebar {
                display: none;
            }
            
            .main-content {
                margin-left: 0;
            }
            
            .header {
                flex-direction: column;
                gap: 15px;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <!-- Sidebar -->
    <div class="sidebar">
        <div class="sidebar-header">
            <h2><i class="fas fa-scarf"></i> <span>Galeri Hijab</span></h2>
        </div>
        
        <div class="sidebar-menu">
            <a class="menu-item active" data-tab="dashboard">
                <i class="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
            </a>
            <a class="menu-item" data-tab="products">
                <i class="fas fa-tshirt"></i>
                <span>Kelola Produk</span>
            </a>
            <a class="menu-item" data-tab="orders">
                <i class="fas fa-shopping-bag"></i>
                <span>Pesanan</span>
            </a>
            <a class="menu-item" data-tab="add-product">
                <i class="fas fa-plus-circle"></i>
                <span>Tambah Produk</span>
            </a>
        </div>
    </div>
    
    <!-- Main Content -->
    <div class="main-content">
        <div class="header">
            <h1 id="pageTitle">Dashboard Admin</h1>
            <div class="user-info">
                <span>Halo, <?php echo $_SESSION['admin_username']; ?></span>
                <a href="?logout=true" class="logout-btn">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            </div>
        </div>
        
        <!-- Notification Area -->
        <div id="notification" class="notification"></div>
        
        <!-- Dashboard Tab -->
        <div id="dashboard" class="tab-content active">
            <div class="stats-grid">
                <div class="stat-card">
                    <i class="fas fa-tshirt"></i>
                    <div class="stat-number" id="totalProducts">0</div>
                    <div class="stat-label">Total Produk</div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-shopping-bag"></i>
                    <div class="stat-number" id="totalOrders">0</div>
                    <div class="stat-label">Total Pesanan</div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-money-bill-wave"></i>
                    <div class="stat-number" id="totalRevenue">Rp 0</div>
                    <div class="stat-label">Total Pendapatan</div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-clock"></i>
                    <div class="stat-number" id="pendingOrders">0</div>
                    <div class="stat-label">Pesanan Pending</div>
                </div>
            </div>
            
            <div class="content-area">
                <h2 style="margin-bottom: 20px;">Aktivitas Terbaru</h2>
                <div id="recentActivity">
                    <p>Memuat data...</p>
                </div>
            </div>
        </div>
        
        <!-- Kelola Produk Tab -->
        <div id="products" class="tab-content">
            <div class="content-area">
                <h2 style="margin-bottom: 20px;">Kelola Produk</h2>
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Gambar</th>
                                <th>Nama Produk</th>
                                <th>Harga</th>
                                <th>Kategori</th>
                                <th>Rating</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="productsTable">
                            <tr>
                                <td colspan="6" style="text-align: center;">Memuat data produk...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <!-- Pesanan Tab -->
        <div id="orders" class="tab-content">
            <div class="content-area">
                <h2 style="margin-bottom: 20px;">Kelola Pesanan</h2>
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>No. Pesanan</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Metode Bayar</th>
                                <th>Status</th>
                                <th>Tanggal</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="ordersTable">
                            <tr>
                                <td colspan="7" style="text-align: center;">Memuat data pesanan...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <!-- Tambah Produk Tab -->
        <div id="add-product" class="tab-content">
            <div class="content-area">
                <h2 style="margin-bottom: 20px;">Tambah Produk Baru</h2>
                <form id="addProductForm" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="productImage">Gambar Produk</label>
                        <input type="file" id="productImage" name="productImage" accept="image/*" required>
                        <div class="image-preview">
                            <img id="imagePreview" src="" alt="Preview">
                            <div class="preview-text" id="previewText">Gambar akan muncul di sini</div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="productName">Nama Produk</label>
                        <input type="text" id="productName" name="productName" required placeholder="Masukkan nama produk">
                    </div>
                    
                    <div class="form-group">
                        <label for="productPrice">Harga</label>
                        <input type="number" id="productPrice" name="productPrice" required placeholder="Masukkan harga">
                    </div>
                    
                    <div class="form-group">
                        <label for="productCategory">Kategori</label>
                        <select id="productCategory" name="productCategory" required>
                            <option value="">Pilih Kategori</option>
                            <option value="Hijab Segi Empat">Hijab Segi Empat</option>
                            <option value="Hijab Pashmina">Hijab Pashmina</option>
                            <option value="Hijab Instan">Hijab Instan</option>
                            <option value="Hijab Berpayet">Hijab Berpayet</option>
                            <option value="Setelan">Setelan</option>
                            <option value="Aksesoris">Aksesoris</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="productRating">Rating</label>
                        <input type="number" id="productRating" name="productRating" min="0" max="5" step="0.1" placeholder="0-5" value="4.5">
                    </div>
                    
                    <div class="form-group">
                        <label for="productDescription">Deskripsi Produk</label>
                        <textarea id="productDescription" name="productDescription" placeholder="Deskripsi lengkap produk..."></textarea>
                    </div>
                    
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-plus"></i> Tambah Produk
                    </button>
                </form>
            </div>
        </div>
    </div>

    <script>
        // Show notification
        function showNotification(message, type = 'success') {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.className = `notification ${type}`;
            notification.style.display = 'block';
            
            setTimeout(() => {
                notification.style.display = 'none';
            }, 5000);
        }

        // Tab Navigation
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all
                document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
                
                // Add active class to clicked
                this.classList.add('active');
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
                
                // Update page title
                document.getElementById('pageTitle').textContent = this.querySelector('span').textContent;
                
                // Load data if needed
                if(tabId === 'products') loadProducts();
                if(tabId === 'orders') loadOrders();
                if(tabId === 'dashboard') loadDashboardStats();
            });
        });
        
        // Image Preview
        document.getElementById('productImage').addEventListener('change', function(e) {
            const file = e.target.files[0];
            const preview = document.getElementById('imagePreview');
            const previewText = document.getElementById('previewText');
            
            if(file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                    previewText.style.display = 'none';
                }
                reader.readAsDataURL(file);
            } else {
                preview.style.display = 'none';
                previewText.style.display = 'block';
            }
        });
        
        // Form Submission
        document.getElementById('addProductForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menambahkan...';
            submitBtn.disabled = true;
            
            fetch('../api/products.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if(data.message && data.message.includes('created')) {
                    showNotification('Produk berhasil ditambahkan!', 'success');
                    this.reset();
                    document.getElementById('imagePreview').style.display = 'none';
                    document.getElementById('previewText').style.display = 'block';
                    loadProducts();
                } else {
                    showNotification('Gagal menambahkan produk: ' + data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Terjadi kesalahan saat menambahkan produk', 'error');
            })
            .finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });
        
        // Load Products
        function loadProducts() {
            fetch('../api/products.php')
            .then(response => response.json())
            .then(products => {
                const tableBody = document.getElementById('productsTable');
                tableBody.innerHTML = '';
                
                if(products.length === 0) {
                    tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Tidak ada produk</td></tr>';
                    return;
                }
                
                products.forEach(product => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>
                            ${product.image ? 
                                `<img src="../${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">` : 
                                '<i class="fas fa-image" style="font-size: 1.5rem; color: #ccc;"></i>'
                            }
                        </td>
                        <td>${product.name}</td>
                        <td>Rp ${parseInt(product.price).toLocaleString('id-ID')}</td>
                        <td>${product.category || '-'}</td>
                        <td>${product.rating ? product.rating + ' ⭐' : '-'}</td>
                        <td class="action-buttons">
                            <button class="btn-edit" onclick="editProduct(${product.id})">Edit</button>
                            <button class="btn-delete" onclick="deleteProduct(${product.id})">Hapus</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error loading products:', error);
                document.getElementById('productsTable').innerHTML = '<tr><td colspan="6" style="text-align: center;">Error memuat data</td></tr>';
            });
        }
        
        // Load Orders
        function loadOrders() {
            fetch('../api/orders.php')
            .then(response => response.json())
            .then(orders => {
                const tableBody = document.getElementById('ordersTable');
                tableBody.innerHTML = '';
                
                if(orders.length === 0) {
                    tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Tidak ada pesanan</td></tr>';
                    return;
                }
                
                orders.forEach(order => {
                    const statusColors = {
                        'pending': '#ffc107',
                        'paid': '#17a2b8', 
                        'shipped': '#007bff',
                        'delivered': '#28a745',
                        'cancelled': '#dc3545'
                    };
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${order.order_number}</td>
                        <td>
                            <strong>${order.customer_name}</strong><br>
                            <small>${order.customer_phone}</small><br>
                            <small style="color: #666;">${order.customer_address.substring(0, 50)}...</small>
                        </td>
                        <td>Rp ${parseInt(order.total_amount).toLocaleString('id-ID')}</td>
                        <td>${order.payment_method}</td>
                        <td>
                            <select onchange="updateOrderStatus(${order.id}, this.value)" style="padding: 5px; border-radius: 3px; border: 1px solid #ddd; background: ${statusColors[order.status] || '#6c757d'}; color: white;">
                                <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                                <option value="paid" ${order.status === 'paid' ? 'selected' : ''}>Paid</option>
                                <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                                <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                                <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                            </select>
                        </td>
                        <td>${new Date(order.created_at).toLocaleDateString('id-ID')}</td>
                        <td class="action-buttons">
                            <button class="btn-edit" onclick="viewOrder(${order.id})">Detail</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error loading orders:', error);
                document.getElementById('ordersTable').innerHTML = '<tr><td colspan="7" style="text-align: center;">Error memuat data</td></tr>';
            });
        }
        
        // Load Dashboard Stats
        function loadDashboardStats() {
            // Load products count
            fetch('../api/products.php')
            .then(response => response.json())
            .then(products => {
                document.getElementById('totalProducts').textContent = products.length;
            });
            
            // Load orders count and stats
            fetch('../api/orders.php')
            .then(response => response.json())
            .then(orders => {
                document.getElementById('totalOrders').textContent = orders.length;
                
                const pendingOrders = orders.filter(order => order.status === 'pending').length;
                document.getElementById('pendingOrders').textContent = pendingOrders;
                
                const totalRevenue = orders
                    .filter(order => order.status === 'delivered')
                    .reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
                document.getElementById('totalRevenue').textContent = 'Rp ' + totalRevenue.toLocaleString('id-ID');
                
                // Recent activity
                const recentActivity = document.getElementById('recentActivity');
                const recentOrders = orders.slice(0, 5);
                
                if(recentOrders.length === 0) {
                    recentActivity.innerHTML = '<p>Belum ada pesanan</p>';
                } else {
                    let activityHTML = '';
                    recentOrders.forEach(order => {
                        const statusColors = {
                            'pending': '#ffc107',
                            'paid': '#17a2b8',
                            'shipped': '#007bff', 
                            'delivered': '#28a745',
                            'cancelled': '#dc3545'
                        };
                        
                        activityHTML += `
                            <div style="padding: 15px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                                <div style="flex: 1;">
                                    <strong>${order.customer_name}</strong> - ${order.order_number}
                                    <br><small>${order.payment_method} - Rp ${parseInt(order.total_amount).toLocaleString('id-ID')}</small>
                                    <br><small style="color: #666;">${order.customer_address.substring(0, 60)}...</small>
                                </div>
                                <span style="background: ${statusColors[order.status] || '#6c757d'}; color: white; padding: 6px 12px; border-radius: 20px; font-size: 0.8rem;">
                                    ${order.status}
                                </span>
                            </div>
                        `;
                    });
                    recentActivity.innerHTML = activityHTML;
                }
            })
            .catch(error => {
                console.error('Error loading dashboard stats:', error);
            });
        }
        
        // Initialize dashboard
        loadDashboardStats();
        
        // Placeholder functions
        function editProduct(id) {
            showNotification('Fitur edit produk dalam pengembangan', 'info');
        }
        
        function deleteProduct(id) {
            if(confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
                showNotification('Fitur hapus produk dalam pengembangan', 'info');
            }
        }
        
        function updateOrderStatus(orderId, status) {
            fetch('../api/orders.php', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: orderId,
                    status: status
                })
            })
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    showNotification('Status pesanan berhasil diupdate', 'success');
                    loadDashboardStats();
                } else {
                    showNotification('Gagal update status: ' + data.message, 'error');
                loadOrders(); // Reload to reset select
                }
            })
            .catch(error => {
                showNotification('Error update status: ' + error, 'error');
                loadOrders(); // Reload to reset select
            });
        }
        
        function viewOrder(id) {
            showNotification('Fitur detail pesanan dalam pengembangan', 'info');
        }
    </script>
</body>
</html>