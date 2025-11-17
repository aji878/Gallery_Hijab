document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutModal = document.getElementById('logoutModal');
    const confirmLogout = document.getElementById('confirmLogout');
    const cancelLogout = document.getElementById('cancelLogout');
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

    // Simple product data
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

    // Logout functionality
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
    });

    
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

 
    const searchBox = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    
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

    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Tombol mata diklik!'); 
            
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('h3').textContent.trim();
            
            console.log('Judul produk:', productTitle); 
            
            
            const productKey = generateProductKey(productTitle);
            
            console.log('Key produk:', productKey); 
            console.log('Produk yang tersedia:', Object.keys(productDetails)); 
            
            
            showProductDetail(productKey, productCard);
        });
    });

    
    function generateProductKey(title) {
        return title.toLowerCase()
            .replace(/[^\w\s-]/gi, '') // Hapus karakter khusus kecuali spasi dan dash
            .replace(/\s+/g, '-')     // Ganti spasi dengan dash
            .trim();                  // Hapus spasi di awal/akhir
    }

    
    function showProductDetail(productKey, productCard) {
        console.log('Mencari produk dengan key:', productKey);
        
        const product = productDetails[productKey];
        
        if (product) {
            
            detailImage.src = product.image;
            detailImage.alt = product.title;
            detailTitle.textContent = product.title;
            detailPrice.textContent = product.price;
            detailDescription.textContent = product.description;
            
            // Set rating stars
            setRatingStars(product.rating, product.reviews);
            
            // Set specifications
            setProductSpecs(product.specs);
            
        } else {
        
            console.log('Produk tidak ditemukan, menggunakan fallback data dari card');
            
            const title = productCard.querySelector('h3').textContent;
            const price = productCard.querySelector('.product-price').textContent;
            const image = productCard.querySelector('img').src;
            
            // Set modal dengan data dari card
            detailImage.src = image;
            detailTitle.textContent = title;
            detailPrice.textContent = price;
            detailDescription.textContent = 'Produk berkualitas tinggi dengan bahan terbaik. Cocok untuk berbagai occasions dan nyaman dipakai seharian.';
            
            // Set default rating
            setRatingStars(4, 50);
            
            // Set default specs
            setProductSpecs([
                'Bahan: Premium Quality',
                'Ukuran: Standard Size',
                'Warna: Various Colors Available',
                'Perawatan: Easy to Maintain',
                'Kualitas: Original & Branded'
            ]);
        }
        
        // Reset quantity
        quantityDisplay.textContent = '1';
        currentQuantity = 1;
        
        // Show modal
        productDetailModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // Set rating stars
    function setRatingStars(rating, reviews) {
        detailRating.innerHTML = '';
        
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            const star = document.createElement('i');
            star.className = 'fas fa-star';
            detailRating.appendChild(star);
        }
        
        // Add half star if needed
        if (hasHalfStar) {
            const halfStar = document.createElement('i');
            halfStar.className = 'fas fa-star-half-alt';
            detailRating.appendChild(halfStar);
        }
        
        // Add empty stars
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            const emptyStar = document.createElement('i');
            emptyStar.className = 'far fa-star';
            detailRating.appendChild(emptyStar);
        }
        
        // Add reviews count
        const reviewsSpan = document.createElement('span');
        reviewsSpan.textContent = `(${reviews} reviews)`;
        detailRating.appendChild(reviewsSpan);
    }

    // Set product specifications
    function setProductSpecs(specs) {
        detailSpecs.innerHTML = '';
        
        specs.forEach(spec => {
            const li = document.createElement('li');
            li.textContent = spec;
            detailSpecs.appendChild(li);
        });
    }

    // Close modal
    detailClose.addEventListener('click', closeProductDetail);

    // Close modal when clicking outside
    productDetailModal.addEventListener('click', function(e) {
        if (e.target === productDetailModal) {
            closeProductDetail();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && productDetailModal.classList.contains('show')) {
            closeProductDetail();
        }
    });

    function closeProductDetail() {
        productDetailModal.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Quantity controls
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

    // Buy Now button
    buyNowBtn.addEventListener('click', function() {
        const productTitle = detailTitle.textContent;
        showNotification(`Memproses pembelian ${currentQuantity} ${productTitle}`, 'success');
        closeProductDetail();
    });

    // Add to Cart from detail modal
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

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .pulse {
            animation: pulse 0.5s ease-in-out;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    // Initialize cart count from localStorage if available
    const savedCartCount = localStorage.getItem('cartCount');
    if (savedCartCount && cartCount) {
        cartCount.textContent = savedCartCount;
    }

    // Save cart count to localStorage when it changes
    function updateCartCount(count) {
        if (cartCount) {
            cartCount.textContent = count;
            localStorage.setItem('cartCount', count);
        }
    }

    // Welcome message
    setTimeout(() => {
        showNotification('Selamat datang di Galeri Hijab!', 'success');
    }, 1000);
});