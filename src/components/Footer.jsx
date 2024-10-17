const Footer = () => {
  return (
    <footer className="bg-gray-900 p-4 mt-8 shadow-inner">
      <div className="container mx-auto text-center">
        <p className="text-pink-500 neon-effect">© 2023 TECNO&+. Todos los derechos reservados.</p>
        <p className="text-blue-500 hover:text-pink-500 transition duration-300">
          Contacto: <a href="mailto:tecnoymasok@gmail.com" className="underline">tecnoymasok@gmail.com</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
