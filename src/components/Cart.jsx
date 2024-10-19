import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import Swal from "sweetalert2";
import QuantitySelector from "./QuantitySelector";

const Cart = () => {
  const { cartItems, clearCart, updateQuantity, removeFromCart } = useContext(CartContext); // Agregamos removeFromCart
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
        "http://localhost:3000/create_preference",
        {
          items,
        }
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

  const handleQuantityChange = (id, newQuantity) => {
    updateQuantity(id, newQuantity); // Actualiza la cantidad en el contexto
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id); // Elimina el producto del carrito
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-5xl w-full">
        <h2 className="text-3xl font-bold text-black mb-6">Mi carrito</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-700 text-xl">No hay productos en el carrito.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Columna de productos */}
            <div className="col-span-2">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-gray-300 py-4"
                >
                  <div className="flex items-center">
                    <img
                      src={item.imageUrls ? item.imageUrls[0] : ""}
                      alt={`Imagen de ${item.name}`}
                      className="w-24 h-24 object-cover rounded-md mr-4"
                    />
                    <div>
                      <p className="text-xl font-semibold text-black">
                        {item.name}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.id)} // Función para eliminar el producto
                        className="text-sm text-blue-500 hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                  <div className="text-lg text-gray-600">
                    <QuantitySelector
                      productId={item.id}
                      initialQuantity={item.quantity}
                      onQuantityChange={(newQuantity) =>
                        handleQuantityChange(item.id, newQuantity)
                      }
                    />
                  </div>
                  <div className="text-lg text-black font-semibold">
                    ${item.price}
                  </div>
                </div>
              ))}

              {/* Sección para el código de descuento */}
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

            {/* Columna de resumen */}
            <div className="col-span-1 bg-gray-100 p-6 rounded-lg shadow-md">
              <p className="text-lg font-bold text-black mb-4">Resumen</p>
              <div className="text-lg flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-black">${total}</span>
              </div>

              <div className="mt-4">
                <button
                  onClick={handleCheckout}
                  className={`w-full py-3 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Procesando..." : "Finalizar compra"}
                </button>
                <button
                  onClick={() => {
                    Swal.fire({
                      title: "¿Estás seguro?",
                      text: "Esta acción vaciará tu carrito.",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Sí, vaciar carrito",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        clearCart();
                        Swal.fire(
                          "Carrito vacío",
                          "Tu carrito ha sido vaciado.",
                          "success"
                        );
                      }
                    });
                  }}
                  className="w-full mt-2 py-3 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600"
                >
                  Vaciar carrito
                </button>
                <button
                  onClick={() => navigate("/")} // Navegar a la página de inicio
                  className="w-full mt-2 py-3 border border-black bg-gray-200 text-black font-bold rounded-lg shadow-md hover:bg-gray-300"
                >
                  Continuar comprando
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
