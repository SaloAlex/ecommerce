import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductList from './components/ProductList'; // El componente de productos para el cliente
import ProductDetail from './components/ProductDetail'; // Detalles del producto para el cliente
import Cart from './components/Cart'; // Componente del carrito de compras
import Dashboard from './components/Dashboard'; // Componente del dashboard de administración
import { CartProvider } from './context/CartContext'; // Importa el contexto del carrito

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Header />
        <Routes>
          {/* Ruta para la lista de productos visible por los usuarios */}
          <Route path="/" element={<ProductList />} />
          
          {/* Ruta para ver los detalles de un producto */}
          <Route path="/products/:id" element={<ProductDetail />} />
          
          {/* Ruta para el carrito de compras */}
          <Route path="/cart" element={<Cart />} />

          {/* Ruta para el dashboard de administración */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
};

export default App;
