// ProductForm.js
import PropTypes from 'prop-types';

const ProductForm = ({
  newProduct,
  handleInputChange,
  handleImageFilesChange,
  categories,
  progress,
  onSubmit,
  isEditing,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md mx-auto"
    >
      <h3 className="text-xl font-semibold mb-4">
        {isEditing ? "Editar Producto" : "Agregar Producto"}
      </h3>

      {/* Nombre del Producto */}
      <div className="mb-2">
        <label htmlFor="name" className="block text-sm font-medium">
          Nombre del Producto
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={newProduct.name}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
          placeholder="Nombre del producto"
        />
      </div>

      {/* Precio del Producto */}
      <div className="mb-2">
        <label htmlFor="price" className="block text-sm font-medium">
          Precio
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={newProduct.price}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
          placeholder="Precio"
        />
      </div>

      {/* Descripción */}
      <div className="mb-2">
        <label htmlFor="description" className="block text-sm font-medium">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          value={newProduct.description}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
          placeholder="Descripción del producto"
        />
      </div>

      {/* Stock */}
      <div className="mb-2">
        <label htmlFor="stock" className="block text-sm font-medium">
          Stock
        </label>
        <input
          type="number"
          id="stock"
          name="stock"
          value={newProduct.stock}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
          placeholder="Cantidad de stock"
        />
      </div>

      {/* Categoría */}
      <div className="mb-2">
        <label htmlFor="category" className="block text-sm font-medium">
          Categoría
        </label>
        <select
          id="category"
          name="category"
          value={newProduct.category}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Imágenes */}
      <div className="mb-2">
        <label htmlFor="images" className="block text-sm font-medium">
          Imágenes (máximo 4)
        </label>
        <input
          type="file"
          id="images"
          multiple
          onChange={handleImageFilesChange}
          className="w-full p-2 border rounded-md"
        />
        {progress > 0 && (
          <div className="bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-500 h-full rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Botón de envío */}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md w-full mt-4"
      >
        {isEditing ? "Guardar Cambios" : "Agregar Producto"}
      </button>
    </form>
  );
};

// Validación de las props con PropTypes
ProductForm.propTypes = {
  newProduct: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleImageFilesChange: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  progress: PropTypes.number,
  onSubmit: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
};

export default ProductForm;
