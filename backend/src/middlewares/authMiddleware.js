const jwt = require ('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split('')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};

const roleMiddleware = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({ message: 'No tienes permisos' });
        }
        next();
    };
};

module.exports = { authMiddleware, roleMiddleware };    