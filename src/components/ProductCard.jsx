import React from 'react';

export default function ProductCard({ product, onAddToCart, onToggleWishlist, isWishlisted }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
  };

  return (
    <div className="product-card">
      <div className="media">
        {product.discountPercentage > 0 && (
          <span className="discount-badge">-{product.discountPercentage}%</span>
        )}
        <span className="uzum-tag-badge">{product.badge || "Mashhur"}</span>
        <button 
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
          title="Saralanganlarga qo'shish"
        >
          <i className={`bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'}`}></i>
        </button>

        <img src={product.thumbnail} alt={product.title} className="thumbnail" loading="lazy" />
      </div>

      <div className="body">
        <span className="stock-info">Omborda: {product.stock || 15} ta</span>
        <h1 title={product.title}>{product.title}</h1>
        
        <div className="rating">
          <span className="star">★</span>
          <span>{product.rating}</span>
          <span className="reviews-count">({product.reviewsCount} ta sharh)</span>
        </div>

        <div className="uzum-installment-badge">
          {formatPrice(product.monthlyPrice || Math.round(product.price / 12))} / oy
        </div>

        <div className="price-row">
          <span className="uzum-main-price">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="uzum-old-price">{formatPrice(product.oldPrice)}</span>
          )}
        </div>

        <div className="card-buttons-group">
          <button className="btn-cart" onClick={() => onAddToCart(product)}>
            <i className="bi bi-cart-plus"></i> Savatga
          </button>
          <button className="btn-buy" onClick={() => onAddToCart(product, true)}>
            Sotib olish
          </button>
        </div>
      </div>
    </div>
  );
}
