import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext'; // Importa el contexto del carrito
import axios from 'axios';
import Swal from 'sweetalert2'; // SweetAlert2

const Cart = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      // Validar que todos los productos tengan un `id` válido
      for (const item of cartItems) {
        if (!item.id) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `El producto ${item.name} no tiene un identificador válido.`,
          });
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
      Swal.fire({
        icon: 'success',
        title: 'Redirigiendo a pago',
        text: 'Serás redirigido a Mercado Pago.',
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        clearCart(); // Limpiar el carrito después de la compra
        window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?preference-id=${id}`;
      }, 2000);

    } catch (error) {
      console.error('Error al procesar la compra:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al procesar la compra. Intenta nuevamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Calcular el total basado en la cantidad de productos en el carrito
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
      <div className="bg-gray-800 shadow-lg rounded-lg p-10 w-full max-w-2xl">
        <h2 className="text-4xl font-bold text-pink-500 neon-effect mb-6">Carrito de Compras</h2>
        <div className="mb-6">
          {cartItems.length === 0 ? (
            <p className="text-white text-xl">No hay productos en el carrito.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="mb-6">
                <p className="text-2xl font-semibold text-blue-400">{item.name}</p>
                <p className="text-lg text-gray-300">Precio unitario: ${item.price}</p>
                <p className="text-lg text-gray-300">Cantidad en carrito: {item.quantity}</p>
                <p className="text-lg text-gray-300">Subtotal: ${item.price * item.quantity}</p>
                {item.imageUrls && item.imageUrls.length > 0 && (
                  <img
                    src={item.imageUrls[0]} // Renderiza solo la primera imagen
                    alt={`Imagen de ${item.name}`}
                    className="w-28 h-28 object-cover rounded-md mt-3"
                  />
                )}
              </div>
            ))
          )}
        </div>

        <p className="text-2xl font-bold text-blue-400 mb-6">Total a pagar: ${total}</p>

        <div className="flex space-x-6">
          <button
            onClick={handleCheckout}
            className={`w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-full shadow-md ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:from-pink-600 hover:to-purple-600 transition-transform transform hover:scale-105'
            }`}
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Pagar ahora'}
          </button>

          <button
            onClick={() => {
              Swal.fire({
                title: '¿Estás seguro?',
                text: 'Esta acción vaciará tu carrito.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, vaciar carrito',
              }).then((result) => {
                if (result.isConfirmed) {
                  clearCart();
                  Swal.fire('Carrito vacío', 'Tu carrito ha sido vaciado.', 'success');
                }
              });
            }}
            className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-full shadow-md hover:from-red-600 hover:to-red-700 transition-transform transform hover:scale-105"
          >
            Vaciar carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;