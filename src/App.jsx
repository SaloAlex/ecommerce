import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail'; // Detalles del producto
import Cart from './components/Cart'; // Componente del carrito de compras
import Dashboard from './components/Dashboard'; // Componente del dashboard
import Home from './components/Home'; // El nuevo componente Home
import { CartProvider } from './context/CartContext'; // Importa el contexto del carrito

const App = () => {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Router>
          {/* El contenido principal, que crecerá para empujar el footer hacia abajo */}
          <div className="flex-grow">
            <Routes>
              {/* Ruta para la página de inicio (Home), que ahora incluye ProductList */}
              <Route path="/" element={<Home />} />

              {/* Ruta para ver los detalles de un producto */}
              <Route path="/products/:id" element={<ProductDetail />} />

              {/* Ruta para el carrito de compras */}
              <Route path="/cart" element={<Cart />} />

              {/* Ruta para el dashboard de administración */}
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
          {/* Footer en la parte inferior */}
          <Footer />
        </Router>
      </div>
    </CartProvider>
  );
};

export default App;
