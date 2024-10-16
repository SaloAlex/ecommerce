import { createContext, useState } from 'react';
import PropTypes from 'prop-types'; // Importa PropTypes para la validación

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Función para agregar un producto al carrito
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

  // Función para vaciar el carrito
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Definir PropTypes para validar que children es requerido
CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartProvider;
