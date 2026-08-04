import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';

export default function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('new');
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('wishlist')) || []);

  useEffect(() => {
    // Load products from API / local dataset
    if (window.initialUzumProducts) {
      setProducts(window.initialUzumProducts);
    } else {
      fetch('/api/products')
        .then(res => res.json())
        .then(data => setProducts(data.products || []))
        .catch(err => console.error("API error:", err));
    }
  }, []);

  const handleAddToCart = (product, directBuy = false) => {
    let updatedCart = [...cart];
    let existingIndex = updatedCart.findIndex(item => item.id === product.id);

    if (existingIndex !== -1) {
      updatedCart[existingIndex].quantity = (updatedCart[existingIndex].quantity || 1) + 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    if (directBuy) {
      window.location.href = './html/cart.html';
    } else {
      alert(`✅ "${product.title}" savatga qo'shildi!`);
    }
  };

  const handleToggleWishlist = (product) => {
    let updatedWishlist = [...wishlist];
    let idx = updatedWishlist.findIndex(item => item.id === product.id);

    if (idx !== -1) {
      updatedWishlist.splice(idx, 1);
    } else {
      updatedWishlist.push(product);
    }

    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  const filteredProducts = products.filter(p => {
    const matchesCat = category === 'all' || (p.category && p.category.toLowerCase() === category.toLowerCase());
    const matchesSearch = !searchTerm || (p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  }).sort((a, b) => {
    return sortOrder === 'new' ? b.price - a.price : a.price - b.price;
  });

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <div className="react-app-wrapper">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={category}
        onCategoryChange={setCategory}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        onLogout={() => {
          localStorage.removeItem('user');
          window.location.href = './html/login.html';
        }}
      />

      <main id="container">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={wishlist.some(w => w.id === product.id)}
          />
        ))}
      </main>
    </div>
  );
}
