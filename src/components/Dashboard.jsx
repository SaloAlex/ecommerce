import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Importa las funciones de Storage
import { db } from '../firebase/firebaseConfig'; // Importa `db` desde firebaseConfig
import { storage } from '../firebase/firebaseConfig'; // Importa `storage`

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', imageUrl: '' });
  const [imageFile, setImageFile] = useState(null); // Estado para la imagen seleccionada

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setProducts(productsData);
    };
    fetchProducts();
  }, []);

  const addProduct = async () => {
    if (imageFile) {
      try {
        // Sube la imagen a Firebase Storage
        const imageRef = ref(storage, `products/${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        const imageUrl = await getDownloadURL(snapshot.ref); // Obtén la URL de la imagen subida

        // Guarda el producto junto con la URL de la imagen en Firestore
        await addDoc(collection(db, 'products'), { 
          ...newProduct, 
          imageUrl // Agrega la URL de la imagen al producto
        });

        // Limpia los campos
        setNewProduct({ name: '', price: '', description: '', imageUrl: '' });
        setImageFile(null);
      } catch (error) {
        console.error('Error al agregar el producto:', error);
      }
    } else {
      console.error('Por favor, selecciona una imagen');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Dashboard - Gestión de productos</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Nombre del producto"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="border p-2 mb-2"
        />
        <input
          type="text"
          placeholder="Precio"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          className="border p-2 mb-2"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          className="border p-2 mb-2"
        />
        <input
          type="file"
          onChange={(e) => setImageFile(e.target.files[0])} // Guardar la imagen seleccionada
          className="border p-2 mb-2"
        />
        <button onClick={addProduct} className="bg-blue-500 text-white p-2">Agregar Producto</button>
      </div>

      <div>
        <h3>Productos actuales:</h3>
        <ul>
          {products.map(product => (
            <li key={product.id}>
              {product.name} - ${product.price}
              <br />
              <img src={product.imageUrl} alt={product.name} width="100" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
