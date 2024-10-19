import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CartContext } from './CartContext';  // importas el contexto

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem('cartItems');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error al cargar el carrito desde localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error al guardar el carrito en localStorage:", error);
    }
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingProduct = prevItems.find((item) => item.id === product.id);
      if (existingProduct) {
        const totalQuantity = existingProduct.quantity + product.quantity;
        if (totalQuantity > product.stock) {
          console.warn(`Cantidad excede el stock disponible (${product.stock} unidades disponibles)`);
          return prevItems;
        }
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: totalQuantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: product.quantity }];
      }
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
