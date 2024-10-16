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
import { db, storage } from "../firebase/firebaseConfig";
import ProductForm from "./ProductForm";
import ProductList from "./ProductManagerList"; // Cambiar el nombre del componente para evitar conflicto

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "", // Manejado como string
    description: "",
    imageUrls: [],
    category: "",
    stock: 0, // Asegúrate de que esté inicializado
    paused: false,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [editingProduct, setEditingProduct] = useState(null);
  const categories = ["Laptops", "Smartphones", "Accesorios", "Tablets"];

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          price: parseFloat(data.price), // Asegurarse de que price sea un número
        };
      });
      setProducts(productsData);
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]:
        name === "price"
          ? String(value)
          : name === "stock"
          ? parseInt(value, 10) || 0
          : value, // Asegura que stock sea un número
    }));
  };

  const handleImageFilesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      alert("Solo puedes subir hasta 4 imágenes");
    } else {
      setImageFiles(files);
    }
  };

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
    if (
      newProduct.name === "" ||
      newProduct.price === "" ||
      newProduct.stock === undefined ||
      newProduct.category === ""
    ) {
      alert("Por favor, completa todos los campos requeridos");
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
      setProgress(0);
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  };

  const saveProductChanges = async () => {
    // Validar que los campos requeridos tengan valores
    if (!newProduct.name || !newProduct.price || newProduct.stock === undefined || !newProduct.category) {
      alert('Por favor, completa todos los campos requeridos antes de guardar.');
      return;
    }
  
    try {
      let imageUrls = newProduct.imageUrls;
      if (imageFiles.length > 0) {
        const newImageUrls = await uploadImages();
        imageUrls = [...imageUrls, ...newImageUrls];
      }
  
      // Convertir price a número antes de guardar
      const updatedProduct = {
        ...newProduct,
        price: Number(newProduct.price), // Convertir price a número
        imageUrls
      };
  
      // Actualizar el producto en la base de datos
      await updateDoc(doc(db, 'products', editingProduct.id), updatedProduct);
  
      // Actualizar la lista de productos en el estado
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id
            ? { ...product, ...updatedProduct }
            : product
        )
      );
  
      // Limpiar los campos y el estado de edición
      setEditingProduct(null);
      setNewProduct({
        name: '',
        price: '',
        description: '',
        stock: 0,  // Asegura que el stock se restablezca a 0
        imageUrls: [],
        category: '',
        paused: false
      });
      setImageFiles([]);
      setProgress(0);
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  // Función para eliminar una imagen
  const removeImage = (imageUrl) => {
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      imageUrls: prevProduct.imageUrls.filter((url) => url !== imageUrl),
    }));
  };

  const startEditingProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: String(product.price), // Asegúrate de que price sea un string
      description: product.description,
      imageUrls: product.imageUrls || [],
      category: product.category || "",
      stock: Number(product.stock) || 0, // Asegura que stock sea un número
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
      <ProductForm
        newProduct={newProduct}
        handleInputChange={handleInputChange}
        handleImageFilesChange={handleImageFilesChange}
        categories={categories}
        progress={progress}
        onSubmit={editingProduct ? saveProductChanges : addProduct}
        isEditing={!!editingProduct}
      />
      <ProductList
        products={products}
        startEditingProduct={startEditingProduct}
        deleteProduct={deleteProduct}
        togglePauseProduct={togglePauseProduct}
        removeImage={removeImage}
        editingProduct={editingProduct}
      />
    </div>
  );
};

export default Dashboard;
