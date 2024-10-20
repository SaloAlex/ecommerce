import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail'; // Detalles del producto
import Cart from './components/Cart'; // Componente del carrito de compras
import Dashboard from './components/Dashboard'; // Componente del dashboard
import Home from './components/Home'; // El nuevo componente Home
import Header from './components/Header'; // Importar el Header
import Login from './components/Login'; // Importar el componente Login
import Register from './components/Register'; // Importar el componente Register
import { CartProvider } from './context/CartContext'; // Importa el contexto del carrito
import GenerateDiscountCode from './components/GenerateDiscountCode'; // Importa el componente para generar código de descuento

const App = () => {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Router>
          <Header /> {/* Mantén el Header para todas las rutas */}
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} /> {/* Ruta para el login */}
              <Route path="/register" element={<Register />} /> {/* Ruta para el registro */}
              <Route path="/generate-discount" element={<GenerateDiscountCode />} /> {/* Nueva ruta para generar código de descuento */}
            </Routes>
          </div>
          <Footer />
        </Router>
      </div>
    </CartProvider>
  );
};

export default App;
