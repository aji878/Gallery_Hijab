document.addEventListener('DOMContentLoaded', function () {
    // ==================== ELEMENTS ====================
    // Logout Elements
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutModal = document.getElementById('logoutModal');
    const confirmLogout = document.getElementById('confirmLogout');
    const cancelLogout = document.getElementById('cancelLogout');

    // Cart Elements
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    const cartCount = document.querySelector('.cart-count');

    // Product Detail Elements
    const productDetailModal = document.getElementById('productDetailModal');
    const detailClose = document.getElementById('detailClose');
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');
    const detailImage = document.getElementById('detailImage');
    const detailTitle = document.getElementById('detailTitle');
    const detailPrice = document.getElementById('detailPrice');
    const detailRating = document.getElementById('detailRating');
    const detailDescription = document.getElementById('detailDescription');
    const detailSpecs = document.getElementById('detailSpecs');
    const quantityDecrease = document.getElementById('quantityDecrease');
    const quantityIncrease = document.getElementById('quantityIncrease');
    const quantityDisplay = document.getElementById('quantityDisplay');
    const buyNowBtn = document.getElementById('buyNowBtn');
    const addToCartDetailBtn = document.getElementById('addToCartDetailBtn');

    // Add Product Elements
    const addProductModal = document.getElementById('addProductModal');
    const floatingAddBtn = document.getElementById('floatingAddBtn');
    const addProductForm = document.getElementById('addProductForm');
    const cancelAddProduct = document.getElementById('cancelAddProduct');
    const productImageInput = document.getElementById('productImage');
    const imagePreview = document.getElementById('imagePreview');
    const previewImage = document.getElementById('previewImage');
    const previewText = document.getElementById('previewText');
    const productTitleInput = document.getElementById('productTitle');
    const productPriceInput = document.getElementById('productPrice');
    const productDescriptionInput = document.getElementById('productDescription');
    const specsContainer = document.getElementById('specsContainer');
    const addSpecBtn = document.getElementById('addSpecBtn');

    // Search Elements
    const searchBox = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');

    // ==================== PRODUCT DATA ====================
    const productDetails = {
        'hijab-anak-3-1': {
            title: 'Hijab anak 3-1',
            price: 'Rp 45.000',
            image: 'image/hijab anak.jpeg',
            rating: 4.5,
            reviews: 128,
            description: 'Hijab praktis untuk anak dengan model 3 in 1 yang mudah dipakai. Terbuat dari bahan berkualitas tinggi yang nyaman untuk kulit sensitif anak-anak.',
            specs: [
                'Bahan: Katun Jersey Premium',
                'Ukuran: One Size Fit All (3-12 tahun)',
                'Warna: Tersedia 12 pilihan warna',
                'Perawatan: Bisa dicuci mesin',
                'Fitur: Anti iritasi, mudah dipakai'
            ]
        },
        'hijab-dagu-malay': {
            title: 'Hijab dagu malay',
            price: 'Rp 89.000',
            image: 'image/hijab dagu malay.jpeg',
            rating: 4,
            reviews: 95,
            description: 'Hijab bergaya Malay dengan desain menutup dagu yang elegan. Cocok untuk acara formal maupun casual.',
            specs: [
                'Bahan: Voal Premium',
                'Ukuran: 110cm x 110cm',
                'Warna: Tersedia 8 varian warna pastel',
                'Perawatan: Dry clean recommended',
                'Fitur: Tidak mudah kusut, draping natural'
            ]
        },
        'hijab-segitiga-instan-jersy': {
            title: 'Hijab segitiga instan jersy',
            price: 'Rp 65.000',
            image: 'image/segitiga instan jersy.jpeg',
            rating: 5,
            reviews: 156,
            description: 'Hijab instan segitiga dari bahan jersey yang sangat nyaman dan praktis. Tidak perlu lagi repot memasang hijab.',
            specs: [
                'Bahan: Jersey Premium',
                'Ukuran: One Size',
                'Warna: 15 pilihan warna solid',
                'Perawatan: Bisa dicuci mesin, tidak perlu disetrika',
                'Fitur: Ringan, stretch, dan tidak gerah'
            ]
        }
    };

    // ==================== LOGOUT FUNCTIONALITY ====================
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (logoutModal) logoutModal.style.display = 'flex';
        });
    }

    if (confirmLogout) {
        confirmLogout.addEventListener('click', function () {
            showNotification('Anda telah berhasil keluar', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            if (logoutModal) logoutModal.style.display = 'none';
        });
    }

    if (cancelLogout) {
        cancelLogout.addEventListener('click', function () {
            if (logoutModal) logoutModal.style.display = 'none';
        });
    }

    window.addEventListener('click', function (e) {
        if (e.target === logoutModal) {
            logoutModal.style.display = 'none';
        }
        if (e.target === addProductModal) {
            addProductModal.style.display = 'none';
        }
    });

    // ==================== CART FUNCTIONALITY ====================
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;

            let currentCount = parseInt(cartCount.textContent);
            cartCount.textContent = currentCount + 1;

            showNotification(`${productName} ditambahkan ke keranjang`, 'success');

            cartCount.parentElement.classList.add('pulse');
            setTimeout(() => {
                cartCount.parentElement.classList.remove('pulse');
            }, 500);

            updateCartCount(currentCount + 1);
        });
    });

    // ==================== WISHLIST FUNCTIONALITY ====================
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function () {
            const icon = this.querySelector('i');
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;

            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.style.color = '#ff6b8b';
                showNotification(`${productName} ditambahkan ke favorit`, 'success');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.style.color = '';
                showNotification(`${productName} dihapus dari favorit`, 'info');
            }
        });
    });

    // ==================== SEARCH FUNCTIONALITY ====================
    if (searchButton) {
        searchButton.addEventListener('click', function () {
            performSearch();
        });
    }

    if (searchBox) {
        searchBox.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    function performSearch() {
        const searchTerm = searchBox.value.trim();
        if (searchTerm) {
            showNotification(`Mencari: ${searchTerm}`, 'info');
        }
    }

    // ==================== PRODUCT DETAIL FUNCTIONALITY ====================
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('h3').textContent.trim();
            const productKey = generateProductKey(productTitle);
            showProductDetail(productKey, productCard);
        });
    });

    function generateProductKey(title) {
        return title.toLowerCase()
            .replace(/[^\w\s-]/gi, '')
            .replace(/\s+/g, '-')
            .trim();
    }

    function showProductDetail(productKey, productCard) {
        const product = productDetails[productKey];

        if (product) {
            detailImage.src = product.image;
            detailImage.alt = product.title;
            detailTitle.textContent = product.title;
            detailPrice.textContent = product.price;
            detailDescription.textContent = product.description;
            setRatingStars(product.rating, product.reviews);
            setProductSpecs(product.specs);
        } else {
            const title = productCard.querySelector('h3').textContent;
            const price = productCard.querySelector('.product-price').textContent;
            const image = productCard.querySelector('img').src;

            detailImage.src = image;
            detailTitle.textContent = title;
            detailPrice.textContent = price;
            detailDescription.textContent = 'Produk berkualitas tinggi dengan bahan terbaik. Cocok untuk berbagai occasions dan nyaman dipakai seharian.';
            setRatingStars(4, 50);
            setProductSpecs([
                'Bahan: Premium Quality',
                'Ukuran: Standard Size',
                'Warna: Various Colors Available',
                'Perawatan: Easy to Maintain',
                'Kualitas: Original & Branded'
            ]);
        }

        quantityDisplay.textContent = '1';
        currentQuantity = 1;
        productDetailModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function setRatingStars(rating, reviews) {
        detailRating.innerHTML = '';

        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            const star = document.createElement('i');
            star.className = 'fas fa-star';
            detailRating.appendChild(star);
        }

        if (hasHalfStar) {
            const halfStar = document.createElement('i');
            halfStar.className = 'fas fa-star-half-alt';
            detailRating.appendChild(halfStar);
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            const emptyStar = document.createElement('i');
            emptyStar.className = 'far fa-star';
            detailRating.appendChild(emptyStar);
        }

        const reviewsSpan = document.createElement('span');
        reviewsSpan.textContent = `(${reviews} reviews)`;
        detailRating.appendChild(reviewsSpan);
    }

    function setProductSpecs(specs) {
        detailSpecs.innerHTML = '';
        specs.forEach(spec => {
            const li = document.createElement('li');
            li.textContent = spec;
            detailSpecs.appendChild(li);
        });
    }

    detailClose.addEventListener('click', closeProductDetail);

    productDetailModal.addEventListener('click', function (e) {
        if (e.target === productDetailModal) {
            closeProductDetail();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && productDetailModal.classList.contains('show')) {
            closeProductDetail();
        }
    });

    function closeProductDetail() {
        productDetailModal.classList.remove('show');
        document.body.style.overflow = '';
    }

    // ==================== QUANTITY CONTROLS ====================
    let currentQuantity = 1;

    quantityDecrease.addEventListener('click', function () {
        if (currentQuantity > 1) {
            currentQuantity--;
            quantityDisplay.textContent = currentQuantity;
        }
    });

    quantityIncrease.addEventListener('click', function () {
        currentQuantity++;
        quantityDisplay.textContent = currentQuantity;
    });

    // ==================== BUY NOW & ADD TO CART IN DETAIL ====================
    buyNowBtn.addEventListener('click', function () {
        const productTitle = detailTitle.textContent;
        showNotification(`Memproses pembelian ${currentQuantity} ${productTitle}`, 'success');
        closeProductDetail();
    });

    addToCartDetailBtn.addEventListener('click', function () {
        const productTitle = detailTitle.textContent;

        let currentCount = parseInt(cartCount.textContent);
        const newCount = currentCount + currentQuantity;
        cartCount.textContent = newCount;

        showNotification(`${currentQuantity} ${productTitle} ditambahkan ke keranjang`, 'success');

        cartCount.parentElement.classList.add('pulse');
        setTimeout(() => {
            cartCount.parentElement.classList.remove('pulse');
        }, 500);

        updateCartCount(newCount);
        closeProductDetail();
    });

    // ==================== ADD PRODUCT FUNCTIONALITY ====================
    floatingAddBtn.addEventListener('click', function () {
        addProductModal.style.display = 'flex';
        resetAddProductForm();
    });

    cancelAddProduct.addEventListener('click', function () {
        addProductModal.style.display = 'none';
    });

    productImageInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
                previewText.style.display = 'none';
            }
            reader.readAsDataURL(file);
        }
    });

    addSpecBtn.addEventListener('click', function () {
        addSpecificationField();
    });

    function addSpecificationField(specValue = '') {
        const specDiv = document.createElement('div');
        specDiv.className = 'spec-input';
        specDiv.innerHTML = `
            <input type="text" class="spec-input-field" placeholder="Contoh: Bahan: Katun Premium" value="${specValue}">
            <button type="button" class="remove-spec-btn">×</button>
        `;
        specsContainer.appendChild(specDiv);

        specDiv.querySelector('.remove-spec-btn').addEventListener('click', function () {
            specDiv.remove();
        });
    }

    function resetAddProductForm() {
        addProductForm.reset();
        previewImage.style.display = 'none';
        previewText.style.display = 'block';
        specsContainer.innerHTML = '';
        addSpecificationField();
    }

    addProductForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const imageFile = productImageInput.files[0];
        const title = productTitleInput.value.trim();
        const price = productPriceInput.value.trim();
        const description = productDescriptionInput.value.trim();

        if (!imageFile || !title || !price) {
            showNotification('Harap isi semua field yang diperlukan', 'error');
            return;
        }

        const productKey = generateProductKey(title);

        const specs = [];
        const specInputs = specsContainer.querySelectorAll('.spec-input-field');
        specInputs.forEach(input => {
            if (input.value.trim()) {
                specs.push(input.value.trim());
            }
        });

        const newProduct = {
            title: title,
            price: price,
            image: URL.createObjectURL(imageFile),
            rating: 4,
            reviews: 0,
            description: description || 'Produk berkualitas tinggi dengan bahan terbaik.',
            specs: specs.length > 0 ? specs : [
                'Bahan: Premium Quality',
                'Ukuran: Standard Size',
                'Warna: Various Colors Available'
            ]
        };

        productDetails[productKey] = newProduct;
        addProductToGrid(newProduct, productKey);

        addProductModal.style.display = 'none';
        showNotification('Produk berhasil ditambahkan!', 'success');

        setTimeout(() => {
            const newProductElement = document.querySelector(`[data-product-key="${productKey}"]`);
            if (newProductElement) {
                newProductElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 500);
    });

    function addProductToGrid(product, productKey) {
        const productGrid = document.querySelector('.product-grid');
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-product-key', productKey);

        const starsHTML = generateStarsHTML(product.rating);

        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
                <div class="product-actions">
                    <button class="wishlist-btn"><i class="far fa-heart"></i></button>
                    <button class="quick-view-btn"><i class="far fa-eye"></i></button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.title}</h3>
                <p class="product-price">${product.price}</p>
                <div class="product-rating">
                    ${starsHTML}
                    <span>(${product.reviews})</span>
                </div>
                <button class="add-to-cart-btn">Tambah ke Keranjang</button>
            </div>
        `;

        const quickViewBtn = productCard.querySelector('.quick-view-btn');
        const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
        const wishlistBtn = productCard.querySelector('.wishlist-btn');

        quickViewBtn.addEventListener('click', function () {
            showProductDetail(productKey, productCard);
        });

        addToCartBtn.addEventListener('click', function () {
            let currentCount = parseInt(cartCount.textContent);
            cartCount.textContent = currentCount + 1;
            showNotification(`${product.title} ditambahkan ke keranjang`, 'success');
            cartCount.parentElement.classList.add('pulse');
            setTimeout(() => {
                cartCount.parentElement.classList.remove('pulse');
            }, 500);
            updateCartCount(currentCount + 1);
        });

        wishlistBtn.addEventListener('click', function () {
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.style.color = '#ff6b8b';
                showNotification(`${product.title} ditambahkan ke favorit`, 'success');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.style.color = '';
                showNotification(`${product.title} dihapus dari favorit`, 'info');
            }
        });

        productGrid.insertBefore(productCard, productGrid.firstChild);
    }

    function generateStarsHTML(rating) {
        let starsHTML = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }

        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }

        return starsHTML;
    }

    // ==================== NOTIFICATION SYSTEM ====================
    function showNotification(message, type) {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            z-index: 3000;
            display: flex;
            align-items: center;
            gap: 15px;
            max-width: 350px;
            border-left: 4px solid ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            animation: slideIn 0.3s ease-out;
        `;

        const closeButton = notification.querySelector('.notification-close');
        closeButton.style.cssText = `
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        closeButton.addEventListener('click', function () {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    // ==================== UTILITY FUNCTIONS ====================
    const style = document.createElement('style');
    style.textContent = `
       
    `;
    document.head.appendChild(style);

    // Initialize cart count from localStorage if available
    const savedCartCount = localStorage.getItem('cartCount');
    if (savedCartCount && cartCount) {
        cartCount.textContent = savedCartCount;
    }

    function updateCartCount(count) {
        if (cartCount) {
            cartCount.textContent = count;
            localStorage.setItem('cartCount', count);
        }
    }

    // Initialize with one spec field
    addSpecificationField();

    // Welcome message
    setTimeout(() => {
        showNotification('Selamat datang di Galeri Hijab!', 'success');
    }, 1000);
});
// ==================== NAVIGATION FUNCTIONALITY ====================

// Navigation Elements
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

// Function to handle navigation
function handleNavigation(target) {
    // Remove active class from all links and sections
    navLinks.forEach(link => link.classList.remove('active'));
    sections.forEach(section => section.classList.remove('active'));

    // Add active class to clicked link
    const activeLink = document.querySelector(`[data-target="${target}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Show target section with smooth scroll
    const targetSection = document.getElementById(target);
    if (targetSection) {
        targetSection.classList.add('active');

        // Smooth scroll to section
        setTimeout(() => {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    }
}

// Add click event listeners to navigation links
navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const target = this.getAttribute('data-target');
        handleNavigation(target);
    });
});

