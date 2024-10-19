import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import Swal from "sweetalert2";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import CartActions from "./CartActions";

const Cart = () => {
  const { cartItems, clearCart, updateQuantity, removeFromCart } = useContext(CartContext);
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
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

              <div className="mt-6">
                <p className="text-lg font-semibold text-gray-600 mb-2">
                  ¿Tenés un código de descuento?
                </p>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Código"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700"
                  />
                  <button className="ml-2 px-4 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700">
                    Aplicar
                  </button>
                </div>
              </div>
            </div>

            <CartSummary total={total} />
            <CartActions
              onCheckout={handleCheckout}
              onClearCart={clearCart}
              loading={loading}
              navigate={navigate}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
