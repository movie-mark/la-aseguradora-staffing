# 📋 Configuración de Respuestas en n8n

## Respuestas del Webhook

### ✅ Respuesta de Éxito (Póliza Cancelada)

**Configuración en n8n:**
- **Response Code:** 200
- **Response Body:**

```json
{
  "success": true,
  "message": "Póliza Cancelada con Éxito<br><br>Se actualizó la póliza asociada al documento<br><b>{{ $('On form submission').first().json['Cédula'] ?? $json.cedula ?? '-' }}</b><br>con el estado <b>\"Cancelado por Staffing\"</b>.<br><br><b>Fecha de actualización:</b> {{ new Date().toISOString().replace('T',' ').slice(0,19) }} UTC<br><br><br><small>La Aseguradora · InsuraTech</small>"
}
```

**Versión simplificada (si no tienes acceso a datos del formulario):**
```json
{
  "success": true,
  "message": "Póliza Cancelada con Éxito<br><br>Se actualizó la póliza asociada al documento<br><b>{{ $json.cedula }}</b><br>con el estado <b>\"Cancelado por Staffing\"</b>.<br><br><b>Fecha de actualización:</b> {{ new Date().toISOString().replace('T',' ').slice(0,19) }} UTC<br><br><br><small>La Aseguradora · InsuraTech</small>"
}
```

### ❌ Respuesta de Error (Documento no encontrado)

**Configuración en n8n:**
- **Response Code:** 404 (o 400)
- **Response Body:**

```json
{
  "success": false,
  "message": "Documento no encontrado<br><br>El número de documento <b>{{ $json.cedula }}</b><br>no está registrado en nuestra base de datos.<br><br><br><b>Sugerencias:</b><br><br>• Verifica que el número esté completo y sin puntos ni guiones.<br><br>• Intenta nuevamente o usa otro documento del titular.<br><br>• Si el problema persiste, contáctanos para ayudarte.<br><br><br><small>La Aseguradora · InsuraTech</small>"
}
```

## Configuración del Workflow en n8n

### Estructura Recomendada:

1. **Webhook** - Recibe la cédula
2. **Set** - Extrae y valida datos
3. **IF** - Valida si la cédula existe
4. **HTTP Request** - Consulta base de datos
5. **IF** - Evalúa resultado de la consulta
6. **Webhook Response** - Devuelve respuesta

### Ejemplo de Nodo IF para Validación:

```javascript
// Validar si la cédula existe en la base de datos
const cedula = $input.first().json.cedula;
const existeEnBD = $input.first().json.existe_en_bd; // Resultado de tu consulta

if (existeEnBD === true) {
  return {
    success: true,
    message: `Póliza Cancelada con Éxito<br><br>Se actualizó la póliza asociada al documento<br><b>${cedula}</b><br>con el estado <b>"Cancelado por Staffing"</b>.<br><br><b>Fecha de actualización:</b> ${new Date().toISOString().replace('T',' ').slice(0,19)} UTC<br><br><br><small>La Aseguradora · InsuraTech</small>`
  };
} else {
  return {
    success: false,
    message: `Documento no encontrado<br><br>El número de documento <b>${cedula}</b><br>no está registrado en nuestra base de datos.<br><br><br><b>Sugerencias:</b><br><br>• Verifica que el número esté completo y sin puntos ni guiones.<br><br>• Intenta nuevamente o usa otro documento del titular.<br><br>• Si el problema persiste, contáctanos para ayudarte.<br><br><br><small>La Aseguradora · InsuraTech</small>`
  };
}
```

## Configuración del Nodo Webhook Response

### Para Éxito:
- **Response Code:** 200
- **Response Body:** `{{ $json }}`

### Para Error:
- **Response Code:** 404
- **Response Body:** `{{ $json }}`

## Testing de las Respuestas

### 1. Prueba de Éxito
```bash
curl -X POST "https://strategic-masterminds.app.n8n.cloud/webhook-test/3f4ff2a4-23e8-434d-82d6-4a50ac58a7ec" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "cedula_consultation",
    "timestamp": "2024-01-01T12:00:00.000Z",
    "username": "admin",
    "cedula": "1234567890",
    "session_id": "test_success"
  }'
```

### 2. Prueba de Error
```bash
curl -X POST "https://strategic-masterminds.app.n8n.cloud/webhook-test/3f4ff2a4-23e8-434d-82d6-4a50ac58a7ec" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "cedula_consultation",
    "timestamp": "2024-01-01T12:00:00.000Z",
    "username": "admin",
    "cedula": "9999999999",
    "session_id": "test_error"
  }'
```

## Variables Disponibles en n8n

### Datos del Webhook:
- `{{ $json.cedula }}` - Número de cédula
- `{{ $json.username }}` - Usuario que envió la consulta
- `{{ $json.timestamp }}` - Fecha y hora del envío
- `{{ $json.session_id }}` - ID de la sesión
- `{{ $json.event }}` - Tipo de evento

### Funciones Útiles:
- `{{ new Date().toISOString() }}` - Fecha actual
- `{{ new Date().toISOString().replace('T',' ').slice(0,19) }}` - Fecha formateada
- `{{ $now }}` - Timestamp actual de n8n

## Personalización de Mensajes

### Cambiar Fecha:
```javascript
// Formato personalizado de fecha
const fecha = new Date().toLocaleString('es-CO', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});
```

### Cambiar Nombre de la Empresa:
```javascript
// Reemplazar en todos los mensajes
const empresa = "Tu Empresa · Tu Marca";
```

## Troubleshooting

### Problemas Comunes:

1. **HTML no se renderiza**
   - Verificar que el frontend use `innerHTML` en lugar de `textContent`
   - Comprobar que los tags HTML estén correctos

2. **Variables no se reemplazan**
   - Verificar sintaxis de n8n: `{{ $json.variable }}`
   - Comprobar que la variable exista en el contexto

3. **Respuesta no llega al frontend**
   - Verificar que el webhook devuelva JSON válido
   - Comprobar códigos de estado HTTP

4. **Mensaje se corta**
   - Verificar que no haya caracteres especiales
   - Comprobar límites de longitud en n8n

