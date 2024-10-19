import PropTypes from 'prop-types';
import { FaShareAlt, FaHeart } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ProductInfo = ({
  product,
  handleBuyNow,
}) => {
  const productUrl = `https://mi-ecommerce.com/product/${product.id}`; // Reemplaza con la URL real de tu producto

  const shareProduct = () => {
    // Verifica si el navegador soporta la Web Share API (disponible en dispositivos móviles)
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `¡Mira este increíble producto: ${product.name}!`,
        url: productUrl,
      })
        .then(() => console.log('Producto compartido exitosamente'))
        .catch((error) => console.error('Error al compartir:', error));
    } else {
      // Si no está disponible, copia el enlace y muestra una alerta
      navigator.clipboard.writeText(productUrl)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Enlace copiado',
            text: 'El enlace del producto ha sido copiado al portapapeles.',
          });
        })
        .catch((error) => console.error('Error al copiar el enlace:', error));
    }
  };

  return (
    <div className="flex-1 text-gray-100">
      <h2 className="text-3xl font-bold text-black mb-3">{product.name}</h2>

      <p className={`text-base mb-3 ${product.stock > 10 ? 'text-green-500' : 'text-red-500'}`}>
        {product.stock > 10
          ? `Stock disponible: ${product.stock}`
          : `¡Quedan solo ${product.stock} unidades!`}
      </p>

      <p className="text-base mb-3 text-gray-500">Descripción: {product.description}</p>
      <p className="text-xl font-semibold mb-4 text-black">Precio: ${product.price}</p>

      <div className="flex space-x-3 mb-3">
        <button
          onClick={handleBuyNow}
          className="w-64 py-3 bg-gradient-to-r from-blue-500 to-blue-800 text-white font-bold rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          Comprar
        </button>
      </div>

      <button
        onClick={shareProduct} // Llamamos a nuestra función de compartir
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
};

ProductInfo.propTypes = {
  product: PropTypes.object.isRequired,
  handleBuyNow: PropTypes.func.isRequired,
};

export default ProductInfo;
