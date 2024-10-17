import { useContext, useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; // Firebase config
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

        const productRef = doc(db, 'products', item.id);
        const newStock = item.stock - item.quantity; // Calcular el nuevo stock

        if (newStock >= 0) {
          await updateDoc(productRef, { stock: newStock });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Stock insuficiente',
            text: `No hay suficiente stock de ${item.name}. Disponible: ${item.stock}`,
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Carrito de Compras</h2>
        <div className="mb-4">
          {cartItems.length === 0 ? (
            <p>No hay productos en el carrito.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="mb-4"> {/* Usamos `item.id` como `key` */}
                <p className="text-lg font-semibold">{item.name}</p>
                <p className="text-sm">Precio unitario: ${item.price}</p>
                <p className="text-sm">Cantidad en carrito: {item.quantity}</p>
                <p className="text-sm">Subtotal: ${item.price * item.quantity}</p> {/* Mostrar subtotal por producto */}
                {item.imageUrls && item.imageUrls.length > 0 && (
                  <img
                    src={item.imageUrls[0]} // Renderiza solo la primera imagen
                    alt={`Imagen de ${item.name}`}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                )}
              </div>
            ))
          )}
        </div>

        <p className="text-xl font-bold mb-4">Total a pagar: ${total}</p> {/* Total del carrito basado en cantidades */}

        <div className="flex space-x-4">
          <button
            onClick={handleCheckout}
            className={`w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
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
                  clearCart(); // Vaciar el carrito si se confirma la acción
                  Swal.fire('Carrito vacío', 'Tu carrito ha sido vaciado.', 'success');
                }
              });
            }}
            className="w-full px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600"
          >
            Vaciar carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;