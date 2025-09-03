# Guía de Despliegue - La Aseguradora Staffing

Esta guía te ayudará a desplegar el sistema de La Aseguradora en GitHub Pages.

## 🚀 Despliegue Automático con GitHub Actions

El proyecto incluye un workflow de GitHub Actions que se ejecuta automáticamente cuando haces push a la rama `main`.

### Configuración Inicial

1. **Habilita GitHub Pages en tu repositorio:**
   - Ve a `Settings` > `Pages`
   - En `Source`, selecciona `GitHub Actions`

2. **El workflow ya está configurado** en `.github/workflows/deploy.yml`

### Archivos que se Desplegarán

✅ **Archivos incluidos en el despliegue:**
- `index.html` - Página principal
- `styles.css` - Estilos CSS
- `script.js` - Lógica JavaScript
- `logo.png` - Logo de La Aseguradora

❌ **Archivos excluidos del despliegue:**
- Archivos de documentación (`.md`)
- Archivos de configuración (`package.json`, `server-auth.js`)
- Archivos de prueba (`test-*.html`, `debug-*.html`)
- Archivos de desarrollo (`verificar-n8n.js`)

## 🔧 Configuración Manual (Alternativa)

Si prefieres desplegar manualmente:

1. **Crea una rama `gh-pages`:**
   ```bash
   git checkout -b gh-pages
   ```

2. **Copia los archivos necesarios:**
   ```bash
   cp index.html styles.css script.js logo.png ./
   ```

3. **Habilita GitHub Pages:**
   - Ve a `Settings` > `Pages`
   - En `Source`, selecciona `Deploy from a branch`
   - Selecciona la rama `gh-pages`

## 🌐 URL de Despliegue

Una vez desplegado, tu aplicación estará disponible en:
```
https://[tu-usuario].github.io/[nombre-del-repositorio]
```

## 🔒 Configuración de Seguridad

### Variables de Entorno (Recomendado)

Para mayor seguridad, considera usar variables de entorno para:

1. **URLs de Webhooks:**
   ```javascript
   const webhookUrl = process.env.N8N_WEBHOOK_URL || 'https://strategic-masterminds.app.n8n.cloud/webhook/3f4ff2a4-23e8-434d-82d6-4a50ac58a7ec';
   ```

2. **Usuarios de Prueba:**
   ```javascript
   const validUsers = JSON.parse(process.env.VALID_USERS || '{"admin":"admin123","staff":"staff123","user":"user123"}');
   ```

### Configurar Variables en GitHub

1. Ve a `Settings` > `Secrets and variables` > `Actions`
2. Agrega las variables necesarias:
   - `N8N_WEBHOOK_URL`
   - `VALID_USERS`

## 📊 Monitoreo del Despliegue

### Verificar el Estado

1. **GitHub Actions:**
   - Ve a la pestaña `Actions` en tu repositorio
   - Verifica que el workflow `Deploy to GitHub Pages` se ejecute correctamente

2. **GitHub Pages:**
   - Ve a `Settings` > `Pages`
   - Verifica que el despliegue esté activo

### Logs de Despliegue

Si hay problemas, revisa los logs en:
- `Actions` > `Deploy to GitHub Pages` > `deploy` job

## 🔄 Actualizaciones

Para actualizar la aplicación:

1. **Haz cambios en tu código local**
2. **Commit y push a la rama main:**
   ```bash
   git add .
   git commit -m "Actualización de la aplicación"
   git push origin main
   ```
3. **El despliegue se ejecutará automáticamente**

## 🐛 Solución de Problemas

### Error: "Page build failed"

**Causa común:** Archivos de Node.js en el directorio raíz

**Solución:**
- Verifica que `package.json` esté en `.gitignore`
- O configura el workflow para excluir archivos de Node.js

### Error: "404 Not Found"

**Causa común:** Archivo `index.html` no encontrado

**Solución:**
- Verifica que `index.html` esté en la raíz del repositorio
- Asegúrate de que el workflow incluya `index.html`

### Error: "CORS policy"

**Causa común:** Problemas de CORS con el webhook de n8n

**Solución:**
- Verifica que la URL del webhook sea correcta
- Considera usar un proxy o configurar CORS en n8n

## 📱 Pruebas Post-Despliegue

Después del despliegue, verifica:

1. **✅ La página carga correctamente**
2. **✅ El login funciona con los usuarios de prueba**
3. **✅ El formulario de cédula se muestra**
4. **✅ La conexión con n8n funciona**
5. **✅ Los mensajes de éxito/error se muestran correctamente**

## 🔐 Consideraciones de Seguridad

⚠️ **Importante para Producción:**

1. **No uses usuarios hardcodeados** en producción
2. **Implementa autenticación real** con base de datos
3. **Usa HTTPS** (GitHub Pages lo proporciona automáticamente)
4. **Valida todas las entradas** del usuario
5. **Implementa rate limiting** en el servidor

## 📞 Soporte

Si tienes problemas con el despliegue:

1. Revisa los logs de GitHub Actions
2. Verifica la configuración de GitHub Pages
3. Consulta la documentación de GitHub Pages
4. Contacta al equipo de desarrollo

---

**¡Tu aplicación de La Aseguradora está lista para ser desplegada! 🎉**
