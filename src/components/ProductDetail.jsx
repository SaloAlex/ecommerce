import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { CartContext } from '../context/CartContext';
import Swal from 'sweetalert2';
import { getAuth } from 'firebase/auth';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';
import ProductRating from './ProductRating';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [hover, setHover] = useState(null);
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
    addToCart({ ...product, quantity });
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
    <div className="container mx-auto p-6 max-w-6xl"> {/* Ancho máximo ajustado */}
      <div className="bg-gray-900 rounded-xl shadow-lg p-6"> {/* Padding ajustado */}
        <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 "> {/* Espaciado horizontal */}
          <ProductImageGallery
            imageUrls={product.imageUrls}
            selectedImage={selectedImage}
            onSelectImage={setSelectedImage}
          />
          <div className="flex flex-col space-y-0 w-full md:w-6/7"> {/* Espaciado ajustado entre info y rating */}
            <ProductInfo
              product={product}
              quantity={quantity}
              setQuantity={setQuantity}
              addToCart={addToCart}
              handleBuyNow={handleBuyNow}
              handleShare={handleShare}
            />
            <ProductRating
              averageRating={averageRating}
              hasUserRated={hasUserRated}
              hover={hover}
              setHover={setHover}
              handleRating={handleRating}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
