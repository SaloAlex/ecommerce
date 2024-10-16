import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Dashboard from './components/Dashboard'; // Importa el Dashboard
import { CartProvider } from './context/CartContext'; // Importa el contexto del carrito

const App = () => {

  // Función para pausar un producto (propia del Dashboard)
  const onTogglePauseProduct = (productId) => {
    console.log("Producto pausado: ", productId);
    // Aquí puedes implementar la lógica para pausar o reactivar el producto
  };

  // Función para editar un producto (propia del Dashboard)
  const onEditProduct = (productId) => {
    console.log("Editar producto: ", productId);
    // Aquí puedes implementar la lógica para editar el producto
  };

  // Función para eliminar un producto (propia del Dashboard)
  const onDeleteProduct = (productId) => {
    console.log("Eliminar producto: ", productId);
    // Aquí puedes implementar la lógica para eliminar el producto
  };

  return (
    <CartProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<ProductList />} /> {/* Ya no pasamos props aquí */}
          <Route path="/products/:id" element={<ProductDetail />} /> {/* El botón "Agregar al carrito" ya usa el contexto */}
          <Route path="/cart" element={<Cart />} /> {/* El carrito también usa el contexto */}
          <Route
            path="/dashboard"
            element={
              <Dashboard
                onTogglePauseProduct={onTogglePauseProduct}
                onEditProduct={onEditProduct}
                onDeleteProduct={onDeleteProduct}
              />
            }
          />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
};

export default App;
