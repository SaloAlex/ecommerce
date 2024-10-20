import PropTypes from 'prop-types';
import { useState } from "react";
import DiscountCodeInput from './DiscountCodeInput';

const CartSummary = ({ total, onCheckout, loading, navigate, onShippingButtonClick }) => {
  const [finalTotal, setFinalTotal] = useState(total); // Estado para manejar el total final con descuento

  const applyDiscount = (discountValue) => {
    const discountAmount = (total * discountValue) / 100;
    setFinalTotal(total - discountAmount);
  };

  return (
    <div className="col-span-1 bg-gray-100 p-6 rounded-lg shadow-md">
      <p className="text-lg font-bold text-black mb-4">Resumen</p>

      <div className="text-lg flex justify-between">
        <span className="text-gray-600">Subtotal:</span>
        <span className="text-xl font-semibold text-black">${finalTotal}</span>
      </div>

      <DiscountCodeInput applyDiscount={applyDiscount} /> {/* Nuevo componente */}

      <div className="mt-4">
        <button
          onClick={onShippingButtonClick}
          className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600"
        >
          Calcular envío
        </button>
      </div>

      <div className="mt-4">
        <button
          onClick={onCheckout}
          className={`w-full py-3 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Procesando..." : "Finalizar compra"}
        </button>

        <button
          onClick={() => navigate("/")}
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
  onShippingButtonClick: PropTypes.func.isRequired,
};

export default CartSummary;
