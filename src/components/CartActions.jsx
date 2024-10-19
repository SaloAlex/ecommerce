import PropTypes from "prop-types";
import Swal from "sweetalert2";

const CartActions = ({ onCheckout, onClearCart, loading, navigate }) => {
  return (
    <div className="col-span-1 bg-gray-100 p-6 rounded-lg shadow-md">
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
              onClearCart();
              Swal.fire("Carrito vacío", "Tu carrito ha sido vaciado.", "success");
            }
          });
        }}
        className="w-full mt-2 py-3 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600"
      >
        Vaciar carrito
      </button>

      <button
        onClick={() => navigate("/")}
        className="w-full mt-2 py-3 border border-black bg-gray-200 text-black font-bold rounded-lg shadow-md hover:bg-gray-300"
      >
        Continuar comprando
      </button>
    </div>
  );
};

CartActions.propTypes = {
  onCheckout: PropTypes.func.isRequired,
  onClearCart: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default CartActions;
