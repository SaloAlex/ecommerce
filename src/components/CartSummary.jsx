import PropTypes from "prop-types";

const CartSummary = ({ total }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
      <p className="text-lg font-bold text-black mb-4">Resumen</p>
      <div className="text-lg flex justify-between">
        <span className="text-gray-600">Subtotal:</span>
        <span className="text-black">${total}</span>
      </div>
    </div>
  );
};

CartSummary.propTypes = {
  total: PropTypes.number.isRequired,
};

export default CartSummary;
