import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import CategoryNavbar from './CategoryNavbar';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // Productos filtrados por categoría

  const categories = ['Laptops', 'Smartphones', 'Accesorios', 'Tablets', 'Electrodomesticos']; // Las categorías disponibles

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .filter((product) => !product.paused);
      setProducts(productsData);
      setFilteredProducts(productsData); // Mostrar todos los productos inicialmente
    };
    fetchProducts();
  }, []);

  // Función para filtrar los productos según la categoría seleccionada
  const handleCategorySelect = (category) => {
    if (category === '') {
      setFilteredProducts(products); // Si no se selecciona una categoría, mostrar todos los productos
    } else {
      setFilteredProducts(products.filter((product) => product.category === category));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-bold text-pink-500 neon-effect mb-6 text-center">
        Productos Disponibles
      </h2>

      {/* Navbar de categorías */}
      <CategoryNavbar categories={categories} onCategorySelect={handleCategorySelect} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
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
          ))
        ) : (
          <p className="text-center text-gray-400">No hay productos disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
