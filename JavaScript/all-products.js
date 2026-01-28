(function () {
  function getProducts() {
    return Array.isArray(window.COFFEE_PRODUCTS) ? window.COFFEE_PRODUCTS : [];
  }

  function norm(v) {
    return String(v == null ? '' : v)
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  function getCategoryFromQuery() {
    var params = new URLSearchParams(window.location.search);
    var c = params.get('category');
    return c ? String(c) : '';
  }

  function applyCategoryFilter(products, categoryRaw) {
    var c = norm(categoryRaw);
    if (!c) return products;

    // Support special shortcut: category=coffee means everything except Dessert
    if (c === 'coffee' || c === 'coffees') {
      return products.filter(function (p) {
        return norm(p.category) !== 'dessert';
      });
    }

    // Support category=dessert
    if (c === 'dessert' || c === 'desert') {
      return products.filter(function (p) {
        return norm(p.category) === 'dessert';
      });
    }

    // Otherwise match category text
    return products.filter(function (p) {
      return norm(p.category) === c;
    });
  }

  function el(tag, className) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  }

  function toDetail(id) {
    window.location.href = 'product-detail.html?id=' + encodeURIComponent(id);
  }

  function render(products) {
    var grid = document.getElementById('grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (!products || products.length === 0) {
      var empty = el('div', 'text-center text-muted');
      empty.style.padding = '40px 10px';
      empty.style.background = 'rgba(255,255,255,0.65)';
      empty.style.borderRadius = '14px';
      empty.textContent = 'No products found.';
      grid.appendChild(empty);
      return;
    }

    for (var i = 0; i < products.length; i++) {
      (function (p) {
        var card = el('div', 'p-card');

        var img = document.createElement('img');
        img.src = p.image;
        img.alt = p.name;

        var body = el('div', 'p-body');

        var name = el('p', 'p-name');
        name.textContent = p.name;

        var cat = el('div', 'p-cat');
        cat.textContent = p.category;

        var desc = el('div', 'p-desc');
        desc.textContent = p.description;

        var row = el('div', 'p-row');
        var price = el('div', 'p-price');
        price.textContent = '$' + Number(p.price).toFixed(2);

        var btn = el('button', 'p-btn');
        btn.type = 'button';
        btn.textContent = 'View';
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          toDetail(p.id);
        });

        row.appendChild(price);
        row.appendChild(btn);

        body.appendChild(name);
        body.appendChild(cat);
        body.appendChild(desc);
        body.appendChild(row);

        card.appendChild(img);
        card.appendChild(body);

        card.addEventListener('click', function () {
          toDetail(p.id);
        });

        grid.appendChild(card);
      })(products[i]);
    }
  }

  function bindSearch(all) {
    var input = document.getElementById('searchInput');
    if (!input) return;

    var timer = null;

    function apply() {
      var q = norm(input.value);
      if (!q) {
        render(all);
        return;
      }
      var filtered = all.filter(function (p) {
        var hay = [
          norm(p.name),
          norm(p.category),
          norm(p.description),
          norm(p.ingredients),
          norm(p.size),
          norm(p.price)
        ].join(' | ');
        return (
          hay.indexOf(q) !== -1
        );
      });
      render(filtered);
    }

    function debounceApply() {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(apply, 120);
    }

    input.addEventListener('input', debounceApply);

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        input.value = '';
        render(all);
      }
      if (e.key === 'Enter') {
        apply();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var all = getProducts();
    var category = getCategoryFromQuery();
    var base = applyCategoryFilter(all, category);
    render(base);
    bindSearch(base);
  });
})();
