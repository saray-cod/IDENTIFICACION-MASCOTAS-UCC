const db = require('../config/db');

const userModel = {
    findByEmail: async (correo) => {
        try {
            const [rows] = await db.execute('SELECT * FROM usuarios WHERE correo = ?', [correo]);
            return rows[0] || null;
        
        } catch (error) {
            console.error('Error al encontrar el email:', error);
            throw error;
        }    
    },
    
    findByDocument: async (documento) => {
        try {
            const [rows] = await db.execute ('SELECT * FROM usuarios WHERE documento = ?', [documento]);
            return rows[0] || null;
        } catch (error) {
            console.error('Error al encontrar el codumento:', error);
            throw error;
        }
    },

    create: async (userData) => {
        try {
            const { nombre, documento, correo, password, carrera, rol } = userData;
            const rolesValidos = ['ESTUDIANTE', 'AUXILIAR', 'COORDINADOR', 'ADMINISTRADOR'];
            const userRole = rolesValidos.includes(rol) ? rol : 'ESTUDIANTE';

            const [result] = await db.execute(
                'INSERT INTO usuarios (nombre, documento, correo, password, carrera, rol) VALUES (?, ?, ?, ?, ?, ?)',
                [nombre, documento, correo, password, carrera, userRole]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    },

    findById: async (id) => {
        try {
            const [rows] = await db.execute(
                    'SELECT * FROM usuarios WHERE id = ?',
                    [id]
                );
                return rows[0] || null;
            } catch (error) {
                console.error('Error en findById:', error);
                throw error;
        }
    }
};

module.exports = userModel;
