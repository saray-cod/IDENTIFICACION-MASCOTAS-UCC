const QRcode = require('qrcode');

const generatePetQRCode = async (mascotaId) => {
    try {
        const URL = `http://localhost:3000/api/mascotas/publica/${mascotaId}`

        const qrDataUrl = await QRcode.toDataURL(URL);
        return qrDataUrl;
    } catch (error) {
        console.error('Error al generar el código QR:', error);
        throw error;
    }
};

module.exports = { generatePetQRCode };
