import { useContext, useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; // Firebase config
import { CartContext } from '../context/CartContext'; // Importa el contexto del carrito
import axios from 'axios';

const Cart = () => {
  const { cartItems } = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      // Reduce el stock de cada producto en Firebase
      for (const item of cartItems) {
        const productRef = doc(db, 'products', item.id);
        const newStock = item.stock - item.quantity; // Calcular el nuevo stock

        if (newStock >= 0) {
          await updateDoc(productRef, { stock: newStock });
        } else {
          alert(`No hay suficiente stock de ${item.name}`);
          setLoading(false);
          return;
        }
      }

      // Enviar los productos al backend para procesar la compra
      const items = cartItems.map((item) => ({
        title: item.name,
        quantity: Number(item.quantity),
        currency_id: 'ARS',
        unit_price: item.price,
      }));

      const response = await axios.post('http://localhost:3000/create_preference', {
        items,
      });

      const { id } = response.data;
      window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?preference-id=${id}`;

    } catch (error) {
      console.error('Error al procesar la compra:', error);
    } finally {
      setLoading(false);
    }
  };

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Carrito de Compras</h2>
        <div className="mb-4">
          {cartItems.length === 0 ? (
            <p>No hay productos en el carrito.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="mb-4">
                <p className="text-lg font-semibold">{item.name}</p>
                <p className="text-sm">Precio: ${item.price}</p>
                <p className="text-sm">Stock disponible: {item.stock}</p> {/* Mostrar stock disponible */}
                <p className="text-sm">Cantidad en carrito: {item.quantity}</p>
              </div>
            ))
          )}
        </div>

        <p className="text-xl font-bold mb-4">Total: ${total}</p>

        <button
          onClick={handleCheckout}
          className={`w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Procesando...' : 'Pagar ahora'}
        </button>
      </div>
    </div>
  );
};

export default Cart;
