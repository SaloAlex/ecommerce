import { useState } from 'react';
import PropTypes from 'prop-types'; // Importa PropTypes para la validación de props
import axios from 'axios';

const DiscountCodeInput = ({ applyDiscount }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [discount, setDiscount] = useState(null);

  const handleApplyDiscount = async () => {
    try {
      const response = await axios.post('http://localhost:3000/validate_discount', { code });
      const { discountValue } = response.data;
      setDiscount(discountValue);
      applyDiscount(discountValue); // Notificar al padre el valor del descuento
    } catch {
      setError("Código de descuento no válido");
      setDiscount(null);
    }
  };

  return (
    <div className="mt-6">
      <p className="text-lg font-semibold text-gray-600 mb-2">
        ¿Tenés un código de descuento?
      </p>
      <div className="flex">
        <input
          type="text"
          placeholder="Código"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700"
        />
        <button
          onClick={handleApplyDiscount}
          className="ml-2 px-4 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700"
        >
          Aplicar
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {discount && <p className="text-green-500">¡Descuento aplicado: {discount}%!</p>}
    </div>
  );
};

// Añadir validación de PropTypes para applyDiscount
DiscountCodeInput.propTypes = {
  applyDiscount: PropTypes.func.isRequired,
};

export default DiscountCodeInput;
