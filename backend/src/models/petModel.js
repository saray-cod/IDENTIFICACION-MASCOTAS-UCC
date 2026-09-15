//aqui se incluyes las consultas para insertar la mascota, guardar los documentos y crear la solicitud 
const db = require('../config/db');

const petModel = {
    createPetWithAplication: async (petData, documents) => {
        const { usuario_id, nombre, especie, raza, edad, sexo, foto_URL } = petData;
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [petResult] = await connection.query(
                'INSERT INTO mascotas (usuario_id, nombre, especie, raza, edad, sexo, foto_URL) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [usuario_id, nombre, especie, raza, edad, sexo, foto_URL]
            );

            const mascotaId = petResult.insertId;

            for (const doc of documents) {
                await connection.query(
                    'INSERT INTO documentos (mascota_id, tipo, archivo_URL) VALUES (?, ?, ?)',
                    [mascotaId, doc.tipo, doc.archivo_URL]
                );
            }

            await connection.query(
                'INSERT INTO solicitudes (mascota_id, estado) VALUES (?, ?)',
                [mascotaId, 'PENDIENTE']
            );

            await connection.commit();
            return mascotaId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
};   

module.exports = petModel;



