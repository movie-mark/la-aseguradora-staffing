# 🔒 Mejoras de Seguridad - La Aseguradora

## Vulnerabilidades Actuales

### 1. ❌ Credenciales Hardcodeadas
```javascript
// PROBLEMA: Visible en el código fuente
const validUsers = {
    'admin': 'admin123',
    'staff': 'staff123',
    'user': 'user123'
};
```

### 2. ❌ Autenticación Solo Frontend
- No hay validación en servidor
- Fácil de manipular desde consola
- localStorage puede ser modificado

### 3. ❌ Webhook URL Expuesta
- URL visible en código fuente
- Acceso directo al webhook

## Soluciones Implementadas

### Opción A: Servidor de Autenticación (Recomendado)

#### Archivos Creados:
- `server-auth.js` - Servidor Node.js con JWT
- `package.json` - Dependencias necesarias

#### Características:
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Tokens JWT con expiración
- ✅ Validación en servidor
- ✅ Webhook URL en variables de entorno
- ✅ Middleware de autenticación

#### Instalación:
```bash
npm init -y
npm install express bcrypt jsonwebtoken cors
node server-auth.js
```

### Opción B: Mejoras Frontend (Temporal)

#### 1. Obfuscación Básica
```javascript
// En lugar de credenciales claras
const validUsers = {
    'admin': btoa('admin123'), // Base64 encoding
    'staff': btoa('staff123'),
    'user': btoa('user123')
};
```

#### 2. Validación Adicional
```javascript
// Verificar origen de la página
if (window.location.hostname !== 'localhost' && window.location.hostname !== 'tu-dominio.com') {
    // Bloquear acceso
}
```

#### 3. Rate Limiting Básico
```javascript
// Limitar intentos de login
const loginAttempts = JSON.parse(localStorage.getItem('loginAttempts') || '{}');
const maxAttempts = 3;
const lockoutTime = 5 * 60 * 1000; // 5 minutos
```

## Recomendaciones de Seguridad

### Para Producción:

1. **Servidor de Autenticación**
   - Usar Node.js con Express
   - Implementar JWT
   - Hash de contraseñas con bcrypt
   - Base de datos para usuarios

2. **HTTPS Obligatorio**
   - Certificado SSL
   - Redirección automática HTTP → HTTPS

3. **Variables de Entorno**
   ```bash
   JWT_SECRET=tu-secreto-super-seguro
   N8N_WEBHOOK_URL=https://tu-webhook.n8n.cloud/webhook/cedula
   DB_CONNECTION=postgresql://...
   ```

4. **Validación de Entrada**
   - Sanitización de datos
   - Validación de formato
   - Rate limiting

5. **Logs de Seguridad**
   - Intentos de login fallidos
   - Accesos no autorizados
   - Cambios de datos

### Para Desarrollo:

1. **Usar Servidor Local**
   - Autenticación real
   - Validación de tokens
   - Webhook protegido

2. **Credenciales de Prueba**
   - Usuarios temporales
   - Contraseñas seguras
   - Rotación periódica

## Implementación Gradual

### Fase 1: Servidor Básico
- [x] Crear servidor de autenticación
- [ ] Configurar variables de entorno
- [ ] Implementar JWT
- [ ] Conectar con frontend

### Fase 2: Seguridad Avanzada
- [ ] Base de datos de usuarios
- [ ] Rate limiting
- [ ] Logs de auditoría
- [ ] Validación de entrada

### Fase 3: Producción
- [ ] HTTPS
- [ ] Certificados SSL
- [ ] Monitoreo de seguridad
- [ ] Backup y recuperación

## Código Frontend Actualizado

### Autenticación con Servidor:
```javascript
// Reemplazar validación local por llamada al servidor
async function validateCredentials(username, password) {
    try {
        const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Error de autenticación:', error);
        return false;
    }
}
```

### Envío de Cédula Seguro:
```javascript
async function sendToWebhook(cedula) {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('http://localhost:3001/api/cedula', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ cedula })
        });
        
        return await response.json();
    } catch (error) {
        throw error;
    }
}
```

## Próximos Pasos

1. **Implementar servidor de autenticación**
2. **Actualizar frontend para usar API**
3. **Configurar variables de entorno**
4. **Probar flujo completo**
5. **Implementar HTTPS en producción**

