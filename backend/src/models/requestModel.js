const db = require('../config/db');

const RequestModel = {

    getPendingRequests: async () => {
    const query = `
        SELECT 
        s.id AS solicitud_id,
        s.estado,
        s.create_at,
        m.nombre AS mascota_nombre,
        m.especie,
        m.raza,
        m.foto_url,
        u.nombre AS estudiante_nombre,
        u.correo AS estudiante_correo,
        u.carrera
        FROM solicitudes s
        JOIN mascotas m ON s.mascota_id = m.id
        JOIN usuarios u ON m.usuario_id = u.id
        WHERE s.estado = 'PENDIENTE'
        ORDER BY s.create_at ASC
    `;
    const [rows] = await db.query(query);
    return rows;
    },

    updateRequestStatus: async (solicitud, estado, justificacion = null) => {
        const query = `
            UPDATE solicitudes
            SET estado = ?, justificacion = ?
            WHERE id = ?
        `;
        const [result] = await db.query(query, [estado, justificacion, solicitud]);
        return result.affectedRows > 0;
    }
};

module.exports = RequestModel;



    
