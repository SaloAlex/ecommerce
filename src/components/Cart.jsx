import { useState } from 'react';
import axios from 'axios';

const Cart = () => {
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: 'Producto 1',
      quantity: 1,
      currency_id: 'ARS',
      unit_price: 1000,
    },
    {
      id: 2,
      title: 'Producto 2',
      quantity: 2,
      currency_id: 'ARS',
      unit_price: 500,
    }
  ]);

  // Acceder a la clave API desde las variables de entorno
  const apiKey = import.meta.env.VITE_API_KEY;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const items = cartItems.map((item) => ({
        title: item.title,
        quantity: Number(item.quantity),
        currency_id: item.currency_id,
        unit_price: item.unit_price,
      }));

      // Enviar los productos al backend
      const response = await axios.post('http://localhost:3000/create_preference', {
        items,
        apiKey,
      });

      const { id } = response.data;
      window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?preference-id=${id}`;
    } catch (error) {
      console.error('Error al iniciar la compra:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar la cantidad de un producto
  const updateQuantity = (id, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Number(quantity) } : item
      )
    );
  };

  // Calcular el total del carrito
  const total = cartItems.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Carrito de Compras</h2>

        {/* Listado de productos en el carrito */}
        <div className="mb-4">
          {cartItems.map((item) => (
            <div key={item.id} className="mb-4">
              <p className="text-lg font-semibold">{item.title}</p>
              <p className="text-sm">Precio: ${item.unit_price}</p>
              <div className="flex items-center">
                <p className="mr-2">Cantidad:</p>
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) => updateQuantity(item.id, e.target.value)}
                  className="border border-gray-300 rounded w-16 p-1"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Mostrar el total */}
        <p className="text-xl font-bold mb-4">Total: ${total}</p>

        {/* Botón de checkout */}
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
