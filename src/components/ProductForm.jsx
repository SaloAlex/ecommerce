import PropTypes from "prop-types";

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
    <div className="mb-4">
      <input
        type="text"
        name="name"
        placeholder="Nombre del producto"
        value={newProduct.name || ""}
        onChange={handleInputChange}
        className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        name="price"
        placeholder="Precio"
        value={newProduct.price || ""} // Asegúrate de que siempre sea un string
        onChange={handleInputChange}
        className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        name="description"
        placeholder="Descripción"
        value={newProduct.description || ""}
        onChange={handleInputChange}
        className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="number"
        name="stock"
        placeholder="Cantidad en stock"
        value={newProduct.stock !== undefined ? newProduct.stock : 0} // Asegura que siempre haya un valor
        onChange={handleInputChange}
        className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        name="category"
        value={newProduct.category || ""}
        onChange={handleInputChange}
        className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Seleccionar categoría</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <input
        type="file"
        multiple
        onChange={handleImageFilesChange}
        className="border border-gray-300 rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {progress > 0 && (
        <div className="w-full bg-gray-200 h-2 rounded">
          <div
            className="bg-blue-500 h-full rounded"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      <button
        onClick={onSubmit}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-all w-full mt-4"
      >
        {isEditing ? "Guardar Cambios" : "Agregar Producto"}
      </button>
    </div>
  );
};

ProductForm.propTypes = {
  newProduct: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired, // Asegúrate de que price sea string
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    stock: PropTypes.number.isRequired, // stock como número
    imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleImageFilesChange: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  progress: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
};

export default ProductForm;
