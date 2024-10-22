import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const Carousel = ({ images, autoPlay = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Función para ir a la siguiente imagen
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  // Función para ir a la imagen anterior
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Efecto para cambiar la imagen automáticamente cada 'interval' tiempo
  useEffect(() => {
    if (autoPlay) {
      const slideInterval = setInterval(nextSlide, interval);
      return () => clearInterval(slideInterval); // Limpia el intervalo cuando se desmonta el componente
    }
  }, [nextSlide, autoPlay, interval]);

  return (
    <div className="relative w-full max-w-[95vw] mx-auto mt-6"> {/* Menor margen a los costados */}
      {/* Botón para la imagen anterior */}
      <button 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full"
        onClick={prevSlide}
      >
        &#10094;
      </button>

      {/* Imagen actual */}
      <div className="w-full h-[350px] bg-gray-200 rounded-lg overflow-hidden"> {/* Altura reducida */}
        <img 
          src={images[currentIndex]} 
          alt={`Imagen ${currentIndex + 1}`}
          className="w-full h-full object-cover"  // Mantiene object-cover para cubrir bien el contenedor
        />
      </div>

      {/* Botón para la siguiente imagen */}
      <button 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full"
        onClick={nextSlide}
      >
        &#10095;
      </button>

      {/* Indicadores debajo del carrusel */}
      <div className="flex justify-center mt-4">
        {images.map((_, index) => (
          <div 
            key={index}
            className={`w-2 h-2 rounded-full mx-1 cursor-pointer ${index === currentIndex ? 'bg-white' : 'bg-gray-400'}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

// Validación de PropTypes para garantizar que se proporcionen las imágenes
Carousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  autoPlay: PropTypes.bool,  // Indica si se debe cambiar de imagen automáticamente
  interval: PropTypes.number // El intervalo de tiempo en milisegundos
};

export default Carousel;
