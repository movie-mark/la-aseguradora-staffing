# La Aseguradora - Sistema de Staffing

Sistema de autenticación con formulario de consulta de cédula que envía datos a webhook de n8n.

## Características

- ✅ Página de autenticación con usuario y contraseña
- ✅ Formulario de consulta de cédula después del login
- ✅ Validación en tiempo real de cédula
- ✅ Envío de payload JSON a webhook de n8n
- ✅ Diseño moderno y responsive
- ✅ Manejo de sesiones con localStorage
- ✅ Estados de carga y mensajes informativos

## Usuarios de Prueba

El sistema incluye los siguientes usuarios para testing:

| Usuario | Contraseña |
|---------|------------|
| admin   | admin123   |
| staff   | staff123   |
| user    | user123    |

## Instalación y Uso

1. **Abrir la aplicación**: Simplemente abre el archivo `index.html` en tu navegador web.

2. **Autenticación**: Usa cualquiera de los usuarios de prueba para acceder al sistema.

3. **Formulario de Cédula**: Una vez autenticado, se mostrará el formulario para ingresar la cédula.

## Configuración para n8n

### Webhook de Cédula

El sistema envía la cédula ingresada a un webhook de n8n para procesamiento.

### Payload JSON Enviado

```json
{
  "event": "cedula_consultation",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "username": "admin",
  "cedula": "1234567890",
  "session_id": "session_1704110400000_abc123def"
}
```

### Configuración del Webhook

✅ **Webhook ya configurado:**
```javascript
const webhookUrl = 'https://strategic-masterminds.app.n8n.cloud/webhook/3f4ff2a4-23e8-434d-82d6-4a50ac58a7ec';
```

**Para configurar en n8n:**
1. **Crea un nodo Webhook** en tu workflow
2. **Configura:**
   - HTTP Method: POST
   - Path: `/webhook/3f4ff2a4-23e8-434d-82d6-4a50ac58a7ec`
   - Response Mode: "On Received"

### Estructura del Webhook en n8n

El webhook recibirá:
- `event`: Tipo de evento ("cedula_consultation")
- `timestamp`: Fecha y hora del envío
- `username`: Usuario autenticado
- `cedula`: Número de cédula ingresado
- `session_id`: ID único de la sesión

### Respuestas del Webhook

#### ✅ Respuesta de Éxito (HTTP 200):
```json
{
  "success": true,
  "message": "Póliza Cancelada con Éxito<br><br>Se actualizó la póliza asociada al documento<br><b>{{ $json.cedula }}</b><br>con el estado <b>\"Cancelado por Staffing\"</b>.<br><br><b>Fecha de actualización:</b> {{ new Date().toISOString().replace('T',' ').slice(0,19) }} UTC<br><br><br><small>La Aseguradora · InsuraTech</small>"
}
```

#### ❌ Respuesta de Error (HTTP 404):
```json
{
  "success": false,
  "message": "Documento no encontrado<br><br>El número de documento <b>{{ $json.cedula }}</b><br>no está registrado en nuestra base de datos.<br><br><br><b>Sugerencias:</b><br><br>• Verifica que el número esté completo y sin puntos ni guiones.<br><br>• Intenta nuevamente o usa otro documento del titular.<br><br>• Si el problema persiste, contáctanos para ayudarte.<br><br><br><small>La Aseguradora · InsuraTech</small>"
}
```

## Estructura de Archivos

```
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica JavaScript
└── README.md           # Este archivo
```

## Personalización

### Cambiar Usuarios

Edita el objeto `validUsers` en `script.js`:

```javascript
const validUsers = {
    'tu_usuario': 'tu_contraseña',
    'otro_usuario': 'otra_contraseña'
};
```

### Personalizar Estilos

Edita `styles.css` para cambiar colores, fuentes y diseño según tus necesidades.

## Seguridad

⚠️ **Importante**: Este es un sistema de demostración. Para producción:

1. Implementa autenticación en el servidor
2. Usa HTTPS
3. Valida y sanitiza todas las entradas
4. Implementa rate limiting
5. Usa tokens JWT o sesiones seguras

## Soporte

Para soporte técnico o preguntas sobre la integración con n8n, contacta al equipo de desarrollo.