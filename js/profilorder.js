// Data dummy untuk pesanan
const dummyOrders = [
    {
        id: 'GH202412345',
        date: '15 Des 2024 10:30',
        status: 'shipping',
        products: [
            { name: 'Hijab Segitiga Paris', price: 55000, qty: 1, image: 'image/segitiga paris.jpeg' },
            { name: 'Kaos Kaki Citra', price: 5000, qty: 2, image: 'image/kaos kaki.jpeg' }
        ],
        customer: {
            name: 'Galeri Hijab',
            phone: '+62 812-3456-7890',
            address: 'Jl. Semuli Jaya No. 123, Lampung Utara'
        },
        shipping: {
            method: 'JNE Reguler',
            tracking: 'JNE1234567890',
            estimate: '2-3 hari kerja',
            cost: 15000
        },
        payment: {
            method: 'QRIS',
            status: 'paid',
            total: 80000
        }
    },
    {
        id: 'GH202412344',
        date: '14 Des 2024 14:20',
        status: 'completed',
        products: [
            { name: 'Hijab Pashmina Kaos', price: 55000, qty: 1, image: 'image/pashmina kaos.jpeg' }
        ],
        customer: {
            name: 'Galeri Hijab',
            phone: '+62 812-3456-7890',
            address: 'Jl. Semuli Jaya No. 123, Lampung Utara'
        },
        shipping: {
            method: 'JNE Reguler',
            tracking: 'JNE1234567889',
            estimate: '2-3 hari kerja',
            cost: 15000
        },
        payment: {
            method: 'Transfer Bank',
            status: 'paid',
            total: 70000
        }
    },
    {
        id: 'GH202412343',
        date: '13 Des 2024 09:45',
        status: 'pending',
        products: [
            { name: 'Hijab Bergo Maryam', price: 55000, qty: 1, image: 'image/bergo maryam.jpeg' },
            { name: 'Hijab Sazi', price: 55000, qty: 1, image: 'image/hijab sazi.jpeg' }
        ],
        customer: {
            name: 'Galeri Hijab',
            phone: '+62 812-3456-7890',
            address: 'Jl. Semuli Jaya No. 123, Lampung Utara'
        },
        shipping: {
            method: 'JNE Reguler',
            tracking: null,
            estimate: '2-3 hari kerja',
            cost: 15000
        },
        payment: {
            method: 'QRIS',
            status: 'pending',
            total: 125000
        }
    },
    {
        id: 'GH202412342',
        date: '10 Des 2024 16:10',
        status: 'processing',
        products: [
            { name: 'Gamis Set Hijab Rayon', price: 55000, qty: 1, image: 'image/gamis set hijab rayon.jpeg' }
        ],
        customer: {
            name: 'Galeri Hijab',
            phone: '+62 812-3456-7890',
            address: 'Jl. Semuli Jaya No. 123, Lampung Utara'
        },
        shipping: {
            method: 'JNE Reguler',
            tracking: null,
            estimate: '2-3 hari kerja',
            cost: 15000
        },
        payment: {
            method: 'COD',
            status: 'pending',
            total: 70000
        }
    }
];

// Data profil pengguna
let userProfile = {
    name: 'Galeri Hijab',
    email: 'galerihijab@gmail.com',
    phone: '+62 812-3456-7890',
    address: 'Jl. Semuli Jaya No. 123, RT/RW Semuli Jaya, Lampung Utara',
    joinDate: 'Januari 2024',
    photo: 'https://ui-avatars.com/api/?name=Galeri+Hijab&background=6e8efb&color=fff&size=120',
    stats: {
        totalOrders: 12,
        wishlist: 8,
        points: 1250,
        successOrders: 10
    }
};

// Fungsi untuk membuka modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.classList.add('no-scroll');
        
        // Jika membuka modal pesanan, render pesanan
        if (modalId === 'ordersModal') {
            renderOrders();
        }
        // Jika membuka modal profil, render profil
        else if (modalId === 'profileModal') {
            updateProfileDisplay();
        }
    }
}

// Fungsi untuk menutup modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
}

// Fungsi untuk render pesanan
function renderOrders() {
    // Clear existing orders
    const orderContainers = ['all', 'pending', 'processing', 'shipping', 'completed', 'cancelled'];
    
    orderContainers.forEach(status => {
        const container = document.getElementById(`${status}OrdersList`);
        if (container) {
            container.innerHTML = '';
        }
    });
    
    // Render each order
    dummyOrders.forEach(order => {
        const orderHTML = createOrderHTML(order);
        
        // Add to "all" tab
        document.getElementById('allOrdersList').innerHTML += orderHTML;
        
        // Add to specific status tab
        const statusContainer = document.getElementById(`${order.status}OrdersList`);
        if (statusContainer) {
            statusContainer.innerHTML += orderHTML;
        }
    });
    
    // Show empty state if no orders
    showEmptyOrderState();
}

