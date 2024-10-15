import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .filter((product) => !product.paused); // Filtra productos que no estén pausados
      setProducts(productsData);
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Productos Disponibles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="border p-4 shadow rounded-lg">
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-700">Precio: ${product.price}</p>
              {/* Mostrar todas las imágenes del producto */}
              <div className="flex">
                {product.imageUrls && product.imageUrls.map((url, index) => (
                  <img key={index} src={url} alt={`Imagen ${index + 1}`} className="w-full h-auto mb-2" />
                ))}
              </div>
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
