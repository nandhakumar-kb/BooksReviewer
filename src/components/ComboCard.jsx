import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ComboCard = ({ combo }) => {
  const { addToCart } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const discount = combo.original_price 
    ? Math.round(((combo.original_price - combo.price) / combo.original_price) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    
    // Add combo as a special item to cart
    addToCart({
      id: `combo-${combo.id}`,
      title: combo.title,
      price: combo.price,
      image_url: combo.image_url,
      isCombo: true,
      comboId: combo.id,
      quantity: 1
    });

    // Show feedback and auto-open cart after delay
    setTimeout(() => {
      setIsAdding(false);
    }, 300);
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Combo Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
          <Package className="w-4 h-4" />
          COMBO
        </span>
      </div>

      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
            {discount}% OFF
          </span>
        </div>
      )}

      {/* Image Container */}
      <Link to={`/combo/${combo.id}`} className="block relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 animate-pulse">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={combo.image_url}
          alt={combo.title}
          className={`w-full h-full object-contain transition-all duration-500 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } group-hover:scale-105`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = '/placeholder-combo.png'
            setImageLoaded(true)
          }}
          loading="lazy"
          decoding="async"
          fetchpriority="low"
        />
      </Link>

      {/* Content */}
      <div className="p-6">
        <Link to={`/combo/${combo.id}`}>
          <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {combo.title}
          </h3>
        </Link>

        {combo.description && (
          <p className="text-base text-gray-600 mb-4 line-clamp-2">
            {combo.description}
          </p>
        )}

        {/* Price Section */}
        <div className="flex items-center gap-4 mb-5">
          <span className="text-3xl font-bold text-purple-600">
            ₹{combo.price}
          </span>
          {combo.original_price && (
            <span className="text-xl text-gray-400 line-through">
              ₹{combo.original_price}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full py-4 rounded-lg font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
            isAdding
              ? 'bg-green-500 text-white'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
        >
          {isAdding ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Added!
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ComboCard;
