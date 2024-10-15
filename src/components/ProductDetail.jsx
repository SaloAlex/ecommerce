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
    return <p>Cargando detalles del producto...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">{product.name}</h2>
      <p className="text-lg">Descripción: {product.description}</p>
      <p className="text-lg font-semibold mb-4">Precio: ${product.price}</p>
      <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded">
        Agregar al carrito
      </button>
    </div>
  );
};

export default ProductDetail;
