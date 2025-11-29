// Payment System JavaScript
const checkoutModal = document.getElementById('checkoutModal');
const orderConfirmationModal = document.getElementById('orderConfirmationModal');
const confirmOrderBtn = document.getElementById('confirmOrder');
const cancelCheckoutBtn = document.getElementById('cancelCheckout');
const closeOrderModalBtn = document.getElementById('closeOrderModal');
const whatsappConfirmBtn = document.getElementById('whatsappConfirm');
const paymentOptions = document.querySelectorAll('.payment-option input[type="radio"]');
const paymentDetails = document.querySelectorAll('.payment-details');

// Cart elements
const cartCount = document.querySelector('.cart-count');
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
const buyNowBtn = document.getElementById('buyNowBtn');

// Product detail modal elements
const detailTitle = document.getElementById('detailTitle');
const detailPrice = document.getElementById('detailPrice');
const detailImage = document.getElementById('detailImage');

// Cart data
let cartItems = [];
let currentQuantity = 1;
const shippingCost = 15000;
const codFee = 5000;

// Initialize payment system
function initializePaymentSystem() {
    // Payment method change
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            const method = this.value;
            showPaymentDetails(method);
            updateTotal();
        });
    });

    // Confirm order
    confirmOrderBtn.addEventListener('click', processOrder);
    
    // Cancel checkout
    cancelCheckoutBtn.addEventListener('click', () => {
        checkoutModal.style.display = 'none';
        enableBodyScroll();
    });
    
    // Close order confirmation
    closeOrderModalBtn.addEventListener('click', () => {
        orderConfirmationModal.style.display = 'none';
        enableBodyScroll();
        clearCart();
    });
    
    // WhatsApp confirmation
    whatsappConfirmBtn.addEventListener('click', sendWhatsAppConfirmation);
    
    // Quantity controls in product detail
    const quantityDecrease = document.getElementById('quantityDecrease');
    const quantityIncrease = document.getElementById('quantityIncrease');
    const quantityDisplay = document.getElementById('quantityDisplay');
    
    if (quantityDecrease && quantityIncrease && quantityDisplay) {
        quantityDecrease.addEventListener('click', () => {
            if (currentQuantity > 1) {
                currentQuantity--;
                quantityDisplay.textContent = currentQuantity;
            }
        });
        
        quantityIncrease.addEventListener('click', () => {
            currentQuantity++;
            quantityDisplay.textContent = currentQuantity;
        });
    }
    
    // Add to cart from detail modal
    const addToCartDetailBtn = document.getElementById('addToCartDetailBtn');
    if (addToCartDetailBtn) {
        addToCartDetailBtn.addEventListener('click', function() {
            const productTitle = detailTitle.textContent;
            const productPrice = detailPrice.textContent;
            const productImage = detailImage.src;
            
            const product = {
                title: productTitle,
                price: productPrice,
                image: productImage
            };
            
            addToCart(product, currentQuantity);
            closeProductDetail();
            showNotification(`${product.title} ditambahkan ke keranjang`, 'success');
        });
    }
}

// Show payment details based on selected method
function showPaymentDetails(method) {
    paymentDetails.forEach(detail => {
        detail.classList.remove('active');
    });
    
    const activeDetail = document.getElementById(`${method}Payment`);
    if (activeDetail) {
        activeDetail.classList.add('active');
    }
}

// Open checkout modal
function openCheckout() {
    if (cartItems.length === 0) {
        showNotification('Keranjang belanja kosong', 'error');
        return;
    }
    
    updateCheckoutDisplay();
    checkoutModal.style.display = 'flex';
    disableBodyScroll();
}

