const db = require('../config/db');

const userModel = {
    findByEmail: async (email) => {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

create: async (userData) => {
        const { nombre, documento, email, cotraseña, carrera, rol } = userData;
        const [result] = await db.query(
            'INSERT INTO users (nombre, documento, email, cotraseña, carrera, rol) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, documento, email, cotraseña, carrera, rol || 'ESTUDIANTE']
        );
        return result;
    }
};
module.exports = userModel;
