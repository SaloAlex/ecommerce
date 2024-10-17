import PropTypes from 'prop-types';

const ProductImageGallery = ({ imageUrls, selectedImage, onSelectImage }) => (
  <div className="flex">
    {/* Imagen grande, ahora con un ancho reducido */}
    <div className="w-2/3"> {/* Aquí estamos usando w-3/4 para reducir el tamaño de la imagen grande */}
      {selectedImage && (
        <img
          src={selectedImage}
          alt="Producto"
          className="w-full h-auto object-cover mb-6 rounded-lg shadow-md"
        />
      )}
    </div>

    {/* Imágenes pequeñas, alineadas al lado de la grande */}
    <div className="flex flex-col space-y-4 ml-4">
      {imageUrls && imageUrls.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`Imagen ${index + 1}`}
          className={`w-20 h-20 object-cover rounded-lg shadow-md cursor-pointer border-2 ${
            selectedImage === url ? 'border-pink-500' : 'border-transparent'
          }`}
          onClick={() => onSelectImage(url)}
        />
      ))}
    </div>
  </div>
);

ProductImageGallery.propTypes = {
  imageUrls: PropTypes.array.isRequired,
  selectedImage: PropTypes.string.isRequired,
  onSelectImage: PropTypes.func.isRequired,
};

export default ProductImageGallery;
