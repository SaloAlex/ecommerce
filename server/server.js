import express from 'express';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { body, validationResult } from 'express-validator';
import { generateDiscountCode, validateDiscountCode } from './discountController.js';
import config from './config.js';

const app = express();
const port = config.server.port;

// Middlewares de seguridad y optimización
app.use(helmet()); // Añade headers de seguridad
app.use(morgan('dev')); // Logging en desarrollo
app.use(compression()); // Compresión de respuestas
app.use(express.json()); // Parser para JSON

// Configuración de CORS
app.use(cors({
  origin: config.cors.origins,
  methods: ['GET', 'POST'],
  credentials: true
}));

// Configuración de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: config.mercadopago.accessToken
});

// Validación para el endpoint create_preference
const validateItems = [
  body('items').isArray().notEmpty().withMessage('Items debe ser un array no vacío'),
  body('items.*.quantity').isNumeric().withMessage('La cantidad debe ser numérica'),
  body('items.*.unit_price').isNumeric().withMessage('El precio debe ser numérico'),
  body('items.*.title').isString().notEmpty().withMessage('El título es requerido'),
];

// Endpoint para crear preferencia de pago
app.post('/create_preference', validateItems, async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items } = req.body;
    const preference = new Preference(client);
    
    const result = await preference.create({
      body: {
        items: items.map(item => ({
          ...item,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price)
        })),
        back_urls: config.urls,
        auto_return: "approved",
        // Añadir notification_url si tienes un endpoint para webhooks
        // notification_url: `${config.server.baseUrl}/webhook`
      }
    });

    res.json({ 
      id: result.id,
      init_point: result.init_point // URL para redirigir al checkout
    });
  } catch (error) {
    console.error('Error creating preference:', error);
    res.status(500).json({ 
      error: 'Error al crear la preferencia',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Validación para endpoints de descuento
const validateDiscountGeneration = [
  body('code').isString().notEmpty().withMessage('El código es requerido'),
  body('discountValue').isNumeric().withMessage('El valor del descuento debe ser numérico'),
  body('expirationDate').isISO8601().withMessage('Fecha de expiración inválida')
];

// Endpoint para generar códigos de descuento
app.post('/generate_discount', validateDiscountGeneration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, discountValue, expirationDate } = req.body;
    await generateDiscountCode(code, discountValue, new Date(expirationDate));
    res.status(200).json({ message: 'Código de descuento generado con éxito' });
  } catch (error) {
    console.error('Error generating discount:', error);
    res.status(500).json({ 
      error: 'Error al generar el código de descuento',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Endpoint para validar códigos de descuento
app.post('/validate_discount', 
  body('code').isString().notEmpty().withMessage('El código es requerido'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { code } = req.body;
      const discountValue = await validateDiscountCode(code);
      res.status(200).json({ discountValue });
    } catch (error) {
      console.error('Error validating discount:', error);
      res.status(400).json({ 
        error: 'Error al validar el código de descuento',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Invalid discount code'
      });
    }
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en ${config.server.baseUrl}`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});