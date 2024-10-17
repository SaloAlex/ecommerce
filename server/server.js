import express from 'express';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import cors from 'cors';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../src/firebase/firebaseConfig.js'; // Asegúrate de que Firebase esté configurado

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

// Endpoint para crear la preferencia de pago
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

// Endpoint para Webhook (notificaciones de Mercado Pago)
app.post('/webhook', async (req, res) => {
  try {
    const { data } = req.body;
    const paymentId = data.id; // ID del pago que se puede usar para verificar el estado

    // Llamada a la API de Mercado Pago para obtener detalles del pago
    const paymentInfo = await client.payment.findById(paymentId);

    const paymentStatus = paymentInfo.body.status;

    if (paymentStatus === 'approved') {
      const items = req.body.items || [];

      for (const item of items) {
        const productRef = doc(db, 'products', item.id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const currentStock = productSnap.data().stock;
          const newStock = currentStock - item.quantity;

          if (newStock >= 0) {
            await updateDoc(productRef, { stock: newStock });
            console.log(`Stock actualizado para el producto ${item.title}: ${newStock}`);
          } else {
            console.error(`Stock insuficiente para el producto ${item.title}`);
          }
        } else {
          console.error(`Producto con id ${item.id} no encontrado.`);
        }
      }
    }

    res.sendStatus(200); // Confirmar recepción exitosa del webhook
  } catch (error) {
    console.error('Error procesando el webhook:', error);
    res.status(500).json({
      error: 'Error procesando el webhook',
      details: error.message,
    });
  }
});

// Endpoints para el redireccionamiento después del pago
app.get('/success', (req, res) => res.send("Pago exitoso"));
app.get('/failure', (req, res) => res.send("Pago fallido"));
app.get('/pending', (req, res) => res.send("Pago pendiente"));

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
