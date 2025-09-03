# 🔗 Configuración del Webhook n8n - La Aseguradora

## Webhook Configurado

**URL del Webhook:**
```
https://strategic-masterminds.app.n8n.cloud/webhook/3f4ff2a4-23e8-434d-82d6-4a50ac58a7ec
```

## Payload Enviado

El sistema envía el siguiente JSON al webhook:

```json
{
  "event": "cedula_consultation",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "username": "admin",
  "cedula": "1234567890",
  "session_id": "session_1704110400000_abc123def"
}
```

## Configuración en n8n

### 1. Nodo Webhook
- **HTTP Method**: POST
- **Path**: `/webhook/3f4ff2a4-23e8-434d-82d6-4a50ac58a7ec`
- **Response Mode**: "On Received"
- **Response Code**: 200

### 2. Respuesta del Webhook
Configura la respuesta en el nodo Webhook:

```json
{
  "success": true,
  "message": "Cédula recibida correctamente",
  "timestamp": "{{ $now }}",
  "cedula": "{{ $json.cedula }}",
  "username": "{{ $json.username }}"
}
```

### 3. Procesamiento de Datos
En tu workflow de n8n, puedes acceder a los datos así:

- `{{ $json.cedula }}` - Número de cédula
- `{{ $json.username }}` - Usuario que envió la consulta
- `{{ $json.timestamp }}` - Fecha y hora del envío
- `{{ $json.session_id }}` - ID de la sesión
- `{{ $json.event }}` - Tipo de evento ("cedula_consultation")

## Testing del Webhook

### 1. Probar desde la Aplicación
1. **Abre:** `http://localhost:8000`
2. **Login:** admin/admin123
3. **Ingresa cédula:** 1234567890
4. **Envía:** Verifica en n8n que llegue el webhook

### 2. Probar con cURL
```bash
curl -X POST "https://strategic-masterminds.app.n8n.cloud/webhook/3f4ff2a4-23e8-434d-82d6-4a50ac58a7ec" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "cedula_consultation",
    "timestamp": "2024-01-01T12:00:00.000Z",
    "username": "admin",
    "cedula": "1234567890",
    "session_id": "session_test"
  }'
```

### 3. Verificar en n8n
- Ve a tu workflow en n8n
- Ejecuta el workflow manualmente
- Verifica que el webhook reciba los datos
- Revisa los logs de ejecución

## Estructura del Workflow Recomendada

### Nodos Sugeridos:
1. **Webhook** - Recibe la cédula
2. **Set** - Extrae y valida datos
3. **IF** - Valida formato de cédula
4. **HTTP Request** - Consulta base de datos/API
5. **Code** - Procesa respuesta
6. **Webhook Response** - Devuelve resultado

### Ejemplo de Nodo Set:
```javascript
// Extraer datos del webhook
const cedula = $input.first().json.cedula;
const username = $input.first().json.username;
const timestamp = $input.first().json.timestamp;

// Validar cédula
if (!/^[0-9]{7,10}$/.test(cedula)) {
  return {
    success: false,
    error: "Formato de cédula inválido",
    cedula: cedula
  };
}

return {
  success: true,
  cedula: cedula,
  username: username,
  timestamp: timestamp,
  message: "Cédula válida, procesando..."
};
```

## Manejo de Errores

### Respuestas de Error
```json
{
  "success": false,
  "error": "Descripción del error",
  "code": "ERROR_CODE",
  "cedula": "1234567890"
}
```

### Códigos de Error Sugeridos:
- `INVALID_FORMAT` - Formato de cédula inválido
- `NOT_FOUND` - Cédula no encontrada
- `PROCESSING_ERROR` - Error en el procesamiento
- `RATE_LIMIT` - Demasiadas consultas

## Logs y Monitoreo

### Datos a Registrar:
- Timestamp de cada consulta
- Usuario que realizó la consulta
- Cédula consultada (con hash para privacidad)
- Resultado de la consulta
- Tiempo de respuesta
- Errores encontrados

### Ejemplo de Log:
```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "username": "admin",
  "cedula_hash": "a1b2c3d4e5f6...",
  "result": "success",
  "response_time": 150,
  "error": null
}
```

## Próximos Pasos

1. **Configurar el webhook en n8n**
2. **Probar con datos reales**
3. **Implementar validaciones**
4. **Configurar respuestas de error**
5. **Añadir logs de auditoría**
6. **Optimizar rendimiento**

## Troubleshooting

### Problemas Comunes:

1. **Webhook no recibe datos**
   - Verificar URL del webhook
   - Revisar configuración CORS
   - Comprobar logs de n8n

2. **Error de CORS**
   - Configurar CORS en n8n
   - Verificar headers HTTP

3. **Timeout en la respuesta**
   - Optimizar workflow de n8n
   - Aumentar timeout en el frontend

4. **Datos no llegan completos**
   - Verificar formato del payload
   - Revisar mapeo de datos en n8n