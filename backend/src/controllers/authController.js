const { Router } = require('express');
const UserModel = require('../models/userModel');

const registrer = async (req, res) => {
    try {
        const { nombre, documento, email, cotraseña, carrera, rol } = req.body;

        if (!nombre || !documento || !email || !cotraseña || !carrera) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'El email ya está registrado' });  

        }

        const userId = await UserModel.create({ nombre, documento, email, cotraseña, carrera, rol });
        res.status(201).json({ message: 'Usuario registrado exitosamente', userId });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }                                                    
};
 
module.exports = {registrer};
       
