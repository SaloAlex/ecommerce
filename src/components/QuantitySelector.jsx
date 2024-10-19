import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import PropTypes from 'prop-types';
import { db } from '../firebase/firebaseConfig';

const QuantitySelector = ({ productId = '', initialQuantity = 1, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStock = async () => {
      if (!productId) {
        console.error('productId es undefined o null');
        setError('ID de producto no válido');
        setLoading(false);
        return;
      }

      try {
        const productRef = doc(db, 'products', productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = productSnap.data();
          if (productData.stock !== undefined && productData.stock !== null) {
            setStock(productData.stock);
          } else {
            throw new Error('El producto no tiene stock disponible.');
          }
        } else {
          throw new Error('El producto no existe en la base de datos.');
        }
      } catch (error) {
        console.error('Error obteniendo el stock:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, [productId]);

  const handleIncrease = () => {
    if (quantity < stock) {
      setQuantity(quantity + 1);
      onQuantityChange(quantity + 1); // Notifica el cambio de cantidad
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      onQuantityChange(quantity - 1); // Notifica el cambio de cantidad
    }
  };

  if (loading) {
    return <p>Cargando stock...</p>; // Mostrar un mensaje mientras carga
  }

  if (error) {
    return <p className="text-red-500">{error}</p>; // Muestra el mensaje de error si hay problemas
  }

  return (
    <div className="flex items-center border border-gray-300 rounded-lg p-2 w-max">
      <button
        className="text-purple-600 px-3 py-1 text-xl font-bold hover:text-pink-500"
        onClick={handleDecrease}
        disabled={quantity === 1}
      >
        -
      </button>
      <span className="px-4 text-lg">{quantity}</span>
      <button
        className="text-purple-600 px-3 py-1 text-xl font-bold hover:text-pink-500"
        onClick={handleIncrease}
        disabled={quantity === stock || stock === 0} // Desactiva si el stock es 0
      >
        +
      </button>
    </div>
  );
};

// Validación de los props
QuantitySelector.propTypes = {
  productId: PropTypes.string.isRequired,
  initialQuantity: PropTypes.number,
  onQuantityChange: PropTypes.func.isRequired,
};

export default QuantitySelector;
