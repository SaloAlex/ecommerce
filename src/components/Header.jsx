import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext'; // Importar el contexto del carrito
import { FaShoppingCart } from 'react-icons/fa'; // Importar el ícono de carrito
import Swal from 'sweetalert2'; // Importar SweetAlert2

const Header = () => {
  const { cartItems } = useContext(CartContext); // Obtener los productos del carrito desde el contexto
  const navigate = useNavigate(); // Para redirigir al carrito

  // Calcular el total de productos en el carrito
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Función para manejar el acceso al carrito
  const handleCartClick = (e) => {
    if (totalItems === 0) {
      e.preventDefault(); // Evitar que el enlace redirija
      Swal.fire({
        icon: 'info',
        title: 'Carrito vacío',
        text: 'No tienes productos en tu carrito. ¡Agrega algunos para continuar!',
      });
    } else {
      navigate('/cart'); // Redirigir al carrito si no está vacío
    }
  };

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
            <li className="relative">
              <button
                onClick={handleCartClick}
                className="text-white hover:underline flex items-center"
              >
                <FaShoppingCart className="text-2xl" /> {/* Icono de carrito */}
                {totalItems > 0 && (
                  <span className="bg-black text-white rounded-full px-2 py-1 text-xs absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                    {totalItems}
                  </span>
                )}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
