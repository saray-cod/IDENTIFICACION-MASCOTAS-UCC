const petModel = require('../models/petModel');
const db = require('../config/db');
const {generatePetCardPDF} = require('../services/pdfService');
const {generatePetQRCode} = require('../services/QRservices');

const registerPet = async (req, res) => {
    try {
        const { usuario_id, nombre, especie, raza, edad, sexo } = req.body;
        const files = req.files; 

        if (!usuario_id || !nombre || !especie || !raza || !edad || !sexo) {
            return res.status(400).json({ message: 'Todos los datos de la mascota son obligatorios' });
        }

        if (!files || !files.foto || !files.vacunacion || !files.desparasitacion) {
            return res.status(400).json({ message: 'debes adjuntar todos los documentos requeridos' });
        }

        const foto_URL = `/uploads/${files.foto[0].filename}`;
        const documents = [
            { tipo: 'vacunacion', archivo_URL: `/uploads/${files.vacunacion[0].filename}` },
            { tipo: 'desparasitacion', archivo_URL: `/uploads/${files.desparasitacion[0].filename}` }
        ];

        const petId = await petModel.createPetWithAplication(
            { usuario_id, nombre, especie, raza, edad, sexo, foto_URL }, documents);
        
            res.status(201).json(
                { message: 'Mascota registrada exitosamente. Pendiente de aprobación', petId });   
    } catch (error) {
        console.error('Error al registrar mascota:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const getPetCard = async (req, res) => {
    try {
        const { mascotaId } = req.params;

        const query = `
            SELECT m.*, u.nombre AS estudiante_nombre, u.carrera, s.estado 
            FROM mascotas m
            JOIN usuarios u ON m.usuario_id = u.id
            JOIN solicitudes s ON s.mascota_id = m.id
            WHERE m.id = ? AND s.estado = 'APROBADO'
    `;

    const [rows] = await db.query(query, [mascotaId]);

    if (rows.length === 0) {
        return res.status(404).json({ menssage: false, message: 'No fue posible generar el carnet. La solicitud de la mascota no ha sido aprobada' });
    }
    
    const mascota = rows[0];
    const qrDataUrl = await generatePetQRCode(mascota.id);
    
    generatePetCardPDF(mascota, qrDataUrl, res);
    }catch (error) {
        console.error('Error al generar el carnet de la mascota:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const getPublicPetInfo = async (req, res) => {
    try {
        const { mascotaId } = req.params;

        const query = `
            SELECT 
                m.id AS mascota_id,
                m.nombre AS mascota_nombre,
                m.especie,
                m.raza,
                m.edad,
                m.sexo,
                m.foto_URL,
                u.nombre AS estudiante_nombre,
                u.carrera,
                s.estado AS estado_solicitud
            FROM mascotas m
            JOIN usuarios u ON m.usuario_id = u.id
            JOIN solicitudes s ON s.mascota_id = m.id
            WHERE m.id = ? AND s.estado = 'APROBADO'
        `;

        const [rows] = await db.query(query, [mascotaId]);

        if (rows.length === 0) {
            return res.status(404).json({ autorizado: false, message: 'Carnet no valido o mascota sin autorizacion vigente' });
        }

    const petData = rows[0];
    
    res.status(200).json({
        autorizado: true,
        estado: 'AUTORIZADO',
        mascota: {
            id: petData.mascota_id,
            nombre: petData.mascota_nombre,
            especie: petData.especie,
            raza: petData.raza,
            edad: petData.edad,
            sexo: petData.sexo,
            foto_URL: petData.foto_URL
        },
        propietario: {
            nombre: petData.estudiante_nombre,
            carrera: petData.carrera
        }
    });
    }catch (error) {
        console.error('Error al obtener el carnet de la mascota:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
    
module.exports = { registerPet, getPetCard, getPublicPetInfo  };                       