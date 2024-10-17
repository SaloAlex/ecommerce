import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      // Intenta cargar los productos del carrito desde localStorage
      const storedCart = localStorage.getItem('cartItems');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error al cargar el carrito desde localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      // Guarda el carrito en localStorage cada vez que cambia
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error al guardar el carrito en localStorage:", error);
    }
  }, [cartItems]);

  // Función para agregar un producto al carrito
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingProduct = prevItems.find((item) => item.id === product.id);
  
      if (existingProduct) {
        // Si el producto ya está en el carrito, incrementamos su cantidad
        return prevItems.map((item) =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + product.quantity } // Aumentar la cantidad basada en lo seleccionado
            : item
        );
      } else {
        // Si no está en el carrito, lo agregamos con la cantidad seleccionada
        return [...prevItems, { ...product, quantity: product.quantity }];
      }
    });
  };

  // Función para vaciar el carrito
  const clearCart = () => {
    setCartItems([]); // Limpia el estado
    localStorage.removeItem('cartItems'); // Elimina del localStorage
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Validación de PropTypes para el CartProvider
CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartProvider;