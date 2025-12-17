// ==================== GLOBAL VARIABLES ====================
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let currentProductDetail = null;
let currentQuantity = 1;
let productDetails = {};
let favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
let orders = JSON.parse(localStorage.getItem('userOrders')) || [];
let userData = JSON.parse(localStorage.getItem('userData')) || {
    name: "galeri hijab",
    email: "user@example.com",
    phone: "+62 812-3456-7890",
    address: "Jl. semuli jaya",
    joinDate: "Januari 2024",
    photo: "https://ui-avatars.com/api/?name=Galeri+Hijab&background=6e8efb&color=fff&size=120"
};

// ==================== INITIALIZATION ====================
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
    const cartIcon = document.querySelector('.cart-icon');

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

    // Checkout Elements
    const checkoutModal = document.getElementById('checkoutModal');
    const checkoutProductList = document.getElementById('checkoutProductList');
    const customerName = document.getElementById('customerName');
    const customerPhone = document.getElementById('customerPhone');
    const customerAddress = document.getElementById('customerAddress');
    const confirmCheckout = document.getElementById('confirmCheckout');
    const cancelCheckout = document.getElementById('cancelCheckout');
    const closeCheckoutModal = document.getElementById('closeCheckoutModal');
    const subtotalEl = document.getElementById('subtotal');
    const shippingCostEl = document.getElementById('shippingCost');
    const grandTotalEl = document.getElementById('grandTotal');

    // Search Elements
    const searchBox = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    const searchSuggestions = document.querySelectorAll('.search-suggestions a');

    // Navigation Elements
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Profile & Orders Links
    const profileLinks = document.querySelectorAll('.profile-link, [href="#"]:has(.fa-user)');
    const ordersLinks = document.querySelectorAll('.orders-link, [href="#"]:has(.fa-shopping-bag)');
    const favoriteLinks = document.querySelectorAll('.favorite-link, #favorit-dropdown, #favorit');

    // ==================== INITIALIZE PRODUCT DATA ====================
    initializeProductDetails();

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
        if (e.target === checkoutModal) {
            closeModal('checkoutModal');
        }
        if (e.target === addProductModal) {
            addProductModal.style.display = 'none';
        }
    });

    // ==================== CART MANAGEMENT ====================
    function updateCartDisplay() {
        if (cartCount) {
            const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            localStorage.setItem('cartCount', totalItems);
        }
    }

    function saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    function addToCart(product) {
        const existingItem = cartItems.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            cartItems.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: product.quantity || 1
            });
        }
        
        saveCart();
        updateCartDisplay();
        
        if (cartCount) {
            cartCount.parentElement.classList.add('pulse');
            setTimeout(() => {
                cartCount.parentElement.classList.remove('pulse');
            }, 500);
        }
        
        showNotification(`${product.name} ditambahkan ke keranjang`, 'success');
    }

    function removeFromCart(productId) {
        cartItems = cartItems.filter(item => item.id !== productId);
        saveCart();
        updateCartDisplay();
        showNotification('Produk dihapus dari keranjang', 'info');
    }

    function clearCart() {
        cartItems = [];
        saveCart();
        updateCartDisplay();
    }

    function getCartTotal() {
        return cartItems.reduce((total, item) => {
            const priceStr = item.price.replace(/[^\d]/g, '');
            const price = parseInt(priceStr) || 0;
            return total + (price * item.quantity);
        }, 0);
    }

    // ==================== ADD TO CART BUTTONS ====================
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            const productImage = productCard.querySelector('img').src;
            const productId = generateProductKey(productName);
            
            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            };
            
            addToCart(product);
        });
    });

    // ==================== CART ICON CLICK ====================
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            if (cartItems.length > 0) {
                openCheckout();
            } else {
                showNotification('Keranjang belanja kosong', 'info');
            }
        });
    }

    // ==================== WISHLIST FUNCTIONALITY ====================
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function () {
            const icon = this.querySelector('i');
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productImage = productCard.querySelector('img').src;
            const productPrice = productCard.querySelector('.product-price').textContent;
            const productId = generateProductKey(productName);

            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.style.color = '#ff6b8b';
                
                // Add to favorites
                favoriteProducts.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage
                });
                localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
                
                showNotification(`${productName} ditambahkan ke favorit`, 'success');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.style.color = '';
                
                // Remove from favorites
                favoriteProducts = favoriteProducts.filter(p => p.id !== productId);
                localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
                
                showNotification(`${productName} dihapus dari favorit`, 'info');
            }
            
            updateFavoriteCount();
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
            
            // Filter products
            const productCards = document.querySelectorAll('.product-card');
            let found = false;
            
            productCards.forEach(card => {
                const productName = card.querySelector('h3').textContent.toLowerCase();
                if (productName.includes(searchTerm.toLowerCase())) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    card.style.boxShadow = '0 0 10px rgba(167, 119, 227, 0.5)';
                    found = true;
                    
                    setTimeout(() => {
                        card.style.boxShadow = '';
                    }, 3000);
                }
            });
            
            if (!found) {
                showNotification('Produk tidak ditemukan', 'error');
            }
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

        // Set current product detail for cart
        const priceStr = product ? product.price : productCard.querySelector('.product-price').textContent;
        const priceNumber = parseInt(priceStr.replace(/[^\d]/g, '')) || 0;
        currentProductDetail = {
            id: productKey,
            name: product ? product.title : productCard.querySelector('h3').textContent,
            price: priceNumber,
            image: product ? product.image : productCard.querySelector('img').src
        };

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
        currentProductDetail = null;
        currentQuantity = 1;
    }

    // ==================== QUANTITY CONTROLS ====================
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
        if (currentProductDetail) {
            const product = {
                ...currentProductDetail,
                quantity: currentQuantity,
                price: `Rp ${currentProductDetail.price.toLocaleString()}`
            };
            
            addToCart(product);
            closeProductDetail();
            
            setTimeout(() => {
                openCheckout();
            }, 500);
        }
    });

    addToCartDetailBtn.addEventListener('click', function () {
        if (currentProductDetail) {
            const product = {
                ...currentProductDetail,
                quantity: currentQuantity,
                price: `Rp ${currentProductDetail.price.toLocaleString()}`
            };
            
            addToCart(product);
            closeProductDetail();
        }
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
            const product = {
                id: productKey,
                name: productCard.querySelector('h3').textContent,
                price: productCard.querySelector('.product-price').textContent,
                image: productCard.querySelector('img').src,
                quantity: 1
            };
            addToCart(product);
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

    // ==================== CHECKOUT SYSTEM ====================
    function openCheckout() {
        if (cartItems.length === 0) {
            showNotification('Keranjang belanja kosong', 'error');
            return;
        }
        
        const userProfile = JSON.parse(localStorage.getItem('userProfile')) || userData;
        
        if (customerName) customerName.value = userProfile.name || '';
        if (customerPhone) customerPhone.value = userProfile.phone || '';
        if (customerAddress) customerAddress.value = userProfile.address || '';
        
        displayCheckoutProducts();
        updateCheckoutTotals();
        
        openModal('checkoutModal');
    }

    function displayCheckoutProducts() {
        if (!checkoutProductList) return;
        
        checkoutProductList.innerHTML = '';
        
        cartItems.forEach(item => {
            const priceNumber = parseInt(item.price.replace(/[^\d]/g, '')) || 0;
            const total = priceNumber * item.quantity;
            
            const productHTML = `
                <div class="checkout-product-item" data-product-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="checkout-product-info">
                        <h5>${item.name}</h5>
                        <div class="price">Rp ${priceNumber.toLocaleString()} x ${item.quantity}</div>
                    </div>
                    <div class="checkout-product-total">Rp ${total.toLocaleString()}</div>
                </div>
            `;
            checkoutProductList.innerHTML += productHTML;
        });
    }

    function updateCheckoutTotals() {
        const subtotal = getCartTotal();
        const shippingCost = 15000;
        const grandTotal = subtotal + shippingCost;
        
        if (subtotalEl) subtotalEl.textContent = `Rp ${subtotal.toLocaleString()}`;
        if (shippingCostEl) shippingCostEl.textContent = `Rp ${shippingCost.toLocaleString()}`;
        if (grandTotalEl) grandTotalEl.textContent = `Rp ${grandTotal.toLocaleString()}`;
    }

    function processCheckout() {
        const name = customerName?.value.trim();
        const phone = customerPhone?.value.trim();
        const address = customerAddress?.value.trim();
        
        if (!name || !phone || !address) {
            showNotification('Harap isi semua data pelanggan', 'error');
            return;
        }
        
        const userProfile = JSON.parse(localStorage.getItem('userProfile')) || userData;
        userProfile.name = name;
        userProfile.phone = phone;
        userProfile.address = address;
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        
        createOrder(name, phone, address);
        
        clearCart();
        
        closeModal('checkoutModal');
        
        showNotification('Pesanan berhasil dibuat! Lihat di Pesanan Saya', 'success');
        
        if (typeof renderOrders === 'function') {
            renderOrders();
        }
    }

    function createOrder(customerName, customerPhone, customerAddress) {
        const orderId = 'GH' + Date.now();
        const now = new Date();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        
        const orderDate = `${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const subtotal = getCartTotal();
        const shippingCost = 15000;
        const total = subtotal + shippingCost;
        
        const newOrder = {
            id: orderId,
            date: orderDate,
            status: 'pending',
            products: cartItems.map(item => ({
                name: item.name,
                price: parseInt(item.price.replace(/[^\d]/g, '')) || 0,
                qty: item.quantity,
                image: item.image
            })),
            customer: {
                name: customerName,
                phone: customerPhone,
                address: customerAddress
            },
            shipping: {
                method: 'JNE Reguler',
                tracking: null,
                estimate: '2-3 hari kerja',
                cost: shippingCost
            },
            payment: {
                method: 'QRIS',
                status: 'pending',
                total: total
            }
        };
        
        saveOrderToLocalStorage(newOrder);
        
        return newOrder;
    }

    function saveOrderToLocalStorage(order) {
        orders.unshift(order);
        localStorage.setItem('userOrders', JSON.stringify(orders));
        
        updateOrderStats();
    }

    function updateOrderStats() {
        const userProfile = JSON.parse(localStorage.getItem('userProfile')) || userData;
        userProfile.stats = userProfile.stats || {
            totalOrders: 0,
            wishlist: 0,
            points: 1250,
            successOrders: 0
        };
        
        userProfile.stats.totalOrders = orders.length;
        userProfile.stats.successOrders = orders.filter(order => order.status === 'completed').length;
        
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        
        if (typeof updateProfileDisplay === 'function') {
            updateProfileDisplay();
        }
    }

    // ==================== CHECKOUT EVENT LISTENERS ====================
    if (confirmCheckout) {
        confirmCheckout.addEventListener('click', processCheckout);
    }
    
    if (cancelCheckout) {
        cancelCheckout.addEventListener('click', function() {
            closeModal('checkoutModal');
        });
    }
    
    if (closeCheckoutModal) {
        closeCheckoutModal.addEventListener('click', function() {
            closeModal('checkoutModal');
        });
    }

    // ==================== NAVIGATION FUNCTIONALITY ====================
    function handleNavigation(target) {
        navLinks.forEach(link => link.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));

        const activeLink = document.querySelector(`[data-target="${target}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        const targetSection = document.getElementById(target);
        if (targetSection) {
            targetSection.classList.add('active');
            setTimeout(() => {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            handleNavigation(target);
        });
    });

    // ==================== PROFILE & ORDERS INTEGRATION ====================
    profileLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            openModal('profileModal');
            if (typeof updateProfileDisplay === 'function') {
                updateProfileDisplay();
            }
        });
    });
    
    ordersLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            openModal('ordersModal');
            if (typeof renderOrders === 'function') {
                renderOrders();
            }
        });
    });

    favoriteLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showFavoriteProducts();
        });
    });

    // ==================== UTILITY FUNCTIONS ====================
    function initializeProductDetails() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const productTitle = card.querySelector('h3').textContent.trim();
            const productKey = generateProductKey(productTitle);
            const productPrice = card.querySelector('.product-price').textContent;
            const productImage = card.querySelector('img').src;
            
            productDetails[productKey] = {
                title: productTitle,
                price: productPrice,
                image: productImage,
                rating: 4.5,
                reviews: Math.floor(Math.random() * 100) + 50,
                description: `${productTitle} adalah produk berkualitas tinggi dengan bahan terbaik. Cocok untuk berbagai occasions dan nyaman dipakai seharian.`,
                specs: [
                    'Bahan: Premium Quality',
                    'Ukuran: Standard Size',
                    'Warna: Various Colors Available',
                    'Perawatan: Easy to Maintain',
                    'Kualitas: Original & Branded'
                ]
            };
        });
    }

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.classList.add('no-scroll');
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.classList.remove('no-scroll');
        }
    }

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

    function updateFavoriteCount() {
        const favoriteCountElements = document.querySelectorAll('.favorite-count');
        favoriteCountElements.forEach(element => {
            element.textContent = favoriteProducts.length.toString().padStart(2, '0');
        });
    }

    function showFavoriteProducts() {
        const modalHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <h3><i class="fas fa-heart"></i> Produk Favorit Saya</h3>
                <div class="favorite-content">
                    ${favoriteProducts.length === 0 ? 
                        `<div class="empty-state">
                            <i class="far fa-heart"></i>
                            <h4>Belum ada produk favorit</h4>
                            <p>Produk yang Anda sukai akan muncul di sini</p>
                            <button class="btn-primary start-shopping-btn">Mulai Belanja</button>
                        </div>` :
                        `<div class="favorite-grid">
                            ${favoriteProducts.map(product => `
                                <div class="favorite-item">
                                    <div class="favorite-image">
                                        <img src="${product.image}" alt="${product.name}">
                                    </div>
                                    <div class="favorite-info">
                                        <h4>${product.name}</h4>
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
                    <button class="btn-secondary close-favorite-modal">Tutup</button>
                </div>
            </div>
        `;

        const existingModal = document.getElementById('favoriteModal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'favoriteModal';
        modal.className = 'modal';
        modal.innerHTML = modalHTML;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        document.body.classList.add('no-scroll');

        const closeBtn = modal.querySelector('.close-favorite-modal');
        const startBtn = modal.querySelector('.start-shopping-btn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.remove();
                document.body.classList.remove('no-scroll');
            });
        }
        
        if (startBtn) {
            startBtn.addEventListener('click', function() {
                modal.remove();
                document.body.classList.remove('no-scroll');
            });
        }

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
                document.body.classList.remove('no-scroll');
            }
        });

        modal.querySelectorAll('.remove-from-fav').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                favoriteProducts = favoriteProducts.filter(product => product.id !== productId);
                localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
                updateFavoriteCount();
                showFavoriteProducts();
            });
        });

        modal.querySelectorAll('.add-to-cart-from-fav').forEach(button => {
            button.addEventListener('click', function() {
                const product = JSON.parse(this.getAttribute('data-product'));
                addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
                modal.remove();
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // ==================== INITIAL SETUP ====================
    updateCartDisplay();
    updateFavoriteCount();
    addSpecificationField();

    // Welcome message
    setTimeout(() => {
        showNotification('Selamat datang di Galeri Hijab!', 'success');
    }, 1000);
});

// ==================== GLOBAL FUNCTIONS ====================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.classList.add('no-scroll');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
}

// Event delegation for order actions
document.addEventListener('click', function(e) {
    if (e.target.closest('.view-order-detail')) {
        e.preventDefault();
        const orderId = e.target.closest('.view-order-detail').getAttribute('data-order-id');
        alert(`Detail pesanan ${orderId}`);
    }
    
    if (e.target.closest('.pay-order')) {
        e.preventDefault();
        const orderId = e.target.closest('.pay-order').getAttribute('data-order-id');
        alert(`Membayar pesanan ${orderId}`);
    }
    
    if (e.target.closest('.track-order')) {
        e.preventDefault();
        const orderId = e.target.closest('.track-order').getAttribute('data-order-id');
        alert(`Melacak pesanan ${orderId}`);
    }
    
    if (e.target.closest('.close-modal')) {
        e.preventDefault();
        const modal = e.target.closest('.modal');
        if (modal) {
            closeModal(modal.id);
        }
    }
    
    if (e.target.closest('.start-shopping-btn')) {
        const modal = e.target.closest('.modal');
        if (modal) {
            closeModal(modal.id);
        }
    }
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

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target.id);
    }
});

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-box input');
    const searchBtn = document.querySelector('.search-btn');
    const searchSuggestions = document.querySelectorAll('.search-suggestions a');
    
    // Product data for search
    const products = [
        { name: 'Hijab Segi Empat', price: 40000, image: 'image/hijab segi 4.jpg', category: 'Hijab' },
        { name: 'Hijab Pashmina', price: 55000, image: 'image/pashmina kaos.jpeg', category: 'Hijab' },
        { name: 'Hijab Instan', price: 65000, image: 'image/segitiga instan jersy.jpeg', category: 'Hijab' },
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
// checkout.js - Handle semua fungsi checkout

// Data cart dari localStorage
let = JSON.parse(localStorage.getItem('cartItems')) || [];

// Data order dari localStorage
let userOrders = JSON.parse(localStorage.getItem('userOrders')) || [];

// Initialize Checkout
document.addEventListener('DOMContentLoaded', function() {
    initializeCheckout();
});

function initializeCheckout() {
    console.log('🛒 Checkout system initialized');
    
    // Setup checkout modal
    setupCheckoutModal();
    
    // Setup order confirmation
    setupOrderConfirmation();
    
    // Setup payment methods
    setupPaymentMethods();
    
    // Setup cart functionality
    setupCartFunctionality();
    
    // Load cart items
    loadCartItems();
}

// ==================== CHECKOUT MODAL ====================

function setupCheckoutModal() {
    const checkoutModal = document.getElementById('checkoutModal');
    const cancelCheckout = document.getElementById('cancelCheckout');
    const confirmOrder = document.getElementById('confirmOrder');
    
    if (!checkoutModal) return;
    
    // Event listener untuk membuka checkout modal
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-buy') || e.target.closest('.checkout-btn')) {
            e.preventDefault();
            openCheckoutModal();
        }
    });
    
    // Close checkout modal
    if (cancelCheckout) {
        cancelCheckout.addEventListener('click', function() {
            closeCheckoutModal();
        });
    }
    
    // Confirm order
    if (confirmOrder) {
        confirmOrder.addEventListener('click', function() {
            processOrder();
        });
    }
    
    // Close modal when clicking outside
    checkoutModal.addEventListener('click', function(e) {
        if (e.target === checkoutModal) {
            closeCheckoutModal();
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && checkoutModal.style.display === 'flex') {
            closeCheckoutModal();
        }
    });
}

function openCheckoutModal() {
    const checkoutModal = document.getElementById('checkoutModal');
    if (!checkoutModal) return;
    
    // Load cart items to checkout
    loadCheckoutItems();
    
    // Calculate totals
    calculateCheckoutTotals();
    
    // Show modal
    checkoutModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
    const checkoutModal = document.getElementById('checkoutModal');
    if (!checkoutModal) return;
    
    checkoutModal.style.display = 'none';
    document.body.style.overflow = '';
}

// ==================== CART FUNCTIONALITY ====================

function setupCartFunctionality() {
    // Update cart count on page load
    updateCartCount();
    
    // Add to cart from product cards
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart-btn')) {
            const productCard = e.target.closest('.product-card');
            addToCartFromCard(productCard);
        }
        
        if (e.target.closest('.cart-icon')) {
            e.preventDefault();
            showCartItems();
        }
    });
}

function addToCartFromCard(productCard) {
    const productId = generateProductId(productCard.querySelector('h3').textContent);
    const productName = productCard.querySelector('h3').textContent;
    const productPrice = parsePrice(productCard.querySelector('.product-price').textContent);
    const productImage = productCard.querySelector('img').src;
    const quantity = 1;
    
    const product = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: quantity
    };
    
    addToCart(product);
}

function addToCart(product) {
    // Check if product already in cart
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex > -1) {
        // Update quantity
        cartItems[existingItemIndex].quantity += product.quantity;
    } else {
        // Add new item
        cartItems.push(product);
    }
    
    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Update UI
    updateCartCount();
    
    // Show notification
    showNotification(`${product.name} ditambahkan ke keranjang`, 'success');
}

function removeFromCart(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    
    // Refresh checkout if open
    if (document.getElementById('checkoutModal').style.display === 'flex') {
        loadCheckoutItems();
        calculateCheckoutTotals();
    }
}

function updateCartQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const itemIndex = cartItems.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        cartItems[itemIndex].quantity = newQuantity;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Refresh checkout if open
        if (document.getElementById('checkoutModal').style.display === 'flex') {
            loadCheckoutItems();
            calculateCheckoutTotals();
        }
    }
}

function updateCartCount() {
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

function loadCartItems() {
    cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    updateCartCount();
}

function showCartItems() {
    // Implement modal for cart items
    if (cartItems.length === 0) {
        showNotification('Keranjang belanja kosong', 'info');
        return;
    }
    
    // Create cart modal
    const cartModal = document.createElement('div');
    cartModal.className = 'modal';
    cartModal.id = 'cartModal';
    cartModal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <h3><i class="fas fa-shopping-cart"></i> Keranjang Belanja</h3>
            <div class="cart-items" id="cartItemsList">
                ${cartItems.map(item => `
                    <div class="cart-item" data-product-id="${item.id}">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p>Rp ${item.price.toLocaleString()}</p>
                            <div class="quantity-controls">
                                <button class="quantity-decrease" data-id="${item.id}">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-increase" data-id="${item.id}">+</button>
                            </div>
                        </div>
                        <button class="remove-item" data-id="${item.id}">&times;</button>
                    </div>
                `).join('')}
            </div>
            <div class="cart-total">
                <strong>Total: Rp ${calculateCartTotal().toLocaleString()}</strong>
            </div>
            <div class="modal-actions">
                <button class="btn-primary checkout-btn">Checkout</button>
                <button class="btn-secondary close-cart">Tutup</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(cartModal);
    
    // Show modal
    cartModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add event listeners
    cartModal.querySelector('.close-cart').addEventListener('click', () => {
        cartModal.remove();
        document.body.style.overflow = '';
    });
    
    cartModal.querySelector('.checkout-btn').addEventListener('click', () => {
        cartModal.remove();
        openCheckoutModal();
    });
    
    // Quantity controls
    cartModal.querySelectorAll('.quantity-decrease').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const item = cartItems.find(item => item.id === productId);
            if (item) {
                updateCartQuantity(productId, item.quantity - 1);
                updateCartModal(cartModal);
            }
        });
    });
    
    cartModal.querySelectorAll('.quantity-increase').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const item = cartItems.find(item => item.id === productId);
            if (item) {
                updateCartQuantity(productId, item.quantity + 1);
                updateCartModal(cartModal);
            }
        });
    });
    
    // Remove items
    cartModal.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            removeFromCart(productId);
            updateCartModal(cartModal);
        });
    });
    
    // Close on outside click
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.remove();
            document.body.style.overflow = '';
        }
    });
}

function updateCartModal(modal) {
    const cartItemsList = modal.querySelector('#cartItemsList');
    const cartTotal = modal.querySelector('.cart-total strong');
    
    if (cartItems.length === 0) {
        cartItemsList.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Keranjang belanja kosong</p>
            </div>
        `;
        cartTotal.textContent = 'Total: Rp 0';
        modal.querySelector('.checkout-btn').disabled = true;
        return;
    }
    
    cartItemsList.innerHTML = cartItems.map(item => `
        <div class="cart-item" data-product-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Rp ${item.price.toLocaleString()}</p>
                <div class="quantity-controls">
                    <button class="quantity-decrease" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-increase" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="remove-item" data-id="${item.id}">&times;</button>
        </div>
    `).join('');
    
    cartTotal.textContent = `Total: Rp ${calculateCartTotal().toLocaleString()}`;
}

