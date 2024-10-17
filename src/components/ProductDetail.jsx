import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { CartContext } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext); // Usa el contexto para agregar productos al carrito
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1); // Estado para la cantidad seleccionada

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
    return <p className="text-center text-lg text-gray-500">Cargando detalles del producto...</p>;
  }

  // Manejar la compra inmediata redirigiendo al carrito
  const handleBuyNow = () => {
    addToCart({ ...product, quantity }); // Agregar el producto al carrito con la cantidad seleccionada
    navigate('/cart');  // Redirigir al carrito
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-300 dark:to-gray-800 rounded-xl shadow-lg p-6">
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
                  selectedImage === url ? 'border-blue-500' : 'border-transparent'
                }`}
                onClick={() => setSelectedImage(url)}
              />
            ))}
          </div>

          {/* Detalles del producto */}
          <div className="flex-1 text-gray-800 dark:text-gray-100 md:ml-6">
            <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
            <p className="text-lg mb-4">Descripción: {product.description}</p>
            <p className="text-xl font-semibold mb-6">Precio: ${product.price}</p>

            {/* Selector de cantidad */}
            <div className="mb-4">
              <label htmlFor="quantity" className="block text-sm  font-medium">
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

            <div className="flex space-x-4">
              {/* Botón de agregar al carrito */}
              <button
                onClick={() => addToCart({ ...product, quantity })}  // Pasa la cantidad seleccionada
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-full shadow-lg transition-transform transform hover:scale-105 hover:bg-blue-700 active:scale-95"
              >
                Agregar al carrito
              </button>

              {/* Botón de comprar */}
              <button
                onClick={handleBuyNow}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-full shadow-lg transition-transform transform hover:scale-105 hover:bg-green-700 active:scale-95"
              >
                Comprar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
