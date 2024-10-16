import { useContext, useState } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext'; // Importa el contexto del carrito

const Cart = () => {
  const { cartItems } = useContext(CartContext); // Usa el contexto para acceder a los productos del carrito
  const [loading, setLoading] = useState(false);

  // Acceder a la clave API desde las variables de entorno
  const apiKey = import.meta.env.VITE_API_KEY;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const items = cartItems.map((item) => ({
        title: item.name,
        quantity: Number(item.quantity),
        currency_id: 'ARS',
        unit_price: item.price,
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

  // Calcular el total del carrito
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Carrito de Compras</h2>

        {/* Listado de productos en el carrito */}
        <div className="mb-4">
          {cartItems.length === 0 ? (
            <p>No hay productos en el carrito.</p>
          ) : (
            cartItems.map((item, index) => (
              <div key={item.id || index} className="mb-4 flex items-start"> {/* Añadido || index como fallback */}
                {/* Mostrar la imagen del producto si existe */}
                {item.imageUrls && item.imageUrls.length > 0 && (
                  <img
                    src={item.imageUrls[0]} // Mostrar la primera imagen del producto
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg mr-4"
                  />
                )}

                <div>
                  <p className="text-lg font-semibold">{item.name}</p>
                  <p className="text-sm">Precio: ${item.price}</p>
                  <div className="flex items-center">
                    <p className="mr-2">Cantidad: {item.quantity}</p>
                  </div>
                </div>
              </div>
            ))
          )}
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
