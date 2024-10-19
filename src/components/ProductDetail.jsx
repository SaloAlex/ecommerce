import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { CartContext } from "../context/CartContext";
import Swal from "sweetalert2";
import { getAuth } from "firebase/auth";
import ProductImageGallery from "./ProductImageGallery";
import ProductRating from "./ProductRating";
import ProductInfo from "./ProductInfo";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1); // Estado para manejar cantidad
  const [hover, setHover] = useState(null);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchProduct = async () => {
      const productRef = doc(db, "products", id);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        const productData = productSnap.data();
        setProduct({ ...productData, id });
        setSelectedImage(productData.imageUrls ? productData.imageUrls[0] : "");
      } else {
        console.error("No se encontró el producto.");
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <p className="text-center text-lg text-gray-400">
        Cargando detalles del producto...
      </p>
    );
  }

  const averageRating = product.ratings?.length
    ? product.ratings.reduce((a, b) => a + b, 0) / product.ratings.length
    : 0;

  const hasUserRated = currentUser ? product.ratedBy?.includes(currentUser.uid) : false;

  const handleBuyNow = () => {
    if (!product.id) {
      console.error('Error: El producto no tiene un ID válido.');
      return;
    }

    // Solo añade la cantidad actual al carrito
    addToCart({ ...product, quantity });
    navigate("/cart");
  };

  const handleRating = async (newRating) => {
    if (hasUserRated) {
      Swal.fire({
        icon: "info",
        title: "Ya has valorado este producto",
        text: "Solo puedes valorar un producto una vez.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const productRef = doc(db, "products", id);

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
        icon: "success",
        title: "Gracias por tu valoración",
        text: `Le diste ${newRating} estrellas a este producto.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al enviar la calificación:", error);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="bg-white p-8 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Columna izquierda - Galería de imágenes */}
        <div className="md:col-span-1">
          <ProductImageGallery
            imageUrls={product.imageUrls}
            selectedImage={selectedImage}
            onSelectImage={setSelectedImage}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Columna derecha - Información del producto */}
        <div className="md:col-span-1 border border-gray-300 p-6 rounded-lg shadow-xl bg-white">
          <ProductInfo
            product={product}
            quantity={quantity}
            setQuantity={setQuantity} // Permitir cambiar la cantidad
            handleBuyNow={handleBuyNow}
            handleShare={() => Swal.fire("Compartir", "¡Producto compartido!", "info")}
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
  );
};

export default ProductDetail;
