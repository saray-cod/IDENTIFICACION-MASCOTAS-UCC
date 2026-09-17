const requestModel = require('../models/requestModel');

const getPendigApplications = async (req, res) => {
    try {
        const requests = await requestModel.getPendingRequests();
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error al obtener solicitudes pendientes:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const reviewApplication = async (req, res) => {
    try {
        const { solicitudId } = req.params;
        const { estado, justificacion } = req.body;

        if (!['APROBADA', 'RECHAZADA'].includes(estado)) {
            return res.status(400).json({ message: 'Estado inválido. Debe ser "APROBADA" o "RECHAZADA"' });
        }

    if (estado === 'RECHAZADA' && !justificacion) {
        return res.status(400).json({ message: 'Se requiere justificación al rechazar una solicitud' });
    }

    const updated = await requestModel.updateRequestStatus(solicitudId, estado, justificacion);

    if (!updated) {
        return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    res.status(200).json({ message: `La solicitud ha sido ${estado.toLowerCase()}` });
    } catch (error) {
        console.error('Error al revisar solicitud:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = { getPendigApplications, reviewApplication };