// Function to handle hash URL changes
function handleHashChange() {
    const hash = window.location.hash.substring(1); // Remove # symbol
    if (hash) {
        handleNavigation(hash);
    } else {
        // Default to home
        handleNavigation('home');
    }
}

// Handle initial page load and hash changes
window.addEventListener('load', handleHashChange);
window.addEventListener('hashchange', handleHashChange);

// Optional: Add intersection observer for scroll-based active states
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-target') === id) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

// Observe all sections
sections.forEach(section => {
    observer.observe(section);
});

// Initialize first load
document.addEventListener('DOMContentLoaded', function () {
    // Show all sections on load
    sections.forEach(section => {
        section.classList.add('active');
    });

    // Set home as default active
    if (!window.location.hash) {
        handleNavigation('home');
    }
});

// Fungsi untuk menambah produk ke favorit
function addToFavorites(productId, productName, price) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Cek apakah produk sudah ada di favorit
    const existingProduct = favorites.find(item => item.id === productId);

    if (!existingProduct) {
        favorites.push({
            id: productId,
            name: productName,
            price: price,
            addedDate: new Date()
        });

        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoriteCount();
        showNotification('Produk berhasil ditambahkan ke favorit');
    }
}

// Fungsi untuk menghapus produk dari favorit
function removeFromFavorites(productId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(item => item.id !== productId);
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteCount();
    showNotification('Produk dihapus dari favorit');
}

