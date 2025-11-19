document.addEventListener('DOMContentLoaded', function() {
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
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (logoutModal) logoutModal.style.display = 'flex';
        });
    }

    if (confirmLogout) {
        confirmLogout.addEventListener('click', function() {
            showNotification('Anda telah berhasil keluar', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            if (logoutModal) logoutModal.style.display = 'none';
        });
    }

    if (cancelLogout) {
        cancelLogout.addEventListener('click', function() {
            if (logoutModal) logoutModal.style.display = 'none';
        });
    }

    window.addEventListener('click', function(e) {
        if (e.target === logoutModal) {
            logoutModal.style.display = 'none';
        }
        if (e.target === addProductModal) {
            addProductModal.style.display = 'none';
        }
    });

    // ==================== CART FUNCTIONALITY ====================
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
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
        button.addEventListener('click', function() {
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
        searchButton.addEventListener('click', function() {
            performSearch();
        });
    }
    
    if (searchBox) {
        searchBox.addEventListener('keypress', function(e) {
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
        button.addEventListener('click', function() {
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

    productDetailModal.addEventListener('click', function(e) {
        if (e.target === productDetailModal) {
            closeProductDetail();
        }
    });

    document.addEventListener('keydown', function(e) {
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

    quantityDecrease.addEventListener('click', function() {
        if (currentQuantity > 1) {
            currentQuantity--;
            quantityDisplay.textContent = currentQuantity;
        }
    });

    quantityIncrease.addEventListener('click', function() {
        currentQuantity++;
        quantityDisplay.textContent = currentQuantity;
    });

    // ==================== BUY NOW & ADD TO CART IN DETAIL ====================
    buyNowBtn.addEventListener('click', function() {
        const productTitle = detailTitle.textContent;
        showNotification(`Memproses pembelian ${currentQuantity} ${productTitle}`, 'success');
        closeProductDetail();
    });

    addToCartDetailBtn.addEventListener('click', function() {
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
    floatingAddBtn.addEventListener('click', function() {
        addProductModal.style.display = 'flex';
        resetAddProductForm();
    });

    cancelAddProduct.addEventListener('click', function() {
        addProductModal.style.display = 'none';
    });

    productImageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
                previewText.style.display = 'none';
            }
            reader.readAsDataURL(file);
        }
    });

    addSpecBtn.addEventListener('click', function() {
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
        
        specDiv.querySelector('.remove-spec-btn').addEventListener('click', function() {
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

    addProductForm.addEventListener('submit', function(e) {
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
        
        quickViewBtn.addEventListener('click', function() {
            showProductDetail(productKey, productCard);
        });
        
        addToCartBtn.addEventListener('click', function() {
            let currentCount = parseInt(cartCount.textContent);
            cartCount.textContent = currentCount + 1;
            showNotification(`${product.title} ditambahkan ke keranjang`, 'success');
            cartCount.parentElement.classList.add('pulse');
            setTimeout(() => {
                cartCount.parentElement.classList.remove('pulse');
            }, 500);
            updateCartCount(currentCount + 1);
        });
        
        wishlistBtn.addEventListener('click', function() {
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
        
        closeButton.addEventListener('click', function() {
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