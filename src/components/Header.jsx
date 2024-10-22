import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import Swal from "sweetalert2";
import { getAuth, signOut } from "firebase/auth";
import logoImage from "../assets/logo.png"; // Importa tu imagen de logo

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const [user, setUser] = useState(null); // Estado para el usuario autenticado
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    // Listener para el estado de autenticación
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup del listener
  }, [auth]);

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleCartClick = (e) => {
    if (totalItems === 0) {
      e.preventDefault();
      Swal.fire({
        icon: "info",
        title: "Carrito vacío",
        text: "No tienes productos en tu carrito. ¡Agrega algunos para continuar!",
      });
    } else {
      navigate("/cart");
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Cierre de sesión exitoso",
          timer: 2000,
          showConfirmButton: false,
        });
        setUser(null);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  return (
    <header className="bg-gray-900 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Mostrar la imagen de logo si existe, sino el texto */}
        <Link to="/" className="flex items-center">
          <img
            src={logoImage}
            alt="Logo"
            className="w-[150px] h-[80px] object-contain" // Ajusta estas medidas según lo necesario
            onError={(e) => {
              e.target.style.display = "none";
            }} // Si falla cargar la imagen, ocúltala
          />
          {!logoImage && (
            <span className="text-pink-500 text-3xl font-bold neon-effect">
              TECNO&+
            </span>
          )}
        </Link>

        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link
                to="/products"
                className="text-blue-500 hover:text-pink-500 transition duration-300"
              >
                Productos
              </Link>
            </li>

            {user ? (
              <>
                <li className="text-white flex items-center space-x-2">
                  {" "}
                  {/* Flex para alinear el icono y el texto */}
                  <FaUser className="text-xl" /> {/* Icono del usuario */}
                  <span>{user.displayName || user.email}</span>{" "}
                  {/* Nombre o correo */}
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-blue-500 hover:text-pink-500 transition duration-300"
                  >
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="text-blue-500 hover:text-pink-500 transition duration-300"
                  >
                    Iniciar Sesión
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-blue-500 hover:text-pink-500 transition duration-300"
                  >
                    Registrarse
                  </Link>
                </li>
              </>
            )}

            <li className="relative">
              <button
                onClick={handleCartClick}
                className="text-blue-500 hover:text-pink-500 transition duration-300 flex items-center"
              >
                <FaShoppingCart className="text-2xl" />
                {totalItems > 0 && (
                  <span className="bg-pink-500 text-white rounded-full px-2 py-1 text-xs absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
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
