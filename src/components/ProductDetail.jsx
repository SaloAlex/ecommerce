import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { CartContext } from '../context/CartContext';
import Swal from 'sweetalert2';
import { getAuth } from 'firebase/auth';
import ProductImageGallery from './ProductImageGallery';
import ShippingModal from './ShippingModal';
import ShippingCalculator from './ShippingCalculator';
import ProductRating from './ProductRating';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity] = useState(1); // Solo usamos el valor 1 por defecto
  const [hover, setHover] = useState(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchProduct = async () => {
      const productRef = doc(db, 'products', id);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        const productData = productSnap.data();
        setProduct({ ...productData, id });
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

  const averageRating = product.ratings?.length
    ? product.ratings.reduce((a, b) => a + b, 0) / product.ratings.length
    : 0;

  const hasUserRated = product.ratedBy?.includes(currentUser?.uid);

  const handleBuyNow = () => {
    const totalCost = product.price + shippingCost;
    addToCart({ ...product, quantity, shippingCost, totalCost });
    navigate('/cart');
  };

  const handleRating = async (newRating) => {
    if (hasUserRated) {
      Swal.fire({
        icon: 'info',
        title: 'Ya has valorado este producto',
        text: 'Solo puedes valorar un producto una vez.',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const productRef = doc(db, 'products', id);

    try {
      await updateDoc(productRef, {
        ratings: arrayUnion(newRating),
        ratedBy: arrayUnion(currentUser.uid),
      });

      setProduct((prevProduct) => ({
        ...prevProduct,
        ratings: [...(prevProduct.ratings || []), newRating],
        ratedBy: [...(prevProduct.ratedBy || []), currentUser.uid],
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

  const calculateShippingCost = (postalCode) => {
    const shippingRates = {
      '1000': 300,
      '2000': 400,
      '3000': 500,
      default: 600,
    };

    return shippingRates[postalCode] || shippingRates.default;
  };

  const handleShippingAccepted = (cost) => {
    setShippingCost(cost);
    setShowShippingModal(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-3x1"> {/* Ajustamos el ancho máximo */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Columna izquierda - Galería de imágenes */}
        <div className="col-span-1">
          <ProductImageGallery
            imageUrls={product.imageUrls}
            selectedImage={selectedImage}
            onSelectImage={setSelectedImage}
          />
        </div>
        
        {/* Columna central - Información del producto */}
        <div className="col-span-2 md:col-span-1 ml-10">
          <h1 className="text-3xl font-bold text-white mb-4">{product.name}</h1>
          <p className="text-xl text-white mb-4">Precio: ${product.price}</p>
          <p className={`text-md mb-4 ${product.stock > 10 ? 'text-green-500' : 'text-pink-500'}`}>
            {product.stock > 10
              ? `Stock disponible: ${product.stock}`
              : `¡Quedan solo ${product.stock} unidades!`}
          </p>
          <p className="text-md text-white mb-4">{product.description}</p>
          <ProductRating
            averageRating={averageRating}
            hasUserRated={hasUserRated}
            hover={hover}
            setHover={setHover}
            handleRating={handleRating}
          />
        </div>

        {/* Columna derecha - Botones de acción */}
        <div className="w-3/4 bg-white p-4 rounded-lg shadow-lg flex flex-col items-start">
          <button
            onClick={handleBuyNow}
            className="w-full px-4 py-2 mb-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            Comprar ahora
          </button>
          <button
            onClick={() => addToCart({ ...product, quantity })}
            className="w-full px-4 py-2 mb-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-lg shadow-xl transition-transform transform hover:scale-105"
          >
            Agregar al carrito
          </button>
          <button
            onClick={() => setShowShippingModal(true)}
            className="w-xl px-4 py-2 mb-4 bg-gradient-to-r from-pink-300 to-purple-800 text-white font-bold rounded-lg shadow-xl transition-transform transform hover:scale-105"
          >
            Costo de Envío
          </button>

          <p className="text-lg text-gray-900 mt-4">Total (producto + envío): ${product.price + shippingCost}</p>
        </div>

        {/* Modal para calcular el costo de envío */}
        {showShippingModal && (
          <ShippingModal onClose={() => setShowShippingModal(false)}>
            <ShippingCalculator
              calculateShippingCost={calculateShippingCost}
              onShippingAccepted={handleShippingAccepted}
            />
          </ShippingModal>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