// Fungsi untuk update angka favorit di navbar
function updateFavoriteCount() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoriteCount = favorites.length;
    
    // Format angka menjadi 3 digit (contoh: 001, 012, 123)
    const formattedCount = favoriteCount.toString().padStart(3, '0');
    
    // Update tampilan di UI
    const favoriteElement = document.querySelector('.favorite-count');
    if (favoriteElement) {
        favoriteElement.textContent = formattedCount;
    }
    
    return favoriteCount;
}

// Fungsi untuk mengambil semua data favorit
function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message) {
    // Buat element notifikasi
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Hapus notifikasi setelah 3 detik
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Fungsi toggle untuk tambah/hapus favorit
function toggleFavorite(productId, productName, price) {
    if (isProductFavorited(productId)) {
        removeFromFavorites(productId);
    } else {
        addToFavorites(productId, productName, price);
    }
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    updateFavoriteCount();
});

// js/home.js - Tambahkan kode berikut

// Data storage
let userData = {
    name: "galeri hijab",
    email: "user@example.com",
    phone: "+62 812-3456-7890",
    address: "Jl. semuli jaya"
};

let favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
let orders = JSON.parse(localStorage.getItem('userOrders')) || [];

// Favorite Functionality
function initializeFavorites() {
    const favoriteBtn = document.getElementById('favorit');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showFavoriteProducts();
        });
    }

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
    
    // Update favorite count in navigation if exists
    updateFavoriteCount();
}

