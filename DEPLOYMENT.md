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

## 🌐 URL de Despliegue

Una vez desplegado, tu aplicación estará disponible en:
```
https://movie-mark.github.io/la-aseguradora-staffing
```

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

---

**¡Tu aplicación de La Aseguradora está lista para ser desplegada! 🎉**