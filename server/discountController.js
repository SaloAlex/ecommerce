import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../src/firebase/firebaseConfig.js'; // Asegúrate de usar tu configuración

// Función para generar un código de descuento
export const generateDiscountCode = async (code, discountValue, expirationDate) => {
    try {
      const discountRef = doc(db, 'discountCodes', code); // Usar 'code' como ID del documento
      await setDoc(discountRef, {
        discountValue,
        expirationDate: expirationDate.toISOString(), // Convertimos la fecha a formato ISO string
        isActive: true, // El código está activo
        usageLimit: 1,  // Puedes ajustar este valor según tus necesidades
      });
      console.log(`Código de descuento ${code} generado con éxito`);
    } catch (error) {
      console.error("Error generando el código de descuento:", error);
      throw new Error('No se pudo generar el código de descuento');
    }
  };

// Función para validar un código de descuento
export const validateDiscountCode = async (code) => {
    try {
      const discountRef = doc(db, 'discountCodes', code);
      const discountSnap = await getDoc(discountRef);
  
      if (!discountSnap.exists()) {
        throw new Error('Código de descuento inválido.');
      }
  
      const discountData = discountSnap.data();
  
      // Convertir expirationDate de cadena ISO a un objeto Date
      const expirationDate = new Date(discountData.expirationDate);
  
      // Verificar si el código ha expirado
      if (expirationDate < new Date()) {
        throw new Error('El código de descuento ha expirado.');
      }
  
      // Verificar si el código sigue activo
      if (!discountData.isActive) {
        throw new Error('El código de descuento no está activo.');
      }
  
      return discountData.discountValue;
    } catch (error) {
      console.error('Error validando el código de descuento:', error);
      throw error;
    }
  };
