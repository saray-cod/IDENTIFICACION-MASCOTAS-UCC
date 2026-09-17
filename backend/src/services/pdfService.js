// src/services/pdfService.js
const PDFDocument = require('pdfkit');
const path = require('path');

const generatePetCardPDF = (mascota, qrDataUrl, res) => {
  // Tamaño estilo Carnet ID / Tarjeta (Ancho: 240pt, Alto: 150pt)
    const doc = new PDFDocument({ size: [240, 150], margin: 8 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=carnet-${mascota.nombre}.pdf`);

    doc.pipe(res);

  // Encabezado UCC
    doc.rect(0, 0, 240, 25).fill('#1E3A8A'); // Barra azul superior
    doc.fillColor('#000000').fontSize(8).text('UNIVERSIDAD COOPERATIVA DE COLOMBIA', 0, 8, { align: 'center', width: 240 });

    if (mascota.foto_URL) {
      const photoPath = path.join(__dirname, '..', '..', mascota.foto_URL);
      try {
        doc.image(photoPath, 12, 30, { fit: [55, 55], align: 'center' });
      }catch (error) {
        console.error('Error al cargar la foto de la mascota:', error);
      }
    }
// Nombre de la mascota
  doc.fillColor('#000000').fontSize(12).text(mascota.nombre.toUpperCase(), 75, 28, { width: 155 });
  doc.fontSize(7).fillColor('#4B5563').text(`Especie: ${mascota.especie}`, 75, 43);

  // Distintivo AUTORIZADO en verde
  doc.rect(75, 54, 150, 14).fill('#16A34A');
  doc.fillColor('#FFFFFF').fontSize(8).text('● AUTORIZADO', 75, 57, { align: 'center', width: 150 });

  // Código QR
  doc.image(qrDataUrl, 90, 72, { fit: [60, 60], align: 'center' });

  // Pie de página
  doc.fontSize(6).fillColor('#666666').text('Escanea el QR para validar autorización de ingreso', 0, 138, { align: 'center', width: 240 });

  doc.end();
    
};

module.exports = { generatePetCardPDF };

