const UserModel = require('../models/userModel');

const register = async (req, res) => {
    try {
        const { nombre, documento, correo, password, carrera } = req.body;

        if (!nombre || !documento || !correo || !password || !carrera) {
            return res.status(400).json({ 
                message: 'Todos los campos son obligatorios',
                campos_esperados: ['nombre', 'documento', 'correo', 'password', 'carrera']
            });  
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            return res.status(400).json({ 
                message: 'El correo no es válido'
            });
        }

        const existingUser = await UserModel.findByEmail(correo);
        if (existingUser) {
            return res.status(400).json({ message: 'El correo ya está registrado' });  
        }

        const existingDocument = await UserModel.findByDocument(documento);
        if (existingDocument) {
            return res.status(400).json({ 
                message: 'El documento ya está registrado' 
            });
        }

        const userRole = 'ESTUDIANTE';

        const userId = await UserModel.create({ 
            nombre, 
            documento, 
            correo, 
            password, 
            carrera, 
            rol: userRole });

        res.status(201).json({ message: 'Usuario registrado exitosamente', 
            userId,
            user: {id: userId, rol: userRole}
            });

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
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

        console.log(`Login exitoso: ${correo} (Rol: ${user.rol})`);

        const jwt = require('jsonwebtoken');

        const token = jwt.sign({ 
                id: user.id,
                rol: user.rol, 
                correo: user.correo 
            },
            process.env.JWT_SECRET || 'tu_clave',
            { expiresIn: '24h' }
        );

        res.status(200).json({ 
            message: 'Inicio de sesión exitoso', 
            token,
            user: { id: user.id, nombre: user.nombre, rol: user.rol }
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

module.exports = { register, login };
