import PropTypes from 'prop-types';

const ShippingModal = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg relative">
        {/* Botón para cerrar el modal */}
        <button
          className="absolute top-2 right-2 text-white bg-red-600 rounded-sm p-1"
          onClick={onClose}
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
};

ShippingModal.propTypes = {
  onClose: PropTypes.func.isRequired,  // Función para cerrar el modal
  children: PropTypes.node.isRequired, // Contenido del modal
};

export default ShippingModal;
