import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirige al home después del login
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-bold text-center mb-6 text-pink-500 neon-effect">
        Iniciar Sesión
      </h2>
      <form onSubmit={handleLogin} className="max-w-sm mx-auto bg-gray-900 p-6 rounded-lg shadow-lg">
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-4">
          <label htmlFor="email" className="block text-blue-400 font-semibold">Correo electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-blue-500 focus:border-pink-500 focus:ring-pink-500 rounded-lg p-2 w-full text-gray-800"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-blue-400 font-semibold">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-blue-500 focus:border-pink-500 focus:ring-pink-500 rounded-lg p-2 w-full text-gray-800"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-2 px-4 rounded-full shadow-md hover:from-pink-600 hover:to-purple-600 transition-transform transform hover:scale-105 mb-4"
        >
          Iniciar Sesión
        </button>

        {/* Botón para iniciar sesión con Google */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center bg-gradient-to-r from-red-500 to-yellow-500 text-white font-bold py-1 px-3 rounded-full shadow-md hover:from-red-600 hover:to-yellow-600 transition-transform transform hover:scale-105 w-full"
        >
          <FaGoogle className="mr-2" /> Iniciar sesión con Google
        </button>
      </form>
    </div>
  );
};

export default Login;
