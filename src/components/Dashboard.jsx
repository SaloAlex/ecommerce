import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/firebaseConfig"; // Importa `db` y `storage`

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    imageUrls: [],
    category: "",
    paused: false,
  });
  const [imageFiles, setImageFiles] = useState([]); // Estado para múltiples imágenes
  const [progress, setProgress] = useState(0); // Progreso de carga
  const [editingProduct, setEditingProduct] = useState(null); // Estado para el producto en edición
  const categories = ["Laptops", "Smartphones", "Accesorios", "Tablets"]; // Categorías de tecnología

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
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

  // Manejar la selección de imágenes (máximo 4 imágenes)
  const handleImageFilesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      alert("Solo puedes subir hasta 4 imágenes");
    } else {
      setImageFiles(files);
    }
  };

  // Eliminar imagen de un producto durante la edición
  const removeImage = (imageUrl) => {
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      imageUrls: prevProduct.imageUrls.filter((url) => url !== imageUrl),
    }));
  };

  // Subir imágenes con progreso
  const uploadImages = () => {
    return Promise.all(
      imageFiles.map(async (imageFile) => {
        const imageRef = ref(storage, `products/${imageFile.name}`);
        const uploadTask = uploadBytesResumable(imageRef, imageFile);
        uploadTask.on("state_changed", (snapshot) => {
          const progressPercentage =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progressPercentage);
        });
        const snapshot = await uploadTask;
        const imageUrl = await getDownloadURL(snapshot.ref);
        return imageUrl;
      })
    );
  };

  const addProduct = async () => {
    if (imageFiles.length === 0 || newProduct.category === "") {
      alert("Por favor, selecciona al menos una imagen y una categoría");
      return;
    }

    try {
      const imageUrls = await uploadImages();
      await addDoc(collection(db, "products"), {
        ...newProduct,
        imageUrls,
        paused: false,
      });
      setNewProduct({
        name: "",
        price: "",
        description: "",
        imageUrls: [],
        category: "",
        paused: false,
      });
      setImageFiles([]);
      setProgress(0); // Resetear progreso
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  };

  // Guardar cambios de edición
  const saveProductChanges = async () => {
    try {
      let imageUrls = newProduct.imageUrls;
      if (imageFiles.length > 0) {
        const newImageUrls = await uploadImages();
        imageUrls = [...imageUrls, ...newImageUrls]; // Agregar nuevas imágenes a las existentes
      }
      await updateDoc(doc(db, "products", editingProduct.id), {
        ...newProduct,
        imageUrls,
      });

      setProducts(
        products.map((product) =>
          product.id === editingProduct.id
            ? { ...product, ...newProduct, imageUrls }
            : product
        )
      );

      setEditingProduct(null);
      setNewProduct({
        name: "",
        price: "",
        description: "",
        imageUrls: [],
        category: "",
        paused: false,
      });
      setImageFiles([]);
      setProgress(0); // Resetear progreso
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  // Comenzar a editar un producto
  const startEditingProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price,
      description: product.description,
      imageUrls: product.imageUrls || [],
      category: product.category || "",
      paused: product.paused || false,
    });
  };

  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const togglePauseProduct = async (id, paused) => {
    try {
      await updateDoc(doc(db, "products", id), { paused: !paused });
      setProducts(
        products.map((product) =>
          product.id === id ? { ...product, paused: !paused } : product
        )
      );
    } catch (error) {
      console.error("Error al pausar el producto:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">
        Dashboard - Gestión de productos
      </h2>

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
        <select
          name="category"
          value={newProduct.category}
          onChange={handleInputChange}
          className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          type="file"
          multiple
          onChange={handleImageFilesChange}
          className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {progress > 0 && (
          <div className="w-full bg-gray-200 h-2 rounded">
            <div
              className="bg-blue-500 h-full rounded"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <button
          onClick={editingProduct ? saveProductChanges : addProduct}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-all w-full mt-4"
        >
          {editingProduct ? "Guardar Cambios" : "Agregar Producto"}
        </button>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Productos actuales:</h3>
        <ul>
          {products.map((product) => (
            <li key={product.id} className="mb-4 border-b pb-4">
              <strong>{product.name}</strong> - ${product.price}
              <br />
              Categoría: {product.category}
              <div className="flex mt-2">
                {product.imageUrls &&
                  product.imageUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Imagen ${index + 1}`}
                        width="100"
                        className="mr-2 rounded shadow-md"
                      />
                      {editingProduct && (
                        <button
                          onClick={() => removeImage(url)}
                          className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-md text-xs hover:bg-red-600 transition-all"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
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
                  className={`p-2 rounded text-white transition-all ${
                    product.paused
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-gray-500 hover:bg-gray-600"
                  }`}
                >
                  {product.paused ? "Reactivar" : "Pausar"}
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
