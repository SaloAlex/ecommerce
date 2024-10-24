const config = {
    mercadopago: {
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-7367603142764029-090923-366ba98cdd8ba7c028dafafebc6fd3ae-46595777', // Token de prueba
    },
    cors: {
      origins: ['http://localhost:5173', 'http://your-frontend-domain.com'], // Permitir orígenes, incluyendo el frontend local
    },
    server: {
      port: process.env.PORT || 3001, // Puerto del servidor
      baseUrl: 'http://localhost:3001', // Base URL del servidor
    },
    urls: {
      success: 'http://localhost:5173/success', // URL para el éxito en el frontend local
      failure: 'http://localhost:5173/failure', // URL para el fallo en el frontend local
      pending: 'http://localhost:5173/pending'  // URL para pagos pendientes en el frontend local
    }
  };
  
  export default config;
  