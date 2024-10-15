import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore'; // Importa `doc` y `getDoc` desde firebase/firestore
import { db } from '../firebase/firebaseConfig';  // Importa `db` desde firebaseConfig

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const productRef = doc(db, 'products', id); // Utiliza `doc` correctamente aquí
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        setProduct(productSnap.data());
      } else {
        console.error('No se encontró el producto.');
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return <p className="text-center text-lg text-gray-500">Cargando detalles del producto...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-300 dark:to-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-center">
          {/* Imagen del producto */}
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full md:w-1/2 h-auto object-cover mb-6 md:mb-0 md:mr-6 rounded-lg shadow-md"
            />
          )}

          {/* Detalles del producto */}
          <div className="flex-1 text-gray-800 dark:text-gray-100">
            <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
            <p className="text-lg mb-4">Descripción: {product.description}</p>
            <p className="text-xl font-semibold mb-6">Precio: ${product.price}</p>

            {/* Botón de agregar al carrito */}
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-full shadow-lg transition-transform transform hover:scale-105 hover:bg-blue-700 active:scale-95">
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
