import PropTypes from 'prop-types';
import { FaShareAlt, FaHeart } from 'react-icons/fa';

const ProductInfo = ({
  product,
  quantity,
  setQuantity,
  addToCart,
  handleBuyNow,
  handleShare,
}) => (
  <div className="flex-1 text-gray-100">
    <h2 className="text-3xl font-bold text-pink-500 mb-3">{product.name}</h2>
    
    <p className={`text-base mb-3 ${product.stock > 10 ? 'text-green-500' : 'text-red-500'}`}>
      {product.stock > 10
        ? `Stock disponible: ${product.stock}`
        : `¡Quedan solo ${product.stock} unidades!`}
    </p>

    <p className="text-base mb-3 text-gray-300">Descripción: {product.description}</p>
    <p className="text-xl font-semibold mb-4 text-blue-400">Precio: ${product.price}</p>

    <div className="mb-3">
      <label htmlFor="quantity" className="block text-sm font-medium text-gray-300">
        Cantidad
      </label>
      <select
        id="quantity"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        className="border rounded p-2 text-black font-semibold w-24"
      >
        {[...Array(product.stock)].map((_, i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>
    </div>

    <div className="flex space-x-3 mb-3">
      <button
        onClick={() => addToCart({ ...product, quantity })}
        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-lg shadow-md transition-transform transform hover:scale-105" // Ahora los botones son rectangulares
      >
        Agregar al carrito
      </button>

      <button
        onClick={handleBuyNow}
        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg shadow-md transition-transform transform hover:scale-105"
      >
        Comprar
      </button>
    </div>

    <button
      onClick={handleShare}
      className="flex items-center space-x-1 text-blue-400 hover:text-pink-500 transition"
    >
      <FaShareAlt />
      <span>Compartir</span>
    </button>

    <button className="flex items-center space-x-1 text-blue-400 hover:text-pink-500 transition mt-2">
      <FaHeart />
      <span>Agregar a favoritos</span>
    </button>
  </div>
);

ProductInfo.propTypes = {
  product: PropTypes.object.isRequired,
  quantity: PropTypes.number.isRequired,
  setQuantity: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
  handleBuyNow: PropTypes.func.isRequired,
  handleShare: PropTypes.func.isRequired,
};

export default ProductInfo;
