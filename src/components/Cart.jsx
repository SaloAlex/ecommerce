import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import Swal from "sweetalert2";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import ShippingModal from "./ShippingModal"; // Importamos el modal
import ShippingCalculator from "./ShippingCalculator"; // Importamos el calculador

const Cart = () => {
  const { cartItems, clearCart, updateQuantity, removeFromCart } = useContext(CartContext);
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const [loading, setLoading] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false); // Estado para el modal de envío
  const [shippingCost, setShippingCost] = useState(0); // Estado para el costo de envío
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      for (const item of cartItems) {
        if (!item.id) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: `El producto ${item.name} no tiene un identificador válido.`,
          });
          setLoading(false);
          return;
        }
      }

      const items = cartItems.map((item) => ({
        title: item.name,
        quantity: Number(item.quantity),
        currency_id: "ARS",
        unit_price: item.price,
      }));

      const response = await axios.post(
        "http://localhost:3000/create_preference", // Asegúrate de que esta URL sea correcta
        { items }
      );

      const { id } = response.data;
      Swal.fire({
        icon: "success",
        title: "Redirigiendo a pago",
        text: "Serás redirigido a Mercado Pago.",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        clearCart();
        window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?preference-id=${id}`;
      }, 2000);
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al procesar la compra. Intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para abrir el modal
  const handleOpenShippingModal = () => {
    setShowShippingModal(true);
  };

  // Función para cerrar el modal
  const handleCloseShippingModal = () => {
    setShowShippingModal(false);
  };

  // Función para calcular el costo de envío
  const calculateShippingCost = (postalCode) => {
    const shippingRates = {
      1000: 300,
      2000: 400,
      3000: 500,
      default: 600,
    };
    return shippingRates[postalCode] || shippingRates.default;
  };

  // Función para aceptar el costo de envío desde el modal
  const handleShippingAccepted = (cost) => {
    setShippingCost(cost);
    setShowShippingModal(false); // Cerrar el modal cuando se acepte el costo de envío
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-5xl w-full">
        <h2 className="text-3xl font-bold text-black mb-6">Mi carrito</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-700 text-xl">No hay productos en el carrito.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>

            <CartSummary
              total={total + shippingCost} // Incluye el costo de envío en el total
              onCheckout={handleCheckout}
              loading={loading}
              navigate={navigate}
              onShippingButtonClick={handleOpenShippingModal} // Nuevo botón para calcular envío
            />
          </div>
        )}
      </div>

      {/* Mostrar el modal si el estado `showShippingModal` está activo */}
      {showShippingModal && (
        <ShippingModal onClose={handleCloseShippingModal}>
          <ShippingCalculator
            calculateShippingCost={calculateShippingCost}
            onShippingAccepted={handleShippingAccepted}
          />
        </ShippingModal>
      )}
    </div>
  );
};

export default Cart;
