// Data storage
let userData = {
    name: "galeri hijab",
    email: "user@example.com",
    phone: "+62 812-3456-7890",
    address: "Jl. semuli jaya"
};

let favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
let orders = JSON.parse(localStorage.getItem('userOrders')) || [];

// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeFavorites();
    initializeOrders();
    initializeProfile();
    updateFavoriteCount();
    
    // Load sample orders if empty
    if (orders.length === 0) {
        loadSampleOrders();
    }
});

// FAVORITE FUNCTIONS
function initializeFavorites() {
    // Add click event to favorit links
    const favoriteLinks = document.querySelectorAll('#favorit, #favorit-dropdown');
    favoriteLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showFavoriteProducts();
        });
    });

    // Add click event to all wishlist buttons
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            toggleFavorite(productCard);
        });
    });
}

function toggleFavorite(productCard) {
    const productImage = productCard.querySelector('img').src;
    const productTitle = productCard.querySelector('h3').textContent;
    const productPrice = productCard.querySelector('.product-price').textContent;
    
    const product = {
        image: productImage,
        title: productTitle,
        price: productPrice,
        id: generateProductId(productTitle)
    };

    const heartIcon = productCard.querySelector('.wishlist-btn i');
    
    // Check if product is already in favorites
    const existingIndex = favoriteProducts.findIndex(p => p.id === product.id);
    
    if (existingIndex > -1) {
        // Remove from favorites
        favoriteProducts.splice(existingIndex, 1);
        heartIcon.classList.remove('fas');
        heartIcon.classList.add('far');
        showNotification('Produk dihapus dari favorit', 'info');
    } else {
        // Add to favorites
        favoriteProducts.push(product);
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas');
        showNotification('Produk ditambahkan ke favorit', 'success');
    }
    
    // Update localStorage
    localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
    updateFavoriteCount();
}

