
import PropTypes from 'prop-types'; // Importa PropTypes para la validación

const ProductManagerList = ({
  products,
  startEditingProduct,
  deleteProduct,
  togglePauseProduct,
  removeImage,
  editingProduct
}) => {
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">Productos actuales (Administración):</h3>
      <ul>
        {products.map((product) => (
          <li key={product.id} className="mb-4 border-b pb-4">
            <strong>{product.name}</strong> - ${product.price}
            <br />
            Categoría: {product.category}
            <div className="flex mt-2">
              {product.imageUrls &&
                product.imageUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Imagen ${index + 1}`}
                      width="100"
                      className="mr-2 rounded shadow-md"
                    />
                    {editingProduct && (
                      <button
                        onClick={() => removeImage(url)}
                        className="absolute top-0 right-0 bg-red-500 text-white p-2 rounded-md text-xs hover:bg-red-600 transition-all"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                ))}
            </div>
            <div className="mt-2">
              <button
                onClick={() => startEditingProduct(product)}
                className="bg-yellow-500 text-white p-2 rounded mr-2 hover:bg-yellow-600 transition-all"
              >
                Editar
              </button>
              <button
                onClick={() => deleteProduct(product.id)}
                className="bg-red-500 text-white p-2 rounded mr-2 hover:bg-red-600 transition-all"
              >
                Eliminar
              </button>
              <button
                onClick={() => togglePauseProduct(product.id, product.paused)}
                className={`p-2 rounded text-white transition-all ${
                  product.paused
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gray-500 hover:bg-gray-600'
                }`}
              >
                {product.paused ? 'Reactivar' : 'Pausar'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Validación de las props con PropTypes
ProductManagerList.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      category: PropTypes.string,
      paused: PropTypes.bool,
      imageUrls: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  startEditingProduct: PropTypes.func.isRequired,
  deleteProduct: PropTypes.func.isRequired,
  togglePauseProduct: PropTypes.func.isRequired,
  removeImage: PropTypes.func.isRequired,
  editingProduct: PropTypes.object, // Puede ser null o un objeto
};

export default ProductManagerList;
