const express = require('express');
const path = require('path');
require('dotenv').config();

const cors = require('cors');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

// Obtener todas las IPs locales activas del equipo para el log
function getLocalIPs() {
    const interfaces = os.networkInterfaces();
    const ips = [];
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                ips.push(iface.address);
            }
        }
    }
    return ips.length > 0 ? ips : ['127.0.0.1'];
}

// Middleware de CORS dinámico (Permite localhost, 127.0.0.1 y cualquier IP de red local)
const corsOptions = {
    origin: function (origin, callback) {
        // Permitir peticiones sin origen (como Postman o apps móviles)
        if (!origin) return callback(null, true);

        // Expresión regular que permite localhost o cualquier IP privada (10.x.x.x, 192.168.x.x, 172.16-31.x.x)
        const isAllowed = /^http:\/\/(localhost|127\.0\.0\.1|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})(:\d+)?$/.test(origin);

        if (isAllowed) {
            callback(null, true);
        } else {
            console.warn(`[CORS Bloqueado]: ${origin}`);
            callback(new Error('Origen no permitido por CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

// Aplicar CORS a todas las rutas
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Carga de rutas
const authRoutes = require('./src/routes/authRoutes');
const petRoutes = require('./src/routes/petRoutes');
const adminRoutes = require('./src/routes/admin.routes');

app.use('/api/pets', petRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send("Backend funcionando correctamente");
});

app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Escuchar en 0.0.0.0 para recibir tráfico de la red local
app.listen(PORT, '0.0.0.0', () => {
    const localIPs = getLocalIPs();
    console.log(`\n${'='.repeat(60)}`);
    console.log(`SERVIDOR INICIADO EN PUERTO ${PORT}`);
    console.log(`${'='.repeat(60)}`);
    console.log(` Acceso Local:  http://localhost:${PORT}`);
    localIPs.forEach(ip => {
        console.log(` Acceso Red:    http://${ip}:${PORT}`);
    });
    console.log(`${'='.repeat(60)}\n`);
});

module.exports = app;






