import { useState } from 'react';
import PropTypes from 'prop-types';

const ShippingCalculator = ({ calculateShippingCost, onShippingAccepted }) => {
  const [postalCode, setPostalCode] = useState('');
  const [shippingCost, setShippingCost] = useState(null);
  const [error, setError] = useState('');
  const [shippingAccepted, setShippingAccepted] = useState(false);

  // Función para manejar el cálculo del envío
  const handleCalculate = () => {
    if (!/^\d{4}$/.test(postalCode)) {
      setError('Por favor, introduce un código postal válido de 4 dígitos.');
      setShippingCost(null);
      return;
    }

    setError('');
    const cost = calculateShippingCost(postalCode);
    setShippingCost(cost);
    setShippingAccepted(false); // Resetear el estado si vuelve a calcular
  };

  // Función para aceptar el costo de envío
  const handleAcceptShipping = () => {
    setShippingAccepted(true);
    onShippingAccepted(shippingCost); // Llamar la función del componente padre
  };

  // Función para cancelar el envío
  const handleCancelShipping = () => {
    setShippingCost(null);
    setShippingAccepted(false);
    onShippingAccepted(0); // Enviar 0 si cancela el envío
  };

  return (
    <div className="bg-gray-200 p-4 rounded-lg shadow-md text-gray-100">
      <h3 className="text-lg font-bold text-black  mb-2">Calcular envío</h3>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          className="border p-2 rounded w-full text-black"
          placeholder="Introduce tu código postal"
        />
        <button
          onClick={handleCalculate}
          className="px-4 py-2 bg-purple-600 text-white font-bold rounded hover:bg-purple-700 transition"
        >
          Calcular
        </button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {shippingCost !== null && !shippingAccepted && (
        <div className="mt-4">
          <p className="text-black font-semibold">El costo de envío es: ${shippingCost}</p>
          <div className="flex space-x-4 mt-2">
            <button
              onClick={handleAcceptShipping}
              className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
            >
              Aceptar
            </button>
            <button
              onClick={handleCancelShipping}
              className="px-4 py-2 bg-purple-600 text-white font-bold rounded hover:bg-purple-700 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {shippingAccepted && (
        <p className="text-black font-semibold mt-2">El costo de envío ha sido añadido al total.</p>
      )}
    </div>
  );
};

ShippingCalculator.propTypes = {
  calculateShippingCost: PropTypes.func.isRequired, // Función para calcular el costo de envío
  onShippingAccepted: PropTypes.func.isRequired,   // Función para manejar cuando el envío es aceptado
};

export default ShippingCalculator;
