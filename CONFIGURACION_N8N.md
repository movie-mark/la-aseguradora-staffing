# 🔧 Configuración de n8n para Embeber Formularios

## Problema Identificado

El formulario n8n no se puede embeber en iframes debido a restricciones de seguridad por defecto. n8n establece la cabecera `X-Frame-Options: SAMEORIGIN` que impide la carga en iframes.

## Soluciones por Tipo de Instalación

### 🌐 n8n Cloud (Recomendado)

1. **Accede a tu dashboard de n8n Cloud**
   - Ve a [app.n8n.cloud](https://app.n8n.cloud)
   - Inicia sesión en tu cuenta

2. **Configura la Seguridad**
   - Selecciona tu instancia
   - Ve a **Settings** → **Security**
   - Busca la opción **"Prevent iframe embedding"**
   - **DESACTÍVALA** (uncheck)

3. **Verifica el Formulario**
   - Asegúrate de que tu formulario esté **publicado**
   - Verifica que la URL sea correcta
   - Prueba abrir la URL directamente en el navegador

### 🖥️ n8n Self-hosted

#### Opción A: Variable de Entorno
```bash
# Añade esta variable a tu configuración
N8N_DISABLE_UI_SECURITY=true
```

#### Opción B: Docker Compose
```yaml
services:
  n8n:
    image: n8nio/n8n
    environment:
      - N8N_DISABLE_UI_SECURITY=true
    ports:
      - "5678:5678"
```

#### Opción C: Docker Run
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -e N8N_DISABLE_UI_SECURITY=true \
  n8nio/n8n
```

### 🔧 n8n con Nginx (Proxy Inverso)

Si usas Nginx como proxy inverso, asegúrate de que no añada cabeceras restrictivas:

```nginx
location / {
    proxy_pass http://localhost:5678;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    
    # NO añadir estas líneas:
    # add_header X-Frame-Options DENY;
    # add_header X-Frame-Options SAMEORIGIN;
}
```

## Verificación de la Configuración

### 1. Verificar Cabeceras HTTP
```bash
curl -I "https://strategic-masterminds.app.n8n.cloud/form/4627dba9-38c7-49d4-b9a2-ff18ae79b1d8"
```

**Debería mostrar:**
- ❌ `X-Frame-Options: SAMEORIGIN` (problema)
- ✅ Sin `X-Frame-Options` o `X-Frame-Options: ALLOWALL` (correcto)

### 2. Probar en Navegador
- Abre la URL del formulario directamente
- Debería cargar sin errores 404
- Verifica que el formulario esté visible

### 3. Probar Iframe
```html
<iframe src="TU_URL_DEL_FORMULARIO" width="100%" height="600px"></iframe>
```

## Pasos Específicos para tu Caso

### Para n8n Cloud:
1. Ve a [app.n8n.cloud](https://app.n8n.cloud)
2. Selecciona tu instancia `strategic-masterminds`
3. Ve a **Settings** → **Security**
4. Desactiva **"Prevent iframe embedding"**
5. Guarda los cambios
6. Espera 1-2 minutos para que se apliquen

### Verificar URL del Formulario:
1. Ve a tu workflow en n8n
2. Selecciona el nodo del formulario
3. Verifica que esté **publicado**
4. Copia la URL correcta del formulario
5. Actualiza la URL en `script.js` línea 79

## Solución Temporal

Mientras configuras n8n, el sistema mostrará automáticamente un formulario de demostración funcional que:
- ✅ Recopila los mismos datos
- ✅ Genera JSON compatible con n8n
- ✅ Se puede integrar con webhooks
- ✅ Funciona inmediatamente

## Contacto de Soporte

Si necesitas ayuda con la configuración:
- **n8n Cloud Support**: [support.n8n.io](https://support.n8n.io)
- **n8n Community**: [community.n8n.io](https://community.n8n.io)
- **Documentación**: [docs.n8n.io](https://docs.n8n.io)

## Seguridad

⚠️ **Importante**: Al desactivar las restricciones de iframe, tu instancia n8n puede ser más vulnerable a ataques de clickjacking. Asegúrate de:

- Usar autenticación robusta
- Restringir el acceso por IP si es posible
- Monitorear el acceso a tu instancia
- Mantener n8n actualizado
