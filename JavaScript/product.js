
 (function () {
   function getProducts() {
     return Array.isArray(window.COFFEE_PRODUCTS) ? window.COFFEE_PRODUCTS : [];
   }

   function setCardProduct(card, product) {
     card.dataset.productId = String(product.id);

     var title = card.querySelector('.card-title');
     if (title) title.textContent = product.name;

     var text = card.querySelector('.card-text');
     if (text) text.textContent = product.description;

     var priceEl = card.querySelector('.price p');
     if (priceEl) priceEl.textContent = '$' + Number(product.price).toFixed(2);

     var img = card.querySelector('img');
     if (img) img.src = product.image;

     var btn = card.querySelector('.price a.btn');
     if (btn) {
       btn.href = 'product-detail.html?id=' + encodeURIComponent(product.id);
       btn.addEventListener('click', function (e) {
         e.preventDefault();
         window.location.href = btn.href;
       });
     }

     card.addEventListener('click', function (e) {
       var t = e.target;
       if (t && t.closest && t.closest('a')) return;
       window.location.href = 'product-detail.html?id=' + encodeURIComponent(product.id);
     });
   }

   function hydrateSectionCards(selector, products) {
     var cards = document.querySelectorAll(selector);
     for (var i = 0; i < cards.length && i < products.length; i++) {
       setCardProduct(cards[i], products[i]);
     }
   }

   document.addEventListener('DOMContentLoaded', function () {
     var products = getProducts();
     if (products.length === 0) return;

     var coffee = products.filter(function (p) { return p.category !== 'Dessert'; }).slice(0, 8);
     var dessert = products.filter(function (p) { return p.category === 'Dessert'; }).slice(0, 8);

     hydrateSectionCards('#product .card', coffee);
     hydrateSectionCards('#product-2 .card', dessert);
   });
 })();

