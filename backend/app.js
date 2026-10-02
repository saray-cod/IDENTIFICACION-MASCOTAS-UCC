const express = require ('express');
const path = require ('path');
require ('dotenv').config();

const cors = require ('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use (cors());

app.use (express.json());

app.use ('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./src/routes/authRoutes');
const petRoutes = require('./src/routes/petRoutes');
const adminRoutes = require('./src/routes/admin.routes');

app.use('/api/pets', petRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.get ( '/', (req, res) => {
    res.send("backend funcionando correctamente");
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});






