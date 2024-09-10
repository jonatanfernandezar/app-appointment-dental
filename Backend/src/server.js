import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit'; //Limita la cantidad de solicitudes repetidas a la API desde una misma IP
import adminRoutes from './routes/admin.routes.js';
import superAdmin from './routes/superAdmin.routes.js';
import authRouter from './routes/auth.routes.js';

const app = express();
const port = 8000;

// Middleware
app.use(cors()); // Proteccion y politicas de origen para comunicacion Front-Back
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet()); // Protección básica de cabeceras HTTP seguros
app.use(hpp());    // Protección contra contaminación de parámetros HTTP de las rutas de la API


// Limitar la cantidad de solicitudes para prevenir ataques de fuerza bruta
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita a 100 solicitudes por IP
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta de nuevo después de 15 minutos'
});

app.use(limiter);


// Ruta principal de la API (auth, users, admin).
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/super-admin', superAdmin);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
