// Importa las funciones necesarias de los SDKs de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Para Firestore
import { getAuth } from "firebase/auth"; // Para autenticación (opcional)
import { getStorage } from "firebase/storage"; // Para Storage

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBClThDiqs2ntsWigUxVv_Ro-0YI0QY6M8",
  authDomain: "ecommerce-mati.firebaseapp.com",
  projectId: "ecommerce-mati",
  storageBucket: "ecommerce-mati.appspot.com",
  messagingSenderId: "862242028887",
  appId: "1:862242028887:web:21d6a75559c9b90f6c9212",
  measurementId: "G-11GV0RYVWE"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

// Inicializar Authentication (si lo necesitas)
const auth = getAuth(app);

// Inicializar Storage
const storage = getStorage(app);

// Exportar las instancias de Firebase para usarlas en tu aplicación
export { db, auth, storage };
