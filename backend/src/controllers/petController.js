const petModel = require('../models/petModel');

const registrerPet = async (req, res) => {
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

module.exports = { registrerPet };                       