import React from 'react';

export default function Header({ 
  searchTerm, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange,
  sortOrder,
  onSortChange,
  cartCount,
  wishlistCount,
  onLogout
}) {
  return (
    <header className="header">
      <h1 className="brand-logo">odiljon</h1>
      
      <input 
        type="text" 
        className="searchInp" 
        placeholder="Mahsulotlarni qidiring..." 
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <select 
        className="category-select"
        value={selectedCategory} 
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="all">Barcha toifalar</option>
        <option value="Elektronika">Elektronika</option>
        <option value="Maishiy texnika">Maishiy texnika</option>

        <option value="Kiyim-kechak">Kiyim-kechak</option>
        <option value="Go'zallik va parvarish">Go'zallik va parvarish</option>
        <option value="Uy-ro'zg'or buyumlari">Uy-ro'zg'or buyumlari</option>
      </select>

      <select 
        id="tanlov"
        value={sortOrder}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="new">Qimmat</option>
        <option value="old">Arzon</option>
      </select>

      <a href="./html/wishlist.html" className="header-cart-btn" style={{ background: '#fdf2f8', color: '#ec4899' }}>
        <i className="bi bi-heart-fill"></i> Saralanganlar 
        <span className="badge-count" style={{ background: '#ec4899' }}>{wishlistCount}</span>
      </a>

      <a href="./html/orders.html" className="header-cart-btn" style={{ background: '#eff6ff', color: '#3b82f6' }}>
        <i className="bi bi-box-seam-fill"></i> Buyurtmalarim
      </a>

      <a href="./html/cart.html" className="header-cart-btn">
        <i className="bi bi-cart3"></i> Savatcha 
        <span id="cart-count-badge">{cartCount}</span>
      </a>

      <button id="logout" onClick={onLogout}>Chiqish</button>
    </header>
  );
}
