import express from 'express';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import cors from 'cors';
import { generateDiscountCode, validateDiscountCode } from './discountController.js'; // Importa el controlador

const app = express();
const port = 3000;

app.use(cors({
  origin: ['http://localhost:5173', 'https://ecommerce-8cjaz03ew-alexsalos-projects.vercel.app'], // Asegúrate que este sea el origen correcto de tu frontend
  methods: ['GET', 'POST'],
}));

const client = new MercadoPagoConfig({
  accessToken: 'TEST-7367603142764029-090923-366ba98cdd8ba7c028dafafebc6fd3ae-46595777'
});

app.use(express.json());

// Endpoint para crear la preferencia de pago
app.post('/create_preference', async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid items array' });
    }

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: items.map(item => ({
          ...item,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price)
        })),
        back_urls: {
          success: "http://localhost:3000/success",
          failure: "http://localhost:3000/failure",
          pending: "http://localhost:3000/pending"
        },
        auto_return: "approved",
      }
    });

    res.json({ id: result.id });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al crear la preferencia',
      details: error.message,
      stack: error.stack
    });
  }
});

// Endpoint para generar códigos de descuento
app.post('/generate_discount', async (req, res) => {
  const { code, discountValue, expirationDate } = req.body;
  
  try {
    await generateDiscountCode(code, discountValue, new Date(expirationDate));
    res.status(200).json({ message: 'Código de descuento generado con éxito' });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al generar el código de descuento', 
      details: error.message 
    });
  }
});

// Endpoint para validar un código de descuento
app.post('/validate_discount', async (req, res) => {
  const { code } = req.body;
  
  try {
    const discountValue = await validateDiscountCode(code);
    res.status(200).json({ discountValue });
  } catch (error) {
    res.status(400).json({ 
      error: 'Error al validar el código de descuento', 
      details: error.message 
    });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