function showFavoriteProducts() {
    const modal = createModal('favorite');
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <h3><i class="fas fa-heart" style="color: #ff4757;"></i> Produk Favorit Saya</h3>
            <div class="favorite-content">
                ${favoriteProducts.length === 0 ? 
                    `<div class="empty-state">
                        <i class="far fa-heart" style="color: #ddd;"></i>
                        <h4>Belum ada produk favorit</h4>
                        <p>Produk yang Anda sukai akan muncul di sini</p>
                        <button class="btn-primary" onclick="closeModal('favorite')">Mulai Belanja</button>
                    </div>` :
                    `<div class="favorite-grid">
                        ${favoriteProducts.map(product => `
                            <div class="favorite-item">
                                <div class="favorite-image">
                                    <img src="${product.image}" alt="${product.title}">
                                </div>
                                <div class="favorite-info">
                                    <h4>${product.title}</h4>
                                    <p class="favorite-price">${product.price}</p>
                                    <div class="favorite-actions">
                                        <button class="btn-primary" onclick="addToCartFromFavorite('${product.id}')">Tambah ke Keranjang</button>
                                        <button class="btn-secondary" onclick="removeFromFavorites('${product.id}')">Hapus</button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>`
                }
            </div>
            <div class="modal-actions">
                <button class="btn-secondary" onclick="closeModal('favorite')">Tutup</button>
            </div>
        </div>
    `;
}

function removeFromFavorites(productId) {
    favoriteProducts = favoriteProducts.filter(product => product.id !== productId);
    localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
    updateFavoriteCount();
    showFavoriteProducts(); // Refresh view
    showNotification('Produk dihapus dari favorit', 'info');
}

function addToCartFromFavorite(productId) {
    const product = favoriteProducts.find(p => p.id === productId);
    if (product) {
        showNotification(`${product.title} ditambahkan ke keranjang`, 'success');
        // Here you can add actual cart functionality
    }
}

// ORDERS FUNCTIONS
function initializeOrders() {
    const ordersLink = document.querySelector('.orders-link');
    if (ordersLink) {
        ordersLink.addEventListener('click', function(e) {
            e.preventDefault();
            showMyOrders();
        });
    }
}

function loadSampleOrders() {
    orders = [
        {
            id: 'GH202412001',
            date: '15 Des 2024',
            status: 'delivered',
            items: [
                {
                    image: 'image/hijab anak.jpeg',
                    title: 'Hijab anak 3-1',
                    quantity: 2,
                    price: 'Rp 40.000'
                }
            ],
            subtotal: 'Rp 80.000',
            shippingCost: 'Rp 15.000',
            total: 'Rp 95.000',
            customerName: 'galeri hijab',
            customerPhone: '+62 812-3456-7890',
            customerAddress: 'Jl. semuli jaya'
        },
        {
            id: 'GH202412002',
            date: '10 Des 2024',
            status: 'shipped',
            items: [
                {
                    image: 'image/hijab dagu malay.jpeg',
                    title: 'Hijab dagu malay',
                    quantity: 1,
                    price: 'Rp 90.000'
                }
            ],
            subtotal: 'Rp 90.000',
            shippingCost: 'Rp 15.000',
            total: 'Rp 105.000',
            customerName: 'galeri hijab',
            customerPhone: '+62 812-3456-7890',
            customerAddress: 'Jl. semuli jaya'
        }
    ];
    localStorage.setItem('userOrders', JSON.stringify(orders));
}

function showMyOrders() {
    const modal = createModal('orders');
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px;">
            <h3><i class="fas fa-shopping-bag"></i> Pesanan Saya</h3>
            <div class="orders-content">
                ${orders.length === 0 ? 
                    `<div class="empty-state">
                        <i class="fas fa-shopping-bag"></i>
                        <h4>Belum ada pesanan</h4>
                        <p>Pesanan Anda akan muncul di sini</p>
                        <button class="btn-primary" onclick="closeModal('orders')">Mulai Belanja</button>
                    </div>` :
                    `<div class="orders-list">
                        ${orders.map(order => `
                            <div class="order-card">
                                <div class="order-header">
                                    <div class="order-info">
                                        <h4>Order #${order.id}</h4>
                                        <span class="order-date">${order.date}</span>
                                    </div>
                                    <div class="order-status ${order.status}">
                                        ${getStatusText(order.status)}
                                    </div>
                                </div>
                                <div class="order-items">
                                    ${order.items.map(item => `
                                        <div class="order-item">
                                            <img src="${item.image}" alt="${item.title}">
                                            <div class="item-info">
                                                <h5>${item.title}</h5>
                                                <span>${item.quantity} x ${item.price}</span>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                                <div class="order-footer">
                                    <div class="order-total">
                                        Total: <strong>${order.total}</strong>
                                    </div>
                                    <div class="order-actions">
                                        <button class="btn-secondary" onclick="viewOrderDetail('${order.id}')">Detail</button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>`
                }
            </div>
            <div class="modal-actions">
                <button class="btn-secondary" onclick="closeModal('orders')">Tutup</button>
            </div>
        </div>
    `;
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Menunggu Pembayaran',
        'paid': 'Dibayar',
        'processing': 'Diproses',
        'shipped': 'Dikirim',
        'delivered': 'Selesai',
        'cancelled': 'Dibatalkan'
    };
    return statusMap[status] || status;
}

function viewOrderDetail(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const modal = createModal('orderDetail');
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <h3><i class="fas fa-file-invoice"></i> Detail Pesanan #${order.id}</h3>
            <div class="order-detail">
                <div class="detail-section">
                    <h4>Status Pesanan</h4>
                    <div class="order-status ${order.status}">
                        ${getStatusText(order.status)}
                    </div>
                </div>

                <div class="detail-section">
                    <h4>Items Pesanan</h4>
                    <div class="order-items-detail">
                        ${order.items.map(item => `
                            <div class="order-item-detail">
                                <img src="${item.image}" alt="${item.title}">
                                <div class="item-detail-info">
                                    <h5>${item.title}</h5>
                                    <p>Jumlah: ${item.quantity}</p>
                                    <p>Harga: ${item.price}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="detail-section">
                    <h4>Informasi Pengiriman</h4>
                    <div class="shipping-info">
                        <p><strong>Nama:</strong> ${order.customerName}</p>
                        <p><strong>Telepon:</strong> ${order.customerPhone}</p>
                        <p><strong>Alamat:</strong> ${order.customerAddress}</p>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>Ringkasan Pembayaran</h4>
                    <div class="payment-summary">
                        <div class="summary-row">
                            <span>Subtotal:</span>
                            <span>${order.subtotal}</span>
                        </div>
                        <div class="summary-row">
                            <span>Ongkos Kirim:</span>
                            <span>${order.shippingCost}</span>
                        </div>
                        <div class="summary-row total">
                            <span>Total:</span>
                            <span>${order.total}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn-secondary" onclick="closeModal('orderDetail')">Tutup</button>
            </div>
        </div>
    `;
}

// PROFILE FUNCTIONS
function initializeProfile() {
    const profileLink = document.querySelector('.profile-link');
    if (profileLink) {
        profileLink.addEventListener('click', function(e) {
            e.preventDefault();
            showMyProfile();
        });
    }
}

function showMyProfile() {
    const modal = createModal('profile');
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <h3><i class="fas fa-user"></i> Profil Saya</h3>
            <div class="profile-content">
                <div class="profile-header">
                    <div class="profile-avatar">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=6e8efb&color=fff&size=120" 
                             alt="${userData.name}">
                    </div>
                    <div class="profile-info">
                        <h4>${userData.name}</h4>
                        <p>Member sejak 2024</p>
                    </div>
                </div>

                <form id="profileForm" class="profile-form">
                    <div class="form-group">
                        <label for="profileName">Nama Lengkap</label>
                        <input type="text" id="profileName" value="${userData.name}" required>
                    </div>

                    <div class="form-group">
                        <label for="profileEmail">Email</label>
                        <input type="email" id="profileEmail" value="${userData.email}" required>
                    </div>

                    <div class="form-group">
                        <label for="profilePhone">No. Telepon</label>
                        <input type="tel" id="profilePhone" value="${userData.phone}" required>
                    </div>

                    <div class="form-group">
                        <label for="profileAddress">Alamat</label>
                        <textarea id="profileAddress" rows="3" required>${userData.address}</textarea>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Simpan Perubahan</button>
                        <button type="button" class="btn-secondary" onclick="closeModal('profile')">Batal</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // Add form submit event
    const profileForm = document.getElementById('profileForm');
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveProfileChanges();
    });
}

function saveProfileChanges() {
    const name = document.getElementById('profileName').value;
    const email = document.getElementById('profileEmail').value;
    const phone = document.getElementById('profilePhone').value;
    const address = document.getElementById('profileAddress').value;

    userData = { name, email, phone, address };
    
    // Update user profile in header
    const userNameElement = document.querySelector('.user-profile span');
    if (userNameElement) {
        userNameElement.textContent = name;
    }

    // Update avatar
    const avatarImg = document.querySelector('.user-profile img');
    if (avatarImg) {
        avatarImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6e8efb&color=fff`;
    }

    showNotification('Profil berhasil diperbarui', 'success');
    closeModal('profile');
}

// UTILITY FUNCTIONS
function createModal(type) {
    // Remove existing modal of same type
    const existingModal = document.getElementById(`${type}Modal`);
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = `${type}Modal`;
    modal.className = 'modal active';
    document.body.appendChild(modal);
    
    // Add click outside to close
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal(type);
        }
    });

    return modal;
}

function closeModal(type) {
    const modal = document.getElementById(`${type}Modal`);
    if (modal) {
        modal.remove();
    }
}

function generateProductId(title) {
    return title.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

function updateFavoriteCount() {
    const favoriteCount = document.querySelector('.favorite-count');
    if (favoriteCount) {
        favoriteCount.textContent = favoriteProducts.length;
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}