import { createPool } from "mysql2/promise"; 

// Conexión a la base de datos.
export const pool = createPool({
    user: 'root',
    password: 'root',
    host: 'localhost',
    database: 'app_appointment_dental'
});
