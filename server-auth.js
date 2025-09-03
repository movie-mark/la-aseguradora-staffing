// Servidor de autenticación básico con Node.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Usuarios con contraseñas hasheadas (en producción usar base de datos)
const users = [
    {
        id: 1,
        username: 'admin',
        password: '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', // admin123
        role: 'admin'
    },
    {
        id: 2,
        username: 'staff',
        password: '$2b$10$sRZ9L0wY3nO4qM5rS6tU7vX8wY9zA0bC1dE2fG3hI4jK5lM6nO7pQ8rS9tU', // staff123
        role: 'staff'
    },
    {
        id: 3,
        username: 'user',
        password: '$2b$10$tSZ0M1xZ4oP5rN6sT7uV8wX9xZ0aB1cD2eF3gH4iJ5kL6mN7oP8qR9sT', // user123
        role: 'user'
    }
];

// JWT Secret (en producción usar variable de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-super-seguro-aqui';

// Endpoint de login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Buscar usuario
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        
        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        
        // Generar JWT
        const token = jwt.sign(
            { 
                userId: user.id, 
                username: user.username, 
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
        
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Middleware para verificar JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Token requerido' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

// Endpoint para enviar cédula (protegido)
app.post('/api/cedula', authenticateToken, async (req, res) => {
    try {
        const { cedula } = req.body;
        
        // Validar cédula
        if (!/^[0-9]{7,10}$/.test(cedula)) {
            return res.status(400).json({ error: 'Formato de cédula inválido' });
        }
        
        // Aquí enviarías al webhook de n8n
        const webhookUrl = process.env.N8N_WEBHOOK_URL;
        if (webhookUrl) {
            const payload = {
                event: 'cedula_consultation',
                timestamp: new Date().toISOString(),
                username: req.user.username,
                cedula: cedula,
                session_id: req.user.userId
            };
            
            // Enviar a n8n (implementar según necesidad)
            console.log('Enviando a n8n:', payload);
        }
        
        res.json({
            success: true,
            message: 'Cédula procesada correctamente',
            cedula: cedula
        });
        
    } catch (error) {
        console.error('Error procesando cédula:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para verificar token
app.get('/api/verify', authenticateToken, (req, res) => {
    res.json({
        valid: true,
        user: req.user
    });
});

app.listen(PORT, () => {
    console.log(`Servidor de autenticación corriendo en puerto ${PORT}`);
});