function calculateCartTotal() {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// ==================== CHECKOUT ITEMS ====================

function loadCheckoutItems() {
    const checkoutProductList = document.getElementById('checkoutProductList');
    if (!checkoutProductList) return;
    
    if (cartItems.length === 0) {
        checkoutProductList.innerHTML = `
            <div class="empty-checkout">
                <i class="fas fa-shopping-cart"></i>
                <p>Keranjang belanja kosong</p>
            </div>
        `;
        return;
    }
    
    checkoutProductList.innerHTML = cartItems.map(item => `
        <div class="checkout-product-item" data-product-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="checkout-product-image">
            <div class="checkout-product-info">
                <h5>${item.name}</h5>
                <div class="checkout-product-price">Rp ${item.price.toLocaleString()}</div>
            </div>
            <div class="checkout-product-quantity">
                <button class="quantity-control decrease" onclick="updateCheckoutQuantity('${item.id}', ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-control increase" onclick="updateCheckoutQuantity('${item.id}', ${item.quantity + 1})">+</button>
            </div>
            <div class="checkout-product-subtotal">
                Rp ${(item.price * item.quantity).toLocaleString()}
            </div>
        </div>
    `).join('');
}

window.updateCheckoutQuantity = function(productId, newQuantity) {
    updateCartQuantity(productId, newQuantity);
};

function calculateCheckoutTotals() {
    const subtotal = calculateCartTotal();
    const shippingCost = 15000; // Fixed shipping cost
    const grandTotal = subtotal + shippingCost;
    
    document.getElementById('subtotal').textContent = `Rp ${subtotal.toLocaleString()}`;
    document.getElementById('shippingCost').textContent = `Rp ${shippingCost.toLocaleString()}`;
    document.getElementById('grandTotal').textContent = `Rp ${grandTotal.toLocaleString()}`;
}

// ==================== PAYMENT METHODS ====================

function setupPaymentMethods() {
    const paymentOptions = document.querySelectorAll('.payment-option');
    const paymentDetails = document.querySelectorAll('.payment-details');
    
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            const method = this.getAttribute('data-method');
            
            // Update active class
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            // Show corresponding payment details
            paymentDetails.forEach(detail => {
                detail.classList.remove('active');
                if (detail.id === `${method}Payment`) {
                    detail.classList.add('active');
                }
            });
        });
    });
}

