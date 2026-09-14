const express = require ("express");
require ("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use (express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.get ("/", (req, res) => {
    res.send("backend funcionando correctamente");
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});






