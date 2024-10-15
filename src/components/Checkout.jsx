import { useState } from 'react';
import axios from 'axios';

const Checkout = () => {
  const [loading, setLoading] = useState(false);

  // Acceder a la clave API desde las variables de entorno
  const apiKey = import.meta.env.VITE_API_KEY;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const items = [
        {
          title: 'Producto de ejemplo',
          quantity: Number(1),  // Asegúrate de que sea un número
          currency_id: 'ARS',
          unit_price: 1000,
        },
      ];

      // Enviar la clave API al backend en los headers o body
      const response = await axios.post('http://localhost:3000/create_preference', {
        items,
        apiKey,  // Enviando la API key
      });

      const { id } = response.data;
      window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?preference-id=${id}`;
    } catch (error) {
      console.error('Error al iniciar la compra:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Simulación de Compra</h2>
        <p className="mb-4">Producto de ejemplo - Precio: $1000</p>
        <button
          onClick={handleCheckout}
          className={`w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Procesando...' : 'Comprar ahora'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