// ==================== ORDER PROCESSING ====================

function processOrder() {
    // Get customer information
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    const customerAddress = document.getElementById('customerAddress').value.trim();
    const customerNote = document.getElementById('customerNote').value.trim();
    
    // Validate customer info
    if (!customerName || !customerPhone || !customerAddress) {
        showNotification('Harap isi semua informasi pelanggan', 'error');
        return;
    }
    
    // Get payment method
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const paymentMethodText = getPaymentMethodText(paymentMethod);
    
    // Calculate totals
    const subtotal = calculateCartTotal();
    const shippingCost = 15000;
    const grandTotal = subtotal + shippingCost;
    
    // Generate order ID
    const orderId = generateOrderId();
    
    // Create order object
    const order = {
        id: orderId,
        date: new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        status: 'pending',
        items: [...cartItems],
        customer: {
            name: customerName,
            phone: customerPhone,
            address: customerAddress,
            note: customerNote
        },
        shipping: {
            method: 'JNE Reguler',
            cost: shippingCost,
            estimate: '2-3 hari kerja'
        },
        payment: {
            method: paymentMethod,
            status: 'pending',
            total: grandTotal
        }
    };
    
    // Save order to localStorage
    userOrders.push(order);
    localStorage.setItem('userOrders', JSON.stringify(userOrders));
    
    // Clear cart
    cartItems = [];
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    
    // Close checkout modal
    closeCheckoutModal();
    
    // Show order confirmation
    showOrderConfirmation(order, paymentMethodText);
}

