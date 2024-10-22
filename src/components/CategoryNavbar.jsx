import PropTypes from 'prop-types'; // Importa PropTypes para la validación de props

const CategoryNavbar = ({ categories, onCategorySelect }) => {
  return (
    <nav className="p-4 mb-6 shadow-lg flex justify-between items-center">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Texto a la izquierda */}
        <h2 className="text-4xl font-bold text-blue-900">
          ¡Nuestros <span className="text-white bg-gray-800 px-2 py-1 rounded">productos!</span>
        </h2>
        
        {/* Categorías a la derecha con fondo gris */}
        <div className="bg-gray-500 p-4 rounded-lg">
          <ul className="flex space-x-6">
            {/* Opción de todas las categorías */}
            <li>
              <button
                onClick={() => onCategorySelect('')}
                className="text-white hover:text-white bg-gray-800 hover:bg-black px-4 py-2 rounded-lg transition duration-300 focus:outline-none"
              >
                Todos
              </button>
            </li>

            {/* Otras categorías */}
            {categories.map((category) => (
              <li key={category}>
                <button
                  onClick={() => onCategorySelect(category)}
                  className="text-white hover:text-white bg-gray-800 hover:bg-black px-4 py-2 rounded-lg transition duration-300 focus:outline-none"
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

// Validación de los tipos de las props
CategoryNavbar.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired, // Debe ser un array de strings
  onCategorySelect: PropTypes.func.isRequired, // Debe ser una función
};

export default CategoryNavbar;
