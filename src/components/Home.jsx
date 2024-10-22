import Carousel from './Carousel';
import ProductList from './ProductList';
import image1 from '../assets/banner1.jpg'; 
import image2 from '../assets/banner2.jpg';
import image3 from '../assets/banner3.jpg';

const Home = () => {
  const images = [image1, image2, image3]; 

  return (
    <div className="mt-10"> 
      
      {/* Renderizamos el carrusel con autoPlay activado */}
      <Carousel images={images} autoPlay={true} interval={5000} />
      <ProductList />
    </div>
  );
};

export default Home;
