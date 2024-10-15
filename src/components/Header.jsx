// src/components/Header.js
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Mi E-commerce</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="text-white hover:underline">Inicio</Link>
            </li>
            <li>
              <Link to="/products" className="text-white hover:underline">Productos</Link>
            </li>
            <li>
              <Link to="/cart" className="text-white hover:underline">Carrito</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
