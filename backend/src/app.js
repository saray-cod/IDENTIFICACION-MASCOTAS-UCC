const express = require ('express');
const path = require ('path');
require ('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use (express.json());

app.use ('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');
const adminRoutes = require('./routes/admin.routes');

app.use('/api/pets', petRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.get ( '/', (req, res) => {
    res.send("backend funcionando correctamente");
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});






