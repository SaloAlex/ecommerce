import  { useState, useRef } from 'react';
import PropTypes from 'prop-types';

const ProductImageGallery = ({ imageUrls, selectedImage, onSelectImage }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef(null);

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const handleMouseMove = (e) => {
    if (imageContainerRef.current) {
      const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setMousePosition({ x, y });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Imagen grande en la parte superior con efecto de zoom */}
      <div 
        className="w-full h-96 bg-white rounded-lg overflow-hidden relative cursor-zoom-in"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        ref={imageContainerRef}
      >
        {selectedImage && (
          <div
            className="w-full h-full absolute top-0 left-0"
            style={{
              backgroundImage: `url(${selectedImage})`,
              backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: isZoomed ? '200%' : 'contain',
              transition: 'background-size 0.3s ease-out',
            }}
          />
        )}
      </div>

      {/* Imágenes pequeñas debajo de la imagen grande */}
      <div className="flex space-x-4">
        {imageUrls && imageUrls.map((url, index) => (
          <div
            key={index}
            className={`w-20 h-20 p-1 cursor-pointer border-2 rounded-md ${
              selectedImage === url ? 'border-purple-600' : 'border-gray-300'
            }`}
            onClick={() => onSelectImage(url)}
          >
            <img
              src={url}
              alt={`Imagen ${index + 1}`}
              className="object-contain w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

ProductImageGallery.propTypes = {
  imageUrls: PropTypes.array.isRequired,
  selectedImage: PropTypes.string.isRequired,
  onSelectImage: PropTypes.func.isRequired,
};

export default ProductImageGallery;