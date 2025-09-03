// Script para verificar la configuración de n8n
// Ejecuta este script en la consola del navegador

console.log('🔧 Verificador de Configuración n8n');
console.log('=====================================');

const formUrl = 'https://strategic-masterminds.app.n8n.cloud/form/4627dba9-38c7-49d4-b9a2-ff18ae79b1d8';

async function verificarConfiguracion() {
    console.log('\n1️⃣ Verificando URL del formulario...');
    
    try {
        // Probar acceso a la URL
        const response = await fetch(formUrl, { mode: 'no-cors' });
        console.log('✅ URL accesible');
    } catch (error) {
        console.log('❌ Error al acceder a la URL:', error.message);
    }
    
    console.log('\n2️⃣ Verificando cabeceras HTTP...');
    
    try {
        const response = await fetch(formUrl, { method: 'HEAD' });
        const headers = response.headers;
        
        console.log('📋 Cabeceras encontradas:');
        for (let [key, value] of headers.entries()) {
            console.log(`  ${key}: ${value}`);
        }
        
        const frameOptions = headers.get('X-Frame-Options');
        if (frameOptions) {
            console.log(`❌ PROBLEMA: X-Frame-Options = ${frameOptions}`);
            console.log('   Esto impide el embebido en iframes');
            console.log('   SOLUCIÓN: Desactiva "Prevent iframe embedding" en n8n Cloud');
        } else {
            console.log('✅ OK: No se encontró X-Frame-Options');
        }
        
        const csp = headers.get('Content-Security-Policy');
        if (csp && csp.includes('frame-ancestors')) {
            console.log(`⚠️  ADVERTENCIA: CSP frame-ancestors encontrado`);
            console.log(`   ${csp}`);
        }
        
    } catch (error) {
        console.log('❌ Error al verificar cabeceras:', error.message);
    }
    
    console.log('\n3️⃣ Probando iframe...');
    
    // Crear iframe de prueba
    const testIframe = document.createElement('iframe');
    testIframe.src = formUrl;
    testIframe.style.width = '100%';
    testIframe.style.height = '400px';
    testIframe.style.border = '2px solid #ddd';
    
    const timeout = setTimeout(() => {
        console.log('⏰ Timeout: iframe no se cargó en 10 segundos');
        console.log('   Esto indica que hay restricciones de iframe');
    }, 10000);
    
    testIframe.onload = function() {
        clearTimeout(timeout);
        console.log('✅ Iframe cargado correctamente');
        console.log('   El formulario se puede embeber');
    };
    
    testIframe.onerror = function() {
        clearTimeout(timeout);
        console.log('❌ Error al cargar iframe');
        console.log('   Hay restricciones que impiden el embebido');
    };
    
    // Añadir iframe al DOM temporalmente
    document.body.appendChild(testIframe);
    
    setTimeout(() => {
        document.body.removeChild(testIframe);
    }, 15000);
    
    console.log('\n📋 RESUMEN DE CONFIGURACIÓN:');
    console.log('============================');
    console.log('Si ves errores arriba, necesitas:');
    console.log('1. Ir a app.n8n.cloud');
    console.log('2. Seleccionar tu instancia');
    console.log('3. Settings → Security');
    console.log('4. Desactivar "Prevent iframe embedding"');
    console.log('5. Guardar y esperar 1-2 minutos');
    console.log('6. Probar nuevamente');
}

// Ejecutar verificación
verificarConfiguracion();
