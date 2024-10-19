import PropTypes from 'prop-types';
import { useState } from "react";

const CartSummary = ({ total, onCheckout, loading, navigate, onShippingButtonClick }) => {
  const [discountCode, setDiscountCode] = useState("");

  return (
    <div className="col-span-1 bg-gray-100 p-6 rounded-lg shadow-md">
      <p className="text-lg font-bold text-black mb-4">Resumen</p>

      <div className="text-lg flex justify-between">
        <span className="text-gray-600">Subtotal:</span>
        <span className="text-xl font-semibold text-black">${total}</span>
      </div>

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

      <div className="mt-4">
        <button
          onClick={onShippingButtonClick} // Activar el modal de cálculo de envío
          className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600"
        >
          Calcular envío
        </button>
      </div>

      <div className="mt-4">
        <button
          onClick={onCheckout}
          className={`w-full py-3 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Procesando..." : "Finalizar compra"}
        </button>

        <button
          onClick={() => navigate("/")} // Navegar a la página de inicio
          className="w-full mt-2 py-3 border border-black bg-gray-200 text-black font-bold rounded-lg shadow-md hover:bg-gray-300"
        >
          Continuar comprando
        </button>
      </div>
    </div>
  );
};

CartSummary.propTypes = {
  total: PropTypes.number.isRequired,
  onCheckout: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  navigate: PropTypes.func.isRequired,
  onShippingButtonClick: PropTypes.func.isRequired, // Prop para manejar el click del botón de envío
};

export default CartSummary;
