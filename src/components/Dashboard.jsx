import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/firebaseConfig'; // Importa `db` y `storage`

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', imageUrls: [], paused: false });
  const [imageFiles, setImageFiles] = useState([]); // Estado para múltiples imágenes
  const [editingProduct, setEditingProduct] = useState(null); // Estado para el producto en edición

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setProducts(productsData);
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const startEditingProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price,
      description: product.description,
      imageUrls: product.imageUrls || [],
      paused: product.paused || false,
    });
  };

  const addProduct = async () => {
    if (imageFiles.length > 0) {
      try {
        const imageUrls = await Promise.all(
          imageFiles.map(async (imageFile) => {
            const imageRef = ref(storage, `products/${imageFile.name}`);
            const snapshot = await uploadBytes(imageRef, imageFile);
            const imageUrl = await getDownloadURL(snapshot.ref);
            return imageUrl;
          })
        );

        await addDoc(collection(db, 'products'), {
          ...newProduct,
          imageUrls,
          paused: false,
        });

        setNewProduct({ name: '', price: '', description: '', imageUrls: [], paused: false });
        setImageFiles([]);
      } catch (error) {
        console.error('Error al agregar el producto:', error);
      }
    } else {
      console.error('Por favor, selecciona al menos una imagen');
    }
  };

  const saveProductChanges = async () => {
    try {
      let imageUrls = newProduct.imageUrls;

      if (imageFiles.length > 0) {
        const newImageUrls = await Promise.all(
          imageFiles.map(async (imageFile) => {
            const imageRef = ref(storage, `products/${imageFile.name}`);
            const snapshot = await uploadBytes(imageRef, imageFile);
            const imageUrl = await getDownloadURL(snapshot.ref);
            return imageUrl;
          })
        );
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      await updateDoc(doc(db, 'products', editingProduct.id), {
        ...newProduct,
        imageUrls,
      });

      setProducts(
        products.map((product) =>
          product.id === editingProduct.id ? { ...product, ...newProduct, imageUrls } : product
        )
      );

      setEditingProduct(null);
      setNewProduct({ name: '', price: '', description: '', imageUrls: [], paused: false });
      setImageFiles([]);
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  const togglePauseProduct = async (id, paused) => {
    try {
      await updateDoc(doc(db, 'products', id), { paused: !paused });
      setProducts(
        products.map((product) =>
          product.id === id ? { ...product, paused: !paused } : product
        )
      );
    } catch (error) {
      console.error('Error al pausar el producto:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Dashboard - Gestión de productos</h2>

      <div className="mb-4">
        <input
          type="text"
          name="name"
          placeholder="Nombre del producto"
          value={newProduct.name}
          onChange={handleInputChange}
          className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="price"
          placeholder="Precio"
          value={newProduct.price}
          onChange={handleInputChange}
          className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="description"
          placeholder="Descripción"
          value={newProduct.description}
          onChange={handleInputChange}
          className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="file"
          multiple
          onChange={(e) => setImageFiles(Array.from(e.target.files))}
          className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={editingProduct ? saveProductChanges : addProduct}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-all w-full"
        >
          {editingProduct ? 'Guardar Cambios' : 'Agregar Producto'}
        </button>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Productos actuales:</h3>
        <ul>
          {products.map((product) => (
            <li key={product.id} className="mb-4 border-b pb-4">
              <strong>{product.name}</strong> - ${product.price}
              <br />
              <div className="flex mt-2">
                {product.imageUrls &&
                  product.imageUrls.map((url, index) => (
                    <img key={index} src={url} alt={`Imagen ${index + 1}`} width="100" className="mr-2 rounded shadow-md" />
                  ))}
              </div>

              <div className="mt-2">
                <button
                  onClick={() => startEditingProduct(product)}
                  className="bg-yellow-500 text-white p-2 rounded mr-2 hover:bg-yellow-600 transition-all"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="bg-red-500 text-white p-2 rounded mr-2 hover:bg-red-600 transition-all"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => togglePauseProduct(product.id, product.paused)}
                  className={`p-2 rounded text-white transition-all ${product.paused ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}`}
                >
                  {product.paused ? 'Reactivar' : 'Pausar'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
