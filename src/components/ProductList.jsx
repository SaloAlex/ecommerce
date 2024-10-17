import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .filter((product) => !product.paused);
      setProducts(productsData);
    };
    fetchProducts();
  }, []);

  // Agrupar productos por categoría
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || 'Sin categoría';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-bold text-pink-500 neon-effect mb-6 text-center">
        Productos Disponibles
      </h2>

      {/* Iterar sobre las categorías y renderizar productos por categoría */}
      {Object.keys(groupedProducts).map((category) => (
        <div key={category} className="mb-8">
          <h3 className="text-3xl font-semibold text-blue-400 mb-4">
          </h3>

          {/* Mantener las cards en una cuadrícula responsiva */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {groupedProducts[category].map((product) => (
              <div
                key={product.id}
                className="relative border p-4 shadow-lg rounded-lg bg-gray-800 group hover:bg-gray-700 transition duration-300 ease-in-out"
              >
                <h3 className="text-xl font-semibold text-white mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-300">Precio: ${product.price}</p>

                {product.imageUrls && product.imageUrls.length > 0 && (
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={product.imageUrls[0]}
                      alt={`Imagen del producto ${product.name}`}
                      className="w-full h-auto mb-2 rounded-md"
                    />

                    {/* Contenedor que aparece al hacer hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform -translate-y-full transition duration-300 ease-in-out">
                      <Link
                        to={`/products/${product.id}`}
                        className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition transform hover:scale-105"
                      >
                        Más Detalles
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {products.length === 0 && (
        <p className="text-center text-gray-400">No hay productos disponibles.</p>
      )}
    </div>
  );
};

export default ProductList;
