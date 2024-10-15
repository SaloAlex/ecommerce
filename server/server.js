import express from 'express';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
}));

const client = new MercadoPagoConfig({
  accessToken: 'TEST-7367603142764029-090923-366ba98cdd8ba7c028dafafebc6fd3ae-46595777'
});

app.use(express.json());

app.post('/create_preference', async (req, res) => {
  try {
    console.log('Received request body:', req.body);

    const { items } = req.body;
    
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Invalid items array');
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

    console.log('Preference created successfully:', result);
    res.json({ id: result.id });
  } catch (error) {
    console.error('Error creating preference:', error);
    res.status(500).json({ 
      error: 'Error al crear la preferencia',
      details: error.message,
      stack: error.stack
    });
  }
});

app.get('/success', (req, res) => res.send("Pago exitoso"));
app.get('/failure', (req, res) => res.send("Pago fallido"));
app.get('/pending', (req, res) => res.send("Pago pendiente"));

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});