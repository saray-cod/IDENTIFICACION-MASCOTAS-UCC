const UserModel = require('../models/userModel');

const register = async (req, res) => {
    try {
        const { nombre, documento, correo, password, carrera, rol } = req.body;

        if (!nombre || !documento || !correo || !password || !carrera) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const existingUser = await UserModel.findByEmail(correo);
        if (existingUser) {
            return res.status(400).json({ message: 'El correo ya está registrado' });  
        }

        const rolesPermitidos = ['ESTUDIANTE', 'ADMIN', 'COORDINADOR', 'AUXILIAR' ];
        const userRole = (rol && rolesPermitidos.includes(rol.toUpperCase())) ? rol.toUpperCase() : 'ESTUDIANTE';

        const userId = await UserModel.create({ 
            nombre, 
            documento, 
            correo, 
            password, 
            carrera, 
            rol: userRole });
        res.status(201).json({ message: 'Usuario registrado exitosamente', userId });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }                                                    
};

//funcion de login
const login = async (req, res) => {
    try {
        const { correo, password } = req.body;
        if (!correo || !password) {
            return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
        }

        const user = await UserModel.findByEmail(correo);
        if (!user) {
            return res.status(401).json({ message: 'usuario no encontrado' });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        res.status(200).json({ 
            message: 'Inicio de sesión exitoso', 
            user: {
                id: user.id,
                nombre: user.nombre,
                documento: user.documento,
                correo: user.correo,
                carrera: user.carrera,
                rol: user.rol 
            }
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = { register, login };
