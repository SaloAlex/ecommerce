import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; // Importa la configuración de Firebase

const ProductList = () => {
  const [products, setProducts] = useState([]);

  // Cargar productos desde Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setProducts(productsData);
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Productos Disponibles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="border p-4 shadow rounded-lg">
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-700">Precio: ${product.price}</p>
              {product.imageUrl && (
                <img src={product.imageUrl} alt={product.name} className="w-full h-auto mb-2" />
              )}
              <Link to={`/products/${product.id}`} className="text-blue-500 hover:underline">
                Ver Detalles
              </Link>
            </div>
          ))
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
