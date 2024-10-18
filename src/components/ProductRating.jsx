import PropTypes from 'prop-types';
import { FaStar } from 'react-icons/fa';

const ProductRating = ({
  averageRating,
  hasUserRated,
  hover,
  setHover,
  handleRating,
}) => (
  <div className="mt-6">
    <p className="text-gray-500">Calificación promedio: {averageRating.toFixed(1)} / 5</p>
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={`cursor-pointer ${i + 1 <= Math.round(averageRating) ? 'text-yellow-500' : 'text-gray-400'}`}
        />
      ))}
    </div>

    <div className="mt-4">
      <p className="text-gray-500">Tu calificación:</p>
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`cursor-pointer ${i + 1 <= hover ? 'text-yellow-500' : 'text-gray-400'}`}
            onClick={() => handleRating(i + 1)}
            onMouseEnter={() => setHover(i + 1)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </div>
    </div>

    {hasUserRated && (
      <p className="text-red-500 mt-2">Ya has valorado este producto.</p>
    )}
  </div>
);

ProductRating.propTypes = {
  averageRating: PropTypes.number.isRequired,
  hasUserRated: PropTypes.bool.isRequired,
  hover: PropTypes.number,
  setHover: PropTypes.func.isRequired,
  handleRating: PropTypes.func.isRequired,
};

export default ProductRating;