function showFavoriteProducts() {
    const modal = createModal('favorite');
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <h3><i class="fas fa-heart"></i> Produk Favorit Saya</h3>
            <div class="favorite-content">
                ${favoriteProducts.length === 0 ? 
                    `<div class="empty-state">
                        <i class="far fa-heart"></i>
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
                                        <button class="btn-primary add-to-cart-from-fav" data-product='${JSON.stringify(product)}'>Tambah ke Keranjang</button>
                                        <button class="btn-secondary remove-from-fav" data-id="${product.id}">Hapus</button>
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

    // Add event listeners for remove buttons
    modal.querySelectorAll('.remove-from-fav').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            removeFromFavorites(productId);
            showFavoriteProducts(); // Refresh the view
        });
    });

    // Add event listeners for add to cart buttons
    modal.querySelectorAll('.add-to-cart-from-fav').forEach(button => {
        button.addEventListener('click', function() {
            const product = JSON.parse(this.getAttribute('data-product'));
            addToCartFromFavorite(product);
        });
    });
}

function removeFromFavorites(productId) {
    favoriteProducts = favoriteProducts.filter(product => product.id !== productId);
    localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
    updateFavoriteCount();
    showNotification('Produk dihapus dari favorit', 'info');
}

function addToCartFromFavorite(product) {
    // Implement add to cart functionality here
    showNotification('Produk ditambahkan ke keranjang', 'success');
    closeModal('favorite');
}

function updateFavoriteCount() {
    const favoriteCount = document.querySelector('.favorite-count');
    if (favoriteCount) {
        favoriteCount.textContent = favoriteProducts.length;
    }
}

// Orders Functionality
function initializeOrders() {
    const ordersBtn = document.querySelector('a[href="#"]:has(.fa-shopping-bag)');
    if (ordersBtn) {
        ordersBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showMyOrders();
        });
    }
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
                                        ${order.status === 'pending' ? 
                                            `<button class="btn-primary" onclick="payOrder('${order.id}')">Bayar</button>` : 
                                            ''
                                        }
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
                    <div class="status-timeline">
                        <div class="timeline-item ${order.status === 'pending' ? 'active' : ''}">
                            <div class="timeline-dot"></div>
                            <span>Menunggu Pembayaran</span>
                        </div>
                        <div class="timeline-item ${order.status === 'paid' ? 'active' : ''}">
                            <div class="timeline-dot"></div>
                            <span>Pembayaran Diterima</span>
                        </div>
                        <div class="timeline-item ${order.status === 'processing' ? 'active' : ''}">
                            <div class="timeline-dot"></div>
                            <span>Pesanan Diproses</span>
                        </div>
                        <div class="timeline-item ${order.status === 'shipped' ? 'active' : ''}">
                            <div class="timeline-dot"></div>
                            <span>Pesanan Dikirim</span>
                        </div>
                        <div class="timeline-item ${order.status === 'delivered' ? 'active' : ''}">
                            <div class="timeline-dot"></div>
                            <span>Pesanan Selesai</span>
                        </div>
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

// Profile Functionality
function initializeProfile() {
    const profileBtn = document.querySelector('a[href="#"]:has(.fa-user)');
    if (profileBtn) {
        profileBtn.addEventListener('click', function(e) {
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
                        <button class="btn-secondary change-avatar">Ubah Foto</button>
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

// Utility Functions
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

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeFavorites();
    initializeOrders();
    initializeProfile();
    updateFavoriteCount();
});



// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-box input');
    const searchBtn = document.querySelector('.search-btn');
    const searchSuggestions = document.querySelectorAll('.search-suggestions a');
    
    // Product data for search
    const products = [
        { name: 'Hijab Segi Empat', price: 40000, image: 'image/hijab segi 4.jpg', category: 'Hijab' },
        { name: 'Hijab Pashmina', price: 55000, image: 'image/pashmina kaos.jpg', category: 'Hijab' },
        { name: 'Hijab Instan', price: 65000, image: 'image/segitiga instan jersy.jpg', category: 'Hijab' },
        { name: 'Hijab Bergo Maryam', price: 55000, image: 'image/bergo maryam.jpeg', category: 'Hijab' },
        { name: 'Hijab Segitiga Paris', price: 55000, image: 'image/segitiga paris.jpeg', category: 'Hijab' },
        { name: 'Gamis Set Hijab Rayon', price: 150000, image: 'image/gamis set hijab rayon.jpeg', category: 'Gamis' },
        { name: 'Abaya Jumbo', price: 150000, image: 'image/abaya jumbo.jpeg', category: 'Gamis' },
        { name: 'Rok Panjang', price: 120000, image: 'image/rok.jpeg', category: 'Rok' },
        { name: 'Kaos Kaki Citra', price: 5000, image: 'image/kaos kaki.jpeg', category: 'Aksesoris' },
        { name: 'Gamis Kaftan', price: 160000, image: 'image/gamis kaftan.jpeg', category: 'Gamis' }
    ];
    
    // Handle search button click
    searchBtn.addEventListener('click', function() {
        performSearch();
    });
    
    // Handle enter key in search input
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Handle search suggestions click
    searchSuggestions.forEach(suggestion => {
        suggestion.addEventListener('click', function(e) {
            e.preventDefault();
            searchInput.value = this.textContent;
            performSearch();
        });
    });
    
    // Auto-suggest functionality
    searchInput.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        if (value.length > 2) {
            showSearchSuggestions(value);
        } else {
            hideSearchSuggestions();
        }
    });
    
    // Search function
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            alert('Silakan masukkan kata kunci pencarian');
            return;
        }
        
        // Filter products based on search term
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
        
        if (filteredProducts.length > 0) {
            // Show search results
            showSearchResults(filteredProducts, searchTerm);
        } else {
            // Show no results message
            showNoResults(searchTerm);
        }
    }
    
    // Show real-time search suggestions
    function showSearchSuggestions(term) {
        // Filter products for suggestions
        const suggestions = products.filter(product => 
            product.name.toLowerCase().includes(term)
        ).slice(0, 5); // Limit to 5 suggestions
        
        if (suggestions.length > 0) {
            // Create suggestions dropdown
            let suggestionsHTML = '<div class="search-results active">';
            
            suggestions.forEach(product => {
                suggestionsHTML += `
                    <div class="search-result-item" onclick="selectSearchSuggestion('${product.name}')">
                        <img src="${product.image}" alt="${product.name}" class="search-result-image">
                        <div class="search-result-info">
                            <h4>${highlightText(product.name, term)}</h4>
                            <div class="search-result-price">Rp ${product.price.toLocaleString()}</div>
                        </div>
                    </div>
                `;
            });
            
            suggestionsHTML += '</div>';
            
            // Remove existing suggestions
            const existingResults = document.querySelector('.search-results');
            if (existingResults) {
                existingResults.remove();
            }
            
            // Add suggestions to DOM
            const searchContainer = document.querySelector('.search-container');
            searchContainer.insertAdjacentHTML('beforeend', suggestionsHTML);
        }
    }
    
    // Hide search suggestions
    function hideSearchSuggestions() {
        const existingResults = document.querySelector('.search-results');
        if (existingResults) {
            existingResults.remove();
        }
    }
    
    // Highlight matching text in search results
    function highlightText(text, term) {
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<span style="color: var(--primary-color); font-weight: bold;">$1</span>');
    }
    
    // Select search suggestion
    window.selectSearchSuggestion = function(productName) {
        searchInput.value = productName;
        hideSearchSuggestions();
        performSearch();
    };
    
    // Show search results
    function showSearchResults(products, searchTerm) {
        // Scroll to products section
        document.querySelector('.products').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Highlight search term in products
        highlightProducts(products, searchTerm);
        
        // Add search term to recent searches
        addToRecentSearches(searchTerm);
    }
    
    // Highlight products in grid
    function highlightProducts(products, searchTerm) {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            if (productName.includes(searchTerm.toLowerCase())) {
                card.style.boxShadow = '0 0 0 2px var(--primary-color), 0 4px 15px rgba(0, 0, 0, 0.1)';
                card.style.transform = 'translateY(-5px)';
                
                // Scroll product into view with delay
                setTimeout(() => {
                    card.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 500);
            } else {
                card.style.boxShadow = '';
                card.style.transform = '';
            }
        });
    }
    
    // Show no results message
    function showNoResults(searchTerm) {
        // Create no results message
        const noResultsHTML = `
            <div class="no-results">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--border-color); margin-bottom: 15px;"></i>
                <h3>Tidak ditemukan hasil untuk "${searchTerm}"</h3>
                <p>Coba kata kunci lain atau lihat kategori di bawah ini:</p>
                <div style="display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap;">
                    ${['Hijab', 'Gamis', 'Rok', 'Aksesoris'].map(cat => `
                        <a href="#" class="category-tag" onclick="searchByCategory('${cat}')" 
                           style="padding: 8px 15px; background: var(--bg-light); border-radius: 20px; 
                                  text-decoration: none; color: var(--text-dark);">
                            ${cat}
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Insert no results message
        const productsContainer = document.querySelector('.products .container');
        const existingNoResults = productsContainer.querySelector('.no-results');
        if (existingNoResults) {
            existingNoResults.remove();
        }
        
        const productGrid = document.querySelector('.product-grid');
        productsContainer.insertBefore(document.createElement('div'), productGrid)
            .outerHTML = noResultsHTML;
    }
    
    // Search by category
    window.searchByCategory = function(category) {
        searchInput.value = category;
        performSearch();
    };
    
    // Add to recent searches
    function addToRecentSearches(searchTerm) {
        let recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        
        // Remove if already exists
        recentSearches = recentSearches.filter(term => term !== searchTerm);
        
        // Add to beginning
        recentSearches.unshift(searchTerm);
        
        // Keep only last 5 searches
        if (recentSearches.length > 5) {
            recentSearches.pop();
        }
        
        // Save to localStorage
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
        
        // Update recent searches display if exists
        updateRecentSearchesDisplay();
    }
    
    // Update recent searches display
    function updateRecentSearchesDisplay() {
        const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        const suggestionsContainer = document.querySelector('.search-suggestions');
        
        if (recentSearches.length > 0 && suggestionsContainer) {
            // Add recent searches section
            let recentHTML = '';
            recentSearches.forEach(term => {
                recentHTML += `<a href="#" onclick="searchRecent('${term}')">${term}</a>`;
            });
            
            // Update or add recent searches
            let recentSection = suggestionsContainer.querySelector('.recent-searches');
            if (!recentSection) {
                recentSection = document.createElement('div');
                recentSection.className = 'recent-searches';
                recentSection.innerHTML = `<span>Pencarian terakhir:</span>${recentHTML}`;
                suggestionsContainer.appendChild(recentSection);
            } else {
                recentSection.innerHTML = `<span>Pencarian terakhir:</span>${recentHTML}`;
            }
        }
    }
    
    // Search recent term
    window.searchRecent = function(term) {
        searchInput.value = term;
        performSearch();
    };
    
    // Initialize recent searches
    updateRecentSearchesDisplay();
    
    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            hideSearchSuggestions();
        }
    });
});

