
import Header from './Header';  // El Header (Navbar)
import ProductList from './ProductList';  // El listado de productos

const Home = () => {
  return (
    <div>
      {/* Renderiza el Header (Navbar) */}
      <Header />

      <h1 className="text-4xl font-bold mb-6 text-center">Bienvenido a nuestra tienda</h1>
      
      {/* Renderizamos el listado de productos */}
      <ProductList />
    </div>
  );
};

export default Home;
