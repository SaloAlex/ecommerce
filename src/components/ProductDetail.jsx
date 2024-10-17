import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'; // arrayUnion para agregar valoraciones
import { db } from '../firebase/firebaseConfig';
import { CartContext } from '../context/CartContext';
import { FaStar } from 'react-icons/fa'; // Íconos de estrellas
import { FaShareAlt, FaHeart } from 'react-icons/fa'; // Iconos para compartir y favoritos
import Swal from 'sweetalert2'; // Para alertas

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext); // Usa el contexto para agregar productos al carrito
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1); // Estado para la cantidad seleccionada
  const [hover, setHover] = useState(null); // Estado para hover sobre estrellas

  useEffect(() => {
    const fetchProduct = async () => {
      const productRef = doc(db, 'products', id);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        const productData = productSnap.data();
        setProduct({ ...productData, id }); // Aquí agregamos el `id` al producto
        setSelectedImage(productData.imageUrls ? productData.imageUrls[0] : '');
      } else {
        console.error('No se encontró el producto.');
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return <p className="text-center text-lg text-gray-400">Cargando detalles del producto...</p>;
  }

  // Calcular la calificación promedio
  const averageRating = product.ratings && product.ratings.length > 0
    ? product.ratings.reduce((a, b) => a + b, 0) / product.ratings.length
    : 0;

  // Manejar la compra inmediata redirigiendo al carrito
  const handleBuyNow = () => {
    addToCart({ ...product, quantity }); // Agregar el producto al carrito con la cantidad seleccionada
    navigate('/cart');  // Redirigir al carrito
  };

  // Función para calificar el producto
  const handleRating = async (newRating) => {
    const productRef = doc(db, 'products', id);

    try {
      await updateDoc(productRef, {
        ratings: arrayUnion(newRating), // Agregar la nueva calificación al array
      });

      // Actualizar el estado local
      setProduct((prevProduct) => ({
        ...prevProduct,
        ratings: [...(prevProduct.ratings || []), newRating],
      }));

      Swal.fire({
        icon: 'success',
        title: 'Gracias por tu valoración',
        text: `Le diste ${newRating} estrellas a este producto.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error al enviar la calificación:', error);
    }
  };

  // Función para copiar el enlace del producto
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    Swal.fire({
      icon: 'success',
      title: 'Enlace copiado',
      text: '¡El enlace del producto ha sido copiado al portapapeles!',
      timer: 2000,
      showConfirmButton: false,
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-gray-900 rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-start">
          {/* Imagen principal grande */}
          <div className="flex-1">
            {selectedImage && (
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-auto object-cover mb-6 rounded-lg shadow-md"
              />
            )}
          </div>

          {/* Thumbnails (Imágenes pequeñas) */}
          <div className="flex md:flex-col justify-center md:ml-6 space-x-4 md:space-x-0 md:space-y-4">
            {product.imageUrls && product.imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Imagen ${index + 1}`}
                className={`w-20 h-20 object-cover rounded-lg shadow-md cursor-pointer border-2 ${
                  selectedImage === url ? 'border-pink-500' : 'border-transparent'
                }`}
                onClick={() => setSelectedImage(url)}
              />
            ))}
          </div>

          {/* Detalles del producto */}
          <div className="flex-1 text-gray-100 md:ml-6">
            <h2 className="text-4xl font-bold text-pink-500 mb-4 neon-effect">{product.name}</h2>

            {/* Indicador de stock */}
            <p className={`text-lg mb-4 ${product.stock > 10 ? 'text-green-500' : 'text-red-500'}`}>
              {product.stock > 10
                ? `Stock disponible: ${product.stock}`
                : `¡Quedan solo ${product.stock} unidades!`}
            </p>

            <p className="text-lg mb-4 text-gray-300">Descripción: {product.description}</p>
            <p className="text-2xl font-semibold mb-6 text-blue-400">Precio: ${product.price}</p>

            {/* Selector de cantidad */}
            <div className="mb-4">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-300">
                Cantidad
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border rounded p-2 text-black font-semibold"
              >
                {[...Array(product.stock)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-4 mb-4">
              {/* Botón de agregar al carrito */}
              <button
                onClick={() => addToCart({ ...product, quantity })}   // Pasa la cantidad seleccionada
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-full shadow-lg transition-transform transform hover:scale-105"
              >
                Agregar al carrito
              </button>

              {/* Botón de comprar */}
              <button
                onClick={handleBuyNow}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-full shadow-lg transition-transform transform hover:scale-105"
              >
                Comprar
              </button>
            </div>

            {/* Botón de compartir */}
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 text-blue-400 hover:text-pink-500 transition"
            >
              <FaShareAlt />
              <span>Compartir</span>
            </button>

            {/* Botón de agregar a favoritos */}
            <button className="flex items-center space-x-2 text-blue-400 hover:text-pink-500 transition mt-4">
              <FaHeart />
              <span>Agregar a favoritos</span>
            </button>

            {/* Calificación promedio */}
            <div className="mt-6">
              <p className="text-gray-300">Calificación promedio: {averageRating.toFixed(1)} / 5</p>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`cursor-pointer ${i + 1 <= Math.round(averageRating) ? 'text-yellow-500' : 'text-gray-400'}`}
                  />
                ))}
              </div>
            </div>

            {/* Calificación por parte del usuario */}
            <div className="mt-4">
              <p className="text-gray-300">Tu calificación:</p>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`cursor-pointer ${i + 1 <= hover ? 'text-yellow-500' : 'text-gray-400'}`}
                    onClick={() => handleRating(i + 1)}
                    onMouseEnter={() => setHover(i + 1)}
                    onMouseLeave={() => setHover(null)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
