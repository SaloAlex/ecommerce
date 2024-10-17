import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState(''); // Nombre completo
  const [termsAccepted, setTermsAccepted] = useState(false); // Aceptación de términos
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Verificar que los términos y condiciones hayan sido aceptados
    if (!termsAccepted) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
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
        Registrarse
      </h2>
      <form onSubmit={handleRegister} className="max-w-sm mx-auto bg-gray-900 p-6 rounded-lg shadow-lg">
        {error && <p className="text-red-500">{error}</p>}
        
        {/* Campo para el nombre completo */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-blue-400 font-semibold">Nombre completo</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-2 border-blue-500 focus:border-pink-500 focus:ring-pink-500 rounded-lg p-2 w-full text-gray-800"
            required
          />
        </div>

        {/* Campo para el correo electrónico */}
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

        {/* Campo para la contraseña */}
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

        {/* Campo para confirmar la contraseña */}
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-blue-400 font-semibold">Confirmar contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border-2 border-blue-500 focus:border-pink-500 focus:ring-pink-500 rounded-lg p-2 w-full text-gray-800"
            required
          />
        </div>

        {/* Aceptación de términos y condiciones */}
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="form-checkbox h-5 w-5 text-pink-500"
            />
            <span className="ml-2 text-gray-400">Acepto los <a href="#" className="underline text-blue-400">términos y condiciones</a></span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-2 px-4 rounded-full shadow-md hover:from-pink-600 hover:to-purple-600 transition-transform transform hover:scale-105 mb-4"
        >
          Registrarse
        </button>

        {/* Botón para registrarse con Google */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center bg-gradient-to-r from-red-500 to-yellow-500 text-white font-bold py-1 px-3 rounded-full shadow-md hover:from-red-600 hover:to-yellow-600 transition-transform transform hover:scale-105 w-full"
        >
          <FaGoogle className="mr-2" /> Registrarse con Google
        </button>
      </form>
    </div>
  );
};

export default Register;
