import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Dashboard from './components/Dashboard'; // Importa el Dashboard

const App = () => {
  const [cartItems, setCartItems] = useState([]); // Estado para los productos del carrito

  // Función para agregar productos al carrito
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingProduct = prevItems.find((item) => item.id === product.id);

      if (existingProduct) {
        // Si el producto ya está en el carrito, incrementamos su cantidad
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Si no está en el carrito, lo agregamos con cantidad 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<ProductList />} /> {/* Ya no pasamos props aquí */}
        <Route path="/products/:id" element={<ProductDetail addToCart={addToCart} />} /> {/* Pasamos la función addToCart */}
        <Route path="/cart" element={<Cart cartItems={cartItems} />} /> {/* Pasamos los productos del carrito al Cart */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Ruta para el Dashboard */}
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