// Fungsi untuk membuat HTML pesanan
function createOrderHTML(order) {
    const statusText = getStatusText(order.status);
    const total = order.payment.total.toLocaleString();
    
    const productsHTML = order.products.map(product => `
        <div class="order-product-mini">
            <img src="${product.image || 'image/placeholder.jpg'}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/50'">
            <div class="order-product-info">
                <h5>${product.name}</h5>
                <div class="price">Rp ${product.price.toLocaleString()} x ${product.qty}</div>
            </div>
        </div>
    `).join('');
    
    return `
        <div class="order-item" data-order-id="${order.id}">
            <div class="order-header">
                <div class="order-id">No. Pesanan: ${order.id}</div>
                <div class="order-date">${order.date}</div>
                <div class="order-status">
                    Status: <span class="status-badge ${order.status}">
                        ${statusText}
                    </span>
                </div>
            </div>
            
            <div class="order-products-mini">
                ${productsHTML}
            </div>
            
            <div class="order-total">
                Total: <strong>Rp ${total}</strong>
            </div>
            
            <div class="order-actions-mini">
                <button class="btn-small btn-primary view-order-detail" data-order-id="${order.id}">
                    <i class="fas fa-eye"></i> Detail
                </button>
                ${order.status === 'pending' ? `
                    <button class="btn-small btn-warning pay-order" data-order-id="${order.id}">
                        <i class="fas fa-credit-card"></i> Bayar
                    </button>
                ` : ''}
                ${order.status === 'shipping' ? `
                    <button class="btn-small btn-success track-order" data-order-id="${order.id}">
                        <i class="fas fa-truck"></i> Lacak
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}