// Update checkout display
function updateCheckoutDisplay() {
    const productList = document.getElementById('checkoutProductList');
    productList.innerHTML = '';
    
    cartItems.forEach((item, index) => {
        const productElement = document.createElement('div');
        productElement.className = 'checkout-product-item';
        productElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="checkout-product-image">
            <div class="checkout-product-info">
                <h5>${item.name}</h5>
                <div class="checkout-product-price">${item.price}</div>
            </div>
            <div class="checkout-product-quantity">
                <button class="quantity-control decrease" data-index="${index}">-</button>
                <span>${item.quantity}x</span>
                <button class="quantity-control increase" data-index="${index}">+</button>
            </div>
        `;
        productList.appendChild(productElement);
    });
    
    // Add event listeners for quantity controls
    document.querySelectorAll('.quantity-control.decrease').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            if (cartItems[index].quantity > 1) {
                cartItems[index].quantity--;
                updateCheckoutDisplay();
                updateCartCount();
            } else {
                cartItems.splice(index, 1);
                updateCheckoutDisplay();
                updateCartCount();
            }
        });
    });
    
    document.querySelectorAll('.quantity-control.increase').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            cartItems[index].quantity++;
            updateCheckoutDisplay();
            updateCartCount();
        });
    });
    
    updateTotal();
}

// Update total calculation
function updateTotal() {
    const subtotal = calculateSubtotal();
    const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
    const finalShippingCost = selectedPayment && selectedPayment.value === 'cod' ? shippingCost + codFee : shippingCost;
    const grandTotal = subtotal + finalShippingCost;
    
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('shippingCost').textContent = formatCurrency(finalShippingCost);
    document.getElementById('grandTotal').textContent = formatCurrency(grandTotal);
}

// Calculate subtotal
function calculateSubtotal() {
    return cartItems.reduce((total, item) => {
        const price = extractPrice(item.price);
        return total + (price * item.quantity);
    }, 0);
}

// Extract price from string (remove currency symbols and text)
function extractPrice(priceString) {
    // Remove emojis, text, and keep only numbers
    const numericString = priceString.replace(/[^\d,-]/g, '').replace(',', '');
    // Handle price ranges (take the lowest price)
    if (numericString.includes('-')) {
        return parseInt(numericString.split('-')[0]) || 0;
    }
    return parseInt(numericString) || 0;
}

// Format currency
function formatCurrency(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

// Process order
function processOrder() {
    const customerForm = document.getElementById('customerForm');
    if (!customerForm.checkValidity()) {
        showNotification('Harap lengkapi semua informasi pelanggan', 'error');
        return;
    }
    
    // Get customer data
    const customerData = {
        name: document.getElementById('customerName').value,
        phone: document.getElementById('customerPhone').value,
        address: document.getElementById('customerAddress').value,
        note: document.getElementById('customerNote').value
    };
    
    // Validate phone number
    if (!isValidPhoneNumber(customerData.phone)) {
        showNotification('Nomor telepon tidak valid', 'error');
        return;
    }
    
    // Get payment method
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const subtotal = calculateSubtotal();
    const finalShippingCost = paymentMethod === 'cod' ? shippingCost + codFee : shippingCost;
    const orderTotal = subtotal + finalShippingCost;
    
    // Generate order number
    const orderNumber = 'GH' + new Date().getTime().toString().slice(-8);
    
    // Show confirmation
    showOrderConfirmation(orderNumber, orderTotal, paymentMethod, customerData);
    
    // Close checkout modal
    checkoutModal.style.display = 'none';
}

// Validate phone number
function isValidPhoneNumber(phone) {
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Show order confirmation
function showOrderConfirmation(orderNumber, total, paymentMethod, customerData) {
    document.getElementById('orderNumber').textContent = orderNumber;
    document.getElementById('orderTotal').textContent = formatCurrency(total);
    document.getElementById('orderPaymentMethod').textContent = getPaymentMethodName(paymentMethod);
    
    let message = 'Pesanan Anda telah berhasil dibuat dan sedang diproses. ';
    if (paymentMethod === 'cod') {
        message += 'Kurir akan menghubungi Anda untuk konfirmasi pengiriman.';
    } else {
        message += 'Silakan selesaikan pembayaran dan konfirmasi via WhatsApp.';
    }
    document.getElementById('orderMessage').textContent = message;
    
    // Store order data for WhatsApp
    window.lastOrderData = {
        orderNumber,
        total,
        paymentMethod,
        customerData,
        items: [...cartItems] // Copy cart items
    };
    
    orderConfirmationModal.style.display = 'flex';
}

// Get payment method name
function getPaymentMethodName(method) {
    const methods = {
        'qris': 'QRIS',
        'transfer': 'Transfer Bank',
        'cod': 'COD (Cash on Delivery)'
    };
    return methods[method] || method;
}

// Send WhatsApp confirmation
function sendWhatsAppConfirmation() {
    const order = window.lastOrderData;
    if (!order) return;
    
    const phoneNumber = '6281234567890'; // Ganti dengan nomor WhatsApp toko
    let message = `Halo Galeri Hijab, saya ingin konfirmasi pesanan:\n\n`;
    message += `📦 *No. Pesanan:* ${order.orderNumber}\n`;
    message += `👤 *Nama:* ${order.customerData.name}\n`;
    message += `📞 *Telepon:* ${order.customerData.phone}\n`;
    message += `📍 *Alamat:* ${order.customerData.address}\n\n`;
    
    message += `🛍️ *Detail Pesanan:*\n`;
    order.items.forEach(item => {
        message += `• ${item.name} (${item.quantity}x) - ${item.price}\n`;
    });
    
    message += `\n💰 *Total Pembayaran:* ${formatCurrency(order.total)}\n`;
    message += `💳 *Metode Bayar:* ${getPaymentMethodName(order.paymentMethod)}\n`;
    
    if (order.customerData.note) {
        message += `📝 *Catatan:* ${order.customerData.note}\n`;
    }
    
    message += `\n_Saya sudah melakukan pembayaran sesuai dengan total di atas._`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

// Cart management functions
function addToCart(product, quantity = 1) {
    const existingItem = cartItems.find(item => item.name === product.title);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartItems.push({
            name: product.title,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    updateCartCount();
}

function clearCart() {
    cartItems = [];
    updateCartCount();
}

function updateCartCount() {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    localStorage.setItem('cartCount', totalItems);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function loadCartFromStorage() {
    const savedCartCount = localStorage.getItem('cartCount');
    const savedCartItems = localStorage.getItem('cartItems');
    
    if (savedCartCount) {
        cartCount.textContent = savedCartCount;
    }
    
    if (savedCartItems) {
        cartItems = JSON.parse(savedCartItems);
    }
}

// Modal control functions
function disableBodyScroll() {
    document.body.classList.add('no-scroll');
}

function enableBodyScroll() {
    document.body.classList.remove('no-scroll');
}

function closeProductDetail() {
    const productDetailModal = document.getElementById('productDetailModal');
    if (productDetailModal) {
        productDetailModal.style.display = 'none';
        enableBodyScroll();
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'info': 'info-circle',
        'warning': 'exclamation-triangle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        'success': '#28a745',
        'error': '#dc3545',
        'info': '#17a2b8',
        'warning': '#ffc107'
    };
    return colors[type] || '#17a2b8';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePaymentSystem();
    loadCartFromStorage();
    
    // Add event listeners to all "Beli Sekarang" buttons
    const buyNowButtons = document.querySelectorAll('.btn-buy, .cta-button');
    buyNowButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (cartItems.length === 0) {
                showNotification('Tambahkan produk ke keranjang terlebih dahulu', 'info');
                return;
            }
            openCheckout();
        });
    });
    
    // Add event listeners to cart icon
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            openCheckout();
        });
    }
    
    // Add CSS animations for notifications
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .notification-content i {
                font-size: 1.2rem;
            }
        `;
        document.head.appendChild(style);
    }
});

// Export functions for global access (if needed)
window.openCheckout = openCheckout;
window.addToCart = addToCart;
window.clearCart = clearCart;