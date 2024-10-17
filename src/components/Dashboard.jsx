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
import Swal from "sweetalert2"; // Importa SweetAlert

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    imageUrls: [],
    category: "",
    stock: 0,
    paused: false,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el buscador de productos
  const categories = ["Laptops", "Smartphones", "Accesorios", "Tablets","Electrodomesticos"];

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          price: parseFloat(data.price),
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
          : value,
    }));
  };

  const handleImageFilesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      Swal.fire({
        icon: "error",
        title: "Límite excedido",
        text: "Solo puedes subir hasta 4 imágenes.",
      });
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
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos requeridos.",
      });
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
        stock: 0,
        paused: false,
      });
      setImageFiles([]);
      setProgress(0);
      Swal.fire({
        icon: "success",
        title: "Producto agregado",
        text: "El producto se ha agregado exitosamente.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al agregar el producto.",
      });
      console.error("Error al agregar el producto:", error);
    }
  };

  const saveProductChanges = async () => {
    if (!newProduct.name || !newProduct.price || newProduct.stock === undefined || !newProduct.category) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos antes de guardar.",
      });
      return;
    }

    try {
      let imageUrls = newProduct.imageUrls;
      if (imageFiles.length > 0) {
        const newImageUrls = await uploadImages();
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      const updatedProduct = {
        ...newProduct,
        price: Number(newProduct.price),
        imageUrls,
      };

      await updateDoc(doc(db, "products", editingProduct.id), updatedProduct);
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id
            ? { ...product, ...updatedProduct }
            : product
        )
      );
      setEditingProduct(null);
      setNewProduct({
        name: "",
        price: "",
        description: "",
        stock: 0,
        imageUrls: [],
        category: "",
        paused: false,
      });
      setImageFiles([]);
      setProgress(0);

      Swal.fire({
        icon: "success",
        title: "Cambios guardados",
        text: "El producto se ha actualizado exitosamente.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al guardar los cambios.",
      });
      console.error("Error al guardar los cambios:", error);
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
      price: String(product.price),
      description: product.description,
      imageUrls: product.imageUrls || [],
      category: product.category || "",
      stock: Number(product.stock) || 0,
      paused: product.paused || false,
    });
  };

  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      setProducts(products.filter((product) => product.id !== id));
      Swal.fire({
        icon: "success",
        title: "Producto eliminado",
        text: "El producto ha sido eliminado correctamente.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al eliminar el producto.",
      });
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al pausar el producto.",
      });
      console.error("Error al pausar el producto:", error);
    }
  };

  // Filtrar productos por el término de búsqueda
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">
        Dashboard - Gestión de productos
      </h2>

      {/* Buscador de productos */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg p-2 w-full max-w-sm"
        />
      </div>

      {/* Formulario de productos */}
      <ProductForm
        newProduct={newProduct}
        handleInputChange={handleInputChange}
        handleImageFilesChange={handleImageFilesChange}
        categories={categories}
        progress={progress}
        onSubmit={editingProduct ? saveProductChanges : addProduct}
        isEditing={!!editingProduct}
      />

      {/* Lista de productos agrupados por categoría */}
      {categories.map((category) => (
        <div key={category} className="mt-6">
          <h3 className="text-lg font-semibold mb-3">{category}</h3>
          <ProductList
            products={filteredProducts.filter(
              (product) => product.category === category
            )}
            startEditingProduct={startEditingProduct}
            deleteProduct={deleteProduct}
            togglePauseProduct={togglePauseProduct}
            removeImage={removeImage}
            editingProduct={editingProduct}
          />
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