function getPaymentMethodText(method) {
    const methods = {
        'qris': 'QRIS',
        'transfer': 'Transfer Bank',
        'cod': 'COD (Cash on Delivery)'
    };
    return methods[method] || method;
}

// ==================== ORDER CONFIRMATION ====================

function setupOrderConfirmation() {
    const orderConfirmationModal = document.getElementById('orderConfirmationModal');
    const closeOrderModal = document.getElementById('closeOrderModal');
    const whatsappConfirm = document.getElementById('whatsappConfirm');
    
    if (!orderConfirmationModal) return;
    
    // Close confirmation modal
    if (closeOrderModal) {
        closeOrderModal.addEventListener('click', function() {
            orderConfirmationModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
    
    // WhatsApp confirmation
    if (whatsappConfirm) {
        whatsappConfirm.addEventListener('click', function() {
            const orderNumber = document.getElementById('orderNumber').textContent;
            const orderTotal = document.getElementById('orderTotal').textContent;
            
            const message = `Halo Galeri Hijab, saya ingin konfirmasi pesanan:\n\n` +
                          `No. Pesanan: ${orderNumber}\n` +
                          `Total: ${orderTotal}\n\n` +
                          `Silakan proses pesanan saya. Terima kasih!`;
            
            const phoneNumber = '6281234567890'; // Nomor WhatsApp admin
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank');
        });
    }
    
    // Close on outside click
    orderConfirmationModal.addEventListener('click', function(e) {
        if (e.target === orderConfirmationModal) {
            orderConfirmationModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
}

function showOrderConfirmation(order, paymentMethodText) {
    const orderConfirmationModal = document.getElementById('orderConfirmationModal');
    if (!orderConfirmationModal) return;
    
    // Update order information
    document.getElementById('orderNumber').textContent = order.id;
    document.getElementById('orderTotal').textContent = `Rp ${order.payment.total.toLocaleString()}`;
    document.getElementById('orderPaymentMethod').textContent = paymentMethodText;
    
    // Update message based on payment method
    let orderMessage = '';
    if (order.payment.method === 'cod') {
        orderMessage = 'Pesanan Anda telah berhasil dibuat. Pembayaran dilakukan saat barang diterima.';
    } else if (order.payment.method === 'transfer') {
        orderMessage = 'Pesanan Anda telah berhasil dibuat. Silakan transfer ke rekening yang tertera.';
    } else {
        orderMessage = 'Pesanan Anda telah berhasil dibuat. Silakan scan QR code untuk pembayaran.';
    }
    
    document.getElementById('orderMessage').textContent = orderMessage;
    
    // Show modal
    orderConfirmationModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Auto close after 10 seconds
    setTimeout(() => {
        if (orderConfirmationModal.style.display === 'flex') {
            orderConfirmationModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }, 10000);
}

// ==================== UTILITY FUNCTIONS ====================

function generateProductId(productName) {
    return productName.toLowerCase()
        .replace(/[^\w\s-]/gi, '')
        .replace(/\s+/g, '-')
        .trim();
}

function parsePrice(priceText) {
    // Remove currency symbols and non-numeric characters
    const numericString = priceText.replace(/[^\d,-]/g, '')
        .replace(/\./g, '')
        .replace(',', '.');
    
    return parseFloat(numericString) || 0;
}

function generateOrderId() {
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 1000);
    return `GH${timestamp}${randomNum}`;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 15px;
        animation: slideIn 0.3s ease;
    `;
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Add to document
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

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
    
    .checkout-product-quantity {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .quantity-control {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        border: 1px solid #ddd;
        background: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .quantity-control:hover {
        background: #f5f5f5;
    }
    
    .checkout-product-subtotal {
        font-weight: bold;
        color: #a777e3;
    }
    
    .payment-option.selected {
        border-color: #a777e3;
        background: rgba(167, 119, 227, 0.1);
    }
    
    .cart-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        border-bottom: 1px solid #eee;
    }
    
    .cart-item img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 5px;
    }
    
    .cart-item-info {
        flex: 1;
    }
    
    .quantity-controls {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 5px;
    }
    
    .quantity-controls button {
        width: 25px;
        height: 25px;
        border: 1px solid #ddd;
        background: white;
        border-radius: 3px;
        cursor: pointer;
    }
    
    .remove-item {
        background: none;
        border: none;
        font-size: 20px;
        color: #ff6b8b;
        cursor: pointer;
        padding: 5px 10px;
    }
    
    .empty-cart, .empty-checkout {
        text-align: center;
        padding: 40px 20px;
        color: #999;
    }
    
    .empty-cart i, .empty-checkout i {
        font-size: 48px;
        margin-bottom: 15px;
        opacity: 0.5;
    }
`;
document.head.appendChild(style);