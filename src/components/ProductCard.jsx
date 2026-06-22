import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

export default function ProductCard({ product, isCombo = false }) {
  const { addToCart, setIsCartOpen } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const toast = useToast();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Wishlist logic (books only usually, but we can apply to both)
  const inWishlist = isInWishlist(product.id);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.info('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    
    // For combos, we don't have in_stock flag usually, default to true
    const inStock = isCombo ? true : product.in_stock;

    if (!inStock) return;

    setIsAdding(true);

    if (isCombo) {
      addToCart({
        id: `combo-${product.id}`,
        title: product.title,
        price: product.price,
        image_url: product.image_url,
        isCombo: true,
        comboId: product.id,
        quantity: 1
      });
      toast.success(`${product.title} added to cart`);
    } else {
      addToCart(product);
      toast.success(`${product.title} added to cart`);
    }

    setTimeout(() => {
      setIsAdding(false);
      setIsCartOpen(true);
    }, 300);
  };

  const productLink = isCombo ? `/combo/${product.id}` : `/product/${product.id}`;
  const inStock = isCombo ? true : product.in_stock;

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {isCombo && (
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 uppercase tracking-wider">
            <Package size={12} />
            Combo
          </span>
        )}
        {!isCombo && product.category && (
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
            {product.category}
          </span>
        )}
      </div>

      {discount > 0 && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
            {discount}% OFF
          </span>
        </div>
      )}

      {/* Wishlist Heart (if not combo) */}
      {!isCombo && (
        <button
          onClick={toggleWishlist}
          className="absolute top-12 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white hover:scale-110 transition-all z-10 focus:outline-none"
          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={16}
            className={`transition-colors ${
              inWishlist ? 'fill-pink-500 text-pink-500' : 'text-gray-400 hover:text-pink-500'
            }`}
          />
        </button>
      )}

      {/* Image Container */}
      <Link to={productLink} className={`block relative ${isCombo ? 'aspect-[4/3] bg-gradient-to-br from-purple-50 to-pink-50' : 'aspect-[2/3] bg-gray-100'} overflow-hidden`}>
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
            <div className="w-8 h-8 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={product.image_url}
          alt={product.title}
          className={`w-full h-full ${isCombo ? 'object-contain' : 'object-cover'} transition-all duration-500 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } group-hover:scale-105`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = isCombo ? '/placeholder-combo.png' : '/placeholder-book.png';
            setImageLoaded(true);
          }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {!inStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-4 py-2 bg-gray-900/90 text-white text-sm font-bold rounded-lg shadow-lg">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <Link to={productLink}>
          <h3 className={`font-bold text-gray-900 mb-1 line-clamp-2 leading-tight transition-colors ${isCombo ? 'text-lg group-hover:text-purple-600' : 'text-base group-hover:text-orange-600'}`}>
            {product.title}
          </h3>
        </Link>
        
        {!isCombo && product.author && (
          <p className="text-sm text-gray-500 mb-2 font-medium line-clamp-1">{product.author}</p>
        )}
        
        {isCombo && product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Rating Mock */}
        <div className="flex items-center gap-1 mb-4 mt-auto pt-2">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          <span className="text-sm font-bold text-gray-700">4.8</span>
          <span className="text-xs text-gray-400 ml-1">(120)</span>
        </div>

        {/* Price and Action */}
        <div className="pt-3 border-t border-gray-50">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-end gap-2">
              <span className={`font-bold ${isCombo ? 'text-2xl text-purple-600' : 'text-xl text-gray-900'}`}>
                ₹{Number(product.price).toFixed(0)}
              </span>
              {product.original_price && (
                <span className="text-sm text-gray-400 line-through mb-1">
                  ₹{Number(product.original_price).toFixed(0)}
                </span>
              )}
            </div>
            {inStock && !isCombo && (
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md uppercase">
                In Stock
              </span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!inStock || isAdding}
            className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              isCombo
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25'
                : 'bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/25'
            }`}
          >
            {isAdding ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <ShoppingCart size={16} />
            )}
            {!inStock ? 'Out of Stock' : isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
