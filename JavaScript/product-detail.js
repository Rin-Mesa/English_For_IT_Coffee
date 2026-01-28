(function () {
  function norm(v) {
    return String(v == null ? '' : v)
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  function getProducts() {
    return Array.isArray(window.COFFEE_PRODUCTS) ? window.COFFEE_PRODUCTS : [];
  }

  function getIdFromQuery() {
    var params = new URLSearchParams(window.location.search);
    var idStr = params.get('id');
    var id = Number(idStr);
    return Number.isFinite(id) ? id : null;
  }

  function loadCart() {
    try {
      return JSON.parse(localStorage.getItem('coffee_cart') || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem('coffee_cart', JSON.stringify(cart));
  }

  function loadOrders() {
    try {
      return JSON.parse(localStorage.getItem('coffeeOrders') || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveOrders(orders) {
    localStorage.setItem('coffeeOrders', JSON.stringify(orders));
  }

  function updateCartBadge() {
    var cart = loadCart();
    var count = 0;
    for (var i = 0; i < cart.length; i++) count += Number(cart[i].quantity || 0);
    var badge = document.getElementById('cartCount');
    if (badge) badge.textContent = String(count);
  }

  function calcCartTotal(cart) {
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
      total += Number(cart[i].price) * Number(cart[i].quantity);
    }
    return total;
  }

  function renderCartDropdown() {
    var dropdown = document.getElementById('cartDropdown');
    var itemsEl = document.getElementById('cartItems');
    var totalEl = document.getElementById('cartTotal');
    if (!dropdown || !itemsEl || !totalEl) return;

    var cart = loadCart();
    itemsEl.innerHTML = '';

    if (cart.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'text-muted';
      empty.style.padding = '12px';
      empty.textContent = 'Your cart is empty.';
      itemsEl.appendChild(empty);
      totalEl.textContent = '$0.00';
      return;
    }

    for (var i = 0; i < cart.length; i++) {
      (function (item) {
        var row = document.createElement('div');
        row.className = 'cart-item';

        var left = document.createElement('div');
        left.style.display = 'grid';
        left.style.gap = '2px';

        var name = document.createElement('div');
        name.className = 'name';
        name.textContent = item.name;

        var sub = document.createElement('div');
        sub.className = 'sub';
        sub.textContent = '$' + Number(item.price).toFixed(2) + ' x ' + Number(item.quantity);

        left.appendChild(name);
        left.appendChild(sub);

        var right = document.createElement('div');
        right.style.display = 'flex';
        right.style.alignItems = 'center';
        right.style.gap = '10px';

        var lineTotal = document.createElement('div');
        lineTotal.style.fontWeight = '800';
        lineTotal.textContent = '$' + (Number(item.price) * Number(item.quantity)).toFixed(2);

        var remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'remove';
        remove.textContent = '×';
        remove.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          removeFromCart(item.id);
        });

        right.appendChild(lineTotal);
        right.appendChild(remove);

        row.appendChild(left);
        row.appendChild(right);
        itemsEl.appendChild(row);
      })(cart[i]);
    }

    totalEl.textContent = '$' + calcCartTotal(cart).toFixed(2);
  }

  function toggleCartDropdown(forceOpen) {
    var dropdown = document.getElementById('cartDropdown');
    if (!dropdown) return;
    if (forceOpen === true) {
      dropdown.classList.add('show');
    } else if (forceOpen === false) {
      dropdown.classList.remove('show');
    } else {
      dropdown.classList.toggle('show');
    }
    if (dropdown.classList.contains('show')) {
      renderCartDropdown();
    }
  }

  function removeFromCart(productId) {
    var cart = loadCart();
    var next = [];
    for (var i = 0; i < cart.length; i++) {
      if (Number(cart[i].id) !== Number(productId)) next.push(cart[i]);
    }
    saveCart(next);
    updateCartBadge();
    renderCartDropdown();
  }

  function setMessage(text, type) {
    var el = document.getElementById('message');
    if (!el) return;
    var cls = type === 'error' ? 'alert alert-danger' : 'alert alert-success';
    el.className = cls;
    el.textContent = text;
  }

  function setBuyMessage(text, type) {
    var el = document.getElementById('buyMsg');
    if (!el) return;
    var cls = type === 'error' ? 'alert alert-danger' : 'alert alert-success';
    el.className = cls;
    el.textContent = text;
  }

  function openBuyModal(product, qty) {
    var modal = document.getElementById('buyModal');
    if (!modal) return;

    var buyProduct = document.getElementById('buyProduct');
    var buyQty = document.getElementById('buyQty');
    var buyTotal = document.getElementById('buyTotal');
    if (buyProduct) buyProduct.textContent = product.name;
    if (buyQty) buyQty.textContent = String(qty);
    if (buyTotal) buyTotal.textContent = '$' + (Number(product.price) * Number(qty)).toFixed(2);

    setBuyMessage('', 'success');

    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeBuyModal() {
    var modal = document.getElementById('buyModal');
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  }

  function bindBuyModalHandlers() {
    var closeBtn = document.getElementById('buyClose');
    var overlay = document.getElementById('buyOverlay');
    if (closeBtn) closeBtn.addEventListener('click', closeBuyModal);
    if (overlay) overlay.addEventListener('click', closeBuyModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeBuyModal();
    });
  }

  function createOrder(product, qty) {
    var name = norm(document.getElementById('buyName') && document.getElementById('buyName').value);
    var phone = norm(document.getElementById('buyPhone') && document.getElementById('buyPhone').value);
    var email = (document.getElementById('buyEmail') && document.getElementById('buyEmail').value) || '';
    var address = (document.getElementById('buyAddress') && document.getElementById('buyAddress').value) || '';

    if (!name || !phone) {
      setBuyMessage('Please fill in Full Name and Phone Number.', 'error');
      return null;
    }

    var order = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      customer: {
        name: name,
        phone: phone,
        email: email,
        address: address
      },
      item: {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: qty
      },
      total: Number(product.price) * Number(qty)
    };

    return order;
  }

  function renderProduct(product) {
    document.getElementById('productImage').src = product.image;
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productDesc').textContent = product.description;
    document.getElementById('productCategory').textContent = product.category;
    document.getElementById('productIngredients').textContent = product.ingredients;
    document.getElementById('productSize').textContent = product.size;
    document.getElementById('productPrice').textContent = '$' + Number(product.price).toFixed(2);
  }

  function bindQtyControls() {
    var input = document.getElementById('qtyInput');
    var minus = document.getElementById('btnMinus');
    var plus = document.getElementById('btnPlus');

    function clamp() {
      var v = Number(input.value);
      if (!Number.isFinite(v) || v < 1) v = 1;
      if (v > 10) v = 10;
      input.value = String(v);
    }

    minus.addEventListener('click', function () {
      input.value = String(Math.max(1, Number(input.value) - 1));
      clamp();
    });

    plus.addEventListener('click', function () {
      input.value = String(Math.min(10, Number(input.value) + 1));
      clamp();
    });

    input.addEventListener('change', clamp);
  }

  function addToCart(product, quantity) {
    var cart = loadCart();
    var found = null;
    for (var i = 0; i < cart.length; i++) {
      if (Number(cart[i].id) === Number(product.id)) {
        found = cart[i];
        break;
      }
    }

    if (found) {
      found.quantity = Number(found.quantity || 0) + quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    }

    saveCart(cart);
    updateCartBadge();
  }

  function openCheckout() {
    // Simple checkout: show saved cart in an alert
    var cart = loadCart();
    if (cart.length === 0) {
      setMessage('Your cart is empty.', 'error');
      return;
    }

    var total = 0;
    var lines = [];
    for (var i = 0; i < cart.length; i++) {
      var item = cart[i];
      var itemTotal = Number(item.price) * Number(item.quantity);
      total += itemTotal;
      lines.push(item.name + ' x ' + item.quantity + ' = $' + itemTotal.toFixed(2));
    }

    lines.push('');
    lines.push('Total: $' + total.toFixed(2));
    alert(lines.join('\n'));
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateCartBadge();

    bindBuyModalHandlers();

    var cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
      cartBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleCartDropdown();
      });
    }

    var cartCheckout = document.getElementById('cartCheckout');
    if (cartCheckout) {
      cartCheckout.addEventListener('click', function (e) {
        e.preventDefault();
        openCheckout();
      });
    }

    document.addEventListener('click', function (e) {
      var dropdown = document.getElementById('cartDropdown');
      var wrap = document.querySelector('.cart-wrap');
      if (!dropdown || !wrap) return;
      if (!wrap.contains(e.target)) {
        toggleCartDropdown(false);
      }
    });

    var id = getIdFromQuery();
    if (id == null) {
      setMessage('Missing product id in URL. Example: product-detail.html?id=1', 'error');
      return;
    }

    var products = getProducts();
    var product = null;
    for (var i = 0; i < products.length; i++) {
      if (Number(products[i].id) === Number(id)) {
        product = products[i];
        break;
      }
    }

    if (!product) {
      setMessage('Product not found.', 'error');
      return;
    }

    renderProduct(product);
    bindQtyControls();

    document.getElementById('btnAdd').addEventListener('click', function () {
      var qty = Number(document.getElementById('qtyInput').value);
      if (!Number.isFinite(qty) || qty < 1) qty = 1;
      if (qty > 10) qty = 10;
      openBuyModal(product, qty);
    });

    var buyConfirm = document.getElementById('buyConfirm');
    if (buyConfirm) {
      buyConfirm.addEventListener('click', function () {
        var qty = Number(document.getElementById('qtyInput').value);
        if (!Number.isFinite(qty) || qty < 1) qty = 1;
        if (qty > 10) qty = 10;

        var order = createOrder(product, qty);
        if (!order) return;

        var orders = loadOrders();
        orders.push(order);
        saveOrders(orders);

        // Optionally add to cart as well (so cart icon list remains consistent)
        addToCart(product, qty);
        renderCartDropdown();

        setBuyMessage('Order placed successfully! Order #' + order.id, 'success');
        setMessage('Order placed successfully! Order #' + order.id, 'success');

        window.setTimeout(function () {
          closeBuyModal();
        }, 800);
      });
    }

    document.getElementById('btnCheckout').addEventListener('click', openCheckout);
  });
})();
