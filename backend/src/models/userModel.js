const db = require('../config/db');

const userModel = {
    findByEmail: async (correo) => {
        const [rows] = await db.execute('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        return rows[0];
    },

create: async (userData) => {
        const { nombre, documento, correo, password, carrera, rol } = userData;
        const userRole = rol || 'ESTUDIANTE'; // Asignar 'ESTUDIANTE' si no se proporciona un rol

        const [result] = await db.query(
            'INSERT INTO usuarios (nombre, documento, correo, password, carrera, rol) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, documento, correo, password, carrera, userRole]
        );
        return result.insertId;
    }
};
module.exports = userModel;