// Fungsi untuk menampilkan status kosong
function showEmptyOrderState() {
    const statusTabs = ['pending', 'processing', 'shipping', 'completed', 'cancelled'];
    
    statusTabs.forEach(status => {
        const container = document.getElementById(`${status}OrdersList`);
        if (container && container.children.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-box-open"></i>
                    <h4>Tidak ada pesanan</h4>
                    <p>Belum ada pesanan dengan status ini</p>
                </div>
            `;
        }
    });
}

// Fungsi untuk mendapatkan teks status
function getStatusText(status) {
    const statusMap = {
        pending: 'Menunggu Pembayaran',
        processing: 'Diproses',
        shipping: 'Dikirim',
        completed: 'Selesai',
        cancelled: 'Dibatalkan'
    };
    return statusMap[status] || status;
}

// Fungsi untuk membuka modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.classList.add('no-scroll');
        
        // Jika membuka modal pesanan, render pesanan
        if (modalId === 'ordersModal') {
            renderOrders();
        }
        // Jika membuka modal profil, render profil
        else if (modalId === 'profileModal') {
            updateProfileDisplay();
        }
    }
}

// Fungsi untuk menutup modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
}

// Fungsi untuk mengubah foto profil
function changeProfilePhoto() {
    openModal('photoUploadModal');
}

// Setup photo upload functionality
function setupPhotoUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const photoInput = document.getElementById('photoInput');
    const previewArea = document.getElementById('previewArea');
    const photoPreview = document.getElementById('photoPreview');
    const savePhotoBtn = document.getElementById('savePhotoBtn');
    
    if (!uploadArea || !photoInput) return;
    
    // Click upload area to trigger file input
    uploadArea.addEventListener('click', () => {
        photoInput.click();
    });
    
    // Browse button
    document.getElementById('browsePhotoBtn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        photoInput.click();
    });
    
    // Handle file selection
    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file type
        if (!file.type.match('image.*')) {
            alert('Hanya file gambar yang diperbolehkan!');
            return;
        }
        
        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('Ukuran file maksimal 2MB!');
            return;
        }
        
        // Preview image
        const reader = new FileReader();
        reader.onload = function(e) {
            photoPreview.src = e.target.result;
            uploadArea.style.display = 'none';
            previewArea.style.display = 'block';
            savePhotoBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    });
    
    // Remove photo
    document.getElementById('removePhotoBtn')?.addEventListener('click', () => {
        photoPreview.src = '';
        previewArea.style.display = 'none';
        uploadArea.style.display = 'block';
        savePhotoBtn.disabled = true;
        photoInput.value = '';
    });
    
    // Save photo
    savePhotoBtn?.addEventListener('click', () => {
        if (photoPreview.src) {
            userProfile.photo = photoPreview.src;
            document.getElementById('profileImage').src = photoPreview.src;
            alert('Foto profil berhasil diubah!');
            closeModal('photoUploadModal');
            resetPhotoUpload();
        }
    });
    
    // Close upload modal buttons
    document.getElementById('closeUploadModal')?.addEventListener('click', () => {
        closeModal('photoUploadModal');
        resetPhotoUpload();
    });
    
    document.getElementById('closeUploadModalBtn')?.addEventListener('click', () => {
        closeModal('photoUploadModal');
        resetPhotoUpload();
    });
    
    // Function to reset photo upload
    function resetPhotoUpload() {
        photoPreview.src = '';
        previewArea.style.display = 'none';
        uploadArea.style.display = 'block';
        savePhotoBtn.disabled = true;
        photoInput.value = '';
    }
}

// Fungsi untuk update tampilan profil
function updateProfileDisplay() {
    // Update profile info
    document.getElementById('profileName').textContent = userProfile.name;
    document.getElementById('profileEmail').textContent = userProfile.email;
    document.getElementById('profilePhone').textContent = userProfile.phone;
    document.getElementById('joinDate').textContent = userProfile.joinDate;
    
    const profileImage = document.getElementById('profileImage');
    if (profileImage) {
        profileImage.src = userProfile.photo;
    }
    
    // Update form fields
    const editName = document.getElementById('editName');
    const editEmail = document.getElementById('editEmail');
    const editPhone = document.getElementById('editPhone');
    const editAddress = document.getElementById('editAddress');
    
    if (editName) editName.value = userProfile.name;
    if (editEmail) editEmail.value = userProfile.email;
    if (editPhone) editPhone.value = userProfile.phone;
    if (editAddress) editAddress.value = userProfile.address;
    
    // Update stats
    const totalOrders = document.getElementById('totalOrders');
    const totalWishlist = document.getElementById('totalWishlist');
    const memberPoints = document.getElementById('memberPoints');
    const successOrders = document.getElementById('successOrders');
    
    if (totalOrders) totalOrders.textContent = userProfile.stats.totalOrders;
    if (totalWishlist) totalWishlist.textContent = userProfile.stats.wishlist;
    if (memberPoints) memberPoints.textContent = userProfile.stats.points.toLocaleString();
    if (successOrders) successOrders.textContent = userProfile.stats.successOrders;
}

// Event listener untuk tombol "Mulai Belanja"
function setupStartShoppingButtons() {
    // Tombol "Mulai Belanja" di modal pesanan kosong
    document.addEventListener('click', function(e) {
        if (e.target.closest('.empty-state .btn-primary')) {
            const emptyState = e.target.closest('.empty-state');
            if (emptyState) {
                const modal = emptyState.closest('.modal');
                if (modal) {
                    const modalId = modal.id;
                    closeModal(modalId);
                }
            }
        }
    });
}

// Event listener untuk tombol "Batal" di profil
function setupCancelButtons() {
    // Tombol "Batal" di form profil (jika ada)
    const cancelProfileEdit = document.getElementById('cancelProfileEdit');
    if (cancelProfileEdit) {
        cancelProfileEdit.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal('profileModal');
        });
    }
}

// Inisialisasi semua fungsi
document.addEventListener('DOMContentLoaded', function() {
    // Setup photo upload
    setupPhotoUpload();
    
    // Setup tombol "Mulai Belanja"
    setupStartShoppingButtons();
    
    // Setup tombol "Batal"
    setupCancelButtons();
    
    // Event listener untuk tombol "Ubah Foto"
    document.getElementById('changePhotoBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        changeProfilePhoto();
    });
    
    // Close modal buttons
    document.getElementById('closeProfileModal')?.addEventListener('click', () => closeModal('profileModal'));
    document.getElementById('closeOrdersModal')?.addEventListener('click', () => closeModal('ordersModal'));
    document.getElementById('closeOrderDetail')?.addEventListener('click', () => closeModal('orderDetailModal'));
    document.getElementById('closeOrderDetailBtn')?.addEventListener('click', () => closeModal('orderDetailModal'));
    document.getElementById('closeCancelModal')?.addEventListener('click', () => closeModal('cancelOrderModal'));
    document.getElementById('cancelCancel')?.addEventListener('click', () => closeModal('cancelOrderModal'));
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal[style*="display: flex"]');
            openModals.forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
    
    // Event delegation untuk order actions
    document.addEventListener('click', function(e) {
        // View order detail
        if (e.target.closest('.view-order-detail')) {
            e.preventDefault();
            const orderId = e.target.closest('.view-order-detail').getAttribute('data-order-id');
            alert(`Detail pesanan ${orderId} akan ditampilkan`);
            // Anda bisa tambahkan fungsi untuk menampilkan detail pesanan di sini
        }
        
        // Pay order
        if (e.target.closest('.pay-order')) {
            e.preventDefault();
            const orderId = e.target.closest('.pay-order').getAttribute('data-order-id');
            alert(`Membuka halaman pembayaran untuk pesanan ${orderId}`);
        }
        
        // Track order
        if (e.target.closest('.track-order')) {
            e.preventDefault();
            const orderId = e.target.closest('.track-order').getAttribute('data-order-id');
            alert(`Membuka halaman tracking untuk pesanan ${orderId}`);
        }
    });
});