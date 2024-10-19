import PropTypes from 'prop-types';

const ShippingModal = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Contenedor más grande para el modal */}
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg relative max-w-2xl w-full mx-4">
        {/* Botón para cerrar el modal */}
        <button
          className="absolute top-4 right-4 text-white bg-gray-700 px-3 py-2 rounded-lg hover:bg-gray-900 transition duration-300"
          onClick={onClose}
        >
          X
        </button>

        <div className="text-gray-100">
          <h2 className="text-2xl font-black text-black mb-4 text-center">
            Calculadora de Envío
          </h2>
          {children}
        </div>
      </div>
    </div>
  );
};

ShippingModal.propTypes = {
  onClose: PropTypes.func.isRequired,  // Función para cerrar el modal
  children: PropTypes.node.isRequired, // Contenido del modal
};

export default ShippingModal;
