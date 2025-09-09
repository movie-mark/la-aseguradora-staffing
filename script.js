// Configuración de usuarios válidos (TEMPORAL - Solo para desarrollo)
// ⚠️ ADVERTENCIA: Este es un sistema de demostración. NO usar en producción.
const validUsers = {
    'admin': 'admin123',
    'staff': 'staff123',
    'user': 'user123'
};

// Rate limiting básico
const loginAttempts = JSON.parse(localStorage.getItem('loginAttempts') || '{}');
const maxAttempts = 3;
const lockoutTime = 5 * 60 * 1000; // 5 minutos

// Elementos del DOM
const authContainer = document.getElementById('authContainer');
const formContainer = document.getElementById('formContainer');
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const logoutBtn = document.getElementById('logoutBtn');

// Verificar si el usuario ya está autenticado
document.addEventListener('DOMContentLoaded', function() {
    const isAuthenticated = localStorage.getItem('authenticated');
    const loginTime = localStorage.getItem('loginTime');
    
    if (isAuthenticated === 'true' && loginTime) {
        // Verificar si la sesión no ha expirado (24 horas)
        const sessionTimeout = 24 * 60 * 60 * 1000; // 24 horas
        const now = Date.now();
        
        if (now - parseInt(loginTime) < sessionTimeout) {
            showForm();
        } else {
            // Sesión expirada
            logout();
            showError('Sesión expirada. Por favor, inicia sesión nuevamente.');
        }
    }
});

// Manejar el envío del formulario de login
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Verificar rate limiting
    if (isAccountLocked(username)) {
        showError('Cuenta bloqueada temporalmente. Intenta en 5 minutos.');
        return;
    }
    
    // Validar credenciales
    if (validateCredentials(username, password)) {
        // Limpiar intentos fallidos
        clearLoginAttempts(username);
        
        // Guardar estado de autenticación
        localStorage.setItem('authenticated', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('loginTime', Date.now());
        
        // Mostrar formulario
        showForm();
        
        // Enviar datos de autenticación a n8n
        sendAuthDataToN8N(username);
    } else {
        // Registrar intento fallido
        recordFailedAttempt(username);
        showError('Usuario o contraseña incorrectos');
    }
});

// Función para validar credenciales
function validateCredentials(username, password) {
    return validUsers[username] === password;
}

// Funciones de rate limiting
function isAccountLocked(username) {
    const attempts = loginAttempts[username];
    if (!attempts) return false;
    
    const now = Date.now();
    const lastAttempt = attempts.lastAttempt || 0;
    
    // Si han pasado más de 5 minutos, desbloquear
    if (now - lastAttempt > lockoutTime) {
        delete loginAttempts[username];
        localStorage.setItem('loginAttempts', JSON.stringify(loginAttempts));
        return false;
    }
    
    // Si hay 3 o más intentos fallidos, bloquear
    return attempts.count >= maxAttempts;
}

function recordFailedAttempt(username) {
    if (!loginAttempts[username]) {
        loginAttempts[username] = { count: 0, lastAttempt: 0 };
    }
    
    loginAttempts[username].count++;
    loginAttempts[username].lastAttempt = Date.now();
    
    localStorage.setItem('loginAttempts', JSON.stringify(loginAttempts));
    
    // Mostrar advertencia si se acerca al límite
    if (loginAttempts[username].count >= maxAttempts - 1) {
        showError(`⚠️ Último intento. Después de ${maxAttempts} intentos fallidos, la cuenta se bloqueará por 5 minutos.`);
    }
}

function clearLoginAttempts(username) {
    delete loginAttempts[username];
    localStorage.setItem('loginAttempts', JSON.stringify(loginAttempts));
}

// Función para mostrar el formulario de cédula
function showForm() {
    authContainer.style.display = 'none';
    formContainer.style.display = 'block';
    
    // Configurar el formulario de cédula
    setupCedulaForm();
}

// Función para configurar el formulario de cédula
function setupCedulaForm() {
    const cedulaForm = document.getElementById('cedulaFormElement');
    const cedulaInput = document.getElementById('cedula');
    const submitBtn = document.getElementById('submitBtn');
    
    // Validación en tiempo real de la cédula
    cedulaInput.addEventListener('input', function(e) {
        // Solo permitir números
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        
        // Validar longitud
        if (e.target.value.length >= 7 && e.target.value.length <= 10) {
            e.target.style.borderColor = '#28a745';
        } else {
            e.target.style.borderColor = '#e1e5e9';
        }
    });
    
    // Manejar envío del formulario
    cedulaForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const cedula = cedulaInput.value.trim();
        
        // Validar cédula
        if (!validateCedula(cedula)) {
            showMessage('Por favor ingresa una cédula válida (7-10 dígitos)', 'error');
            return;
        }
        
        // Mostrar estado de carga
        setLoadingState(true);
        showMessage('Procesando cancelación...', 'info');
        
        try {
            // Enviar al webhook de n8n
            const result = await sendToWebhook(cedula);
            
            console.log('🎯 Resultado final del webhook:', result);
            
            // Verificar si tenemos un mensaje válido y mostrar según el tipo
            if (result.message && result.message.trim() !== '') {
                if (result.type === 'success') {
                    console.log('✅ Mostrando mensaje de éxito:', result.message);
                    showSuccessMessage(result.message);
                } else if (result.type === 'cancelled') {
                    console.log('⚠️ Mostrando mensaje de póliza cancelada:', result.message);
                    showCancelledMessage(result.message);
                } else {
                    console.log('❌ Mostrando mensaje de error:', result.message);
                    showErrorMessage(result.message);
                }
            } else {
                // Fallback si no hay mensaje
                if (result.type === 'success') {
                    showSuccessMessage('Póliza procesada correctamente');
                } else if (result.type === 'cancelled') {
                    showCancelledMessage('La póliza ya está cancelada');
                } else {
                    showErrorMessage('Error al procesar la cédula');
                }
            }
            
        } catch (error) {
            console.error('💥 Error en el proceso:', error);
            showMessage('❌ Error de conexión. Verifica tu internet e intenta nuevamente.', 'error');
        } finally {
            setLoadingState(false);
        }
    });
}

// Función para validar cédula
function validateCedula(cedula) {
    // Validar que sea solo números y tenga entre 7-10 dígitos
    const cedulaRegex = /^[0-9]{7,10}$/;
    return cedulaRegex.test(cedula);
}

// Función para enviar al webhook de n8n
async function sendToWebhook(cedula) {
    // URL del webhook de n8n
    const webhookUrl = 'https://strategic-masterminds.app.n8n.cloud/webhook/3f4ff2a4-23e8-434d-82d6-4a50ac58a7ec';
    
    const payload = {
        event: 'cedula_consultation',
        timestamp: new Date().toISOString(),
        username: localStorage.getItem('username'),
        cedula: cedula,
        session_id: localStorage.getItem('session_id') || generateSessionId()
    };
    
    console.log('📤 Enviando payload a n8n:', payload);
    
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        console.log('📥 Respuesta recibida:', response.status, response.statusText);
        
        // Intentar parsear la respuesta como JSON
        let responseData;
        try {
            responseData = await response.json();
            console.log('📋 Datos de respuesta:', responseData);
        } catch (parseError) {
            console.error('❌ Error parseando JSON:', parseError);
            const textResponse = await response.text();
            console.log('📄 Respuesta como texto:', textResponse);
            responseData = { message: textResponse };
        }
        
        // Determinar si es éxito o error basado en el status code
        const isSuccess = response.ok;
        
        // Debug: Log detallado de la respuesta
        console.log('🔍 Debug de respuesta:');
        console.log('  - Status:', response.status);
        console.log('  - OK:', response.ok);
        console.log('  - Response Data:', responseData);
        console.log('  - Message:', responseData.message);
        
        // Verificar el tipo de mensaje basado en el contenido
        const messageText = responseData.message || '';
        const isErrorMessage = messageText.toLowerCase().includes('no encontrado') || 
                              messageText.toLowerCase().includes('error') ||
                              messageText.toLowerCase().includes('no está registrado');
        
        const isCancelledMessage = messageText.toLowerCase().includes('ya cancelada') || 
                                  messageText.toLowerCase().includes('ya está cancelada') ||
                                  messageText.toLowerCase().includes('cancelada anteriormente') ||
                                  messageText.toLowerCase().includes('ya fue cancelada') ||
                                  messageText.toLowerCase().includes('previamente cancelada');
        
        console.log('  - Es mensaje de error:', isErrorMessage);
        console.log('  - Es mensaje de cancelada:', isCancelledMessage);
        
        // Determinar el tipo de resultado
        let resultType = 'success';
        if (isErrorMessage) {
            resultType = 'error';
        } else if (isCancelledMessage) {
            resultType = 'cancelled';
        }
        
        return {
            success: isSuccess && !isErrorMessage,
            cancelled: isCancelledMessage,
            type: resultType,
            message: responseData.message || (isSuccess ? 'Póliza procesada correctamente' : 'Error al procesar la cédula'),
            data: responseData,
            status: response.status
        };
        
    } catch (error) {
        console.error('❌ Error en fetch:', error);
        throw error;
    }
}

// Función para mostrar mensajes
function showMessage(message, type = 'info') {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.textContent = message;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.display = 'block';
    
    // Auto-ocultar mensajes de éxito después de 5 segundos
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Función para mostrar mensaje de éxito con HTML
function showSuccessMessage(htmlMessage) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 3rem; color: #28a745; margin-bottom: 15px;">✅</div>
            <div style="color: #155724; line-height: 1.6;">
                ${htmlMessage}
            </div>
            <div style="margin-top: 20px;">
                <button onclick="resetForm()" 
                        style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: 600;">
                    Nueva Consulta
                </button>
            </div>
        </div>
    `;
    messageDiv.className = 'form-message success';
    messageDiv.style.display = 'block';
}

// Función para mostrar mensaje de póliza cancelada con HTML
function showCancelledMessage(htmlMessage) {
    console.log('🟡 Mostrando mensaje de póliza cancelada:', htmlMessage);
    const messageDiv = document.getElementById('formMessage');
    messageDiv.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 3rem; color: #ffc107; margin-bottom: 15px;">⚠️</div>
            <div style="color: #856404; line-height: 1.6; font-weight: 500;">
                ${htmlMessage}
            </div>
            <div style="margin-top: 20px;">
                <button onclick="resetForm()" 
                        style="background: #ffc107; color: #212529; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: 600;">
                    Nueva Consulta
                </button>
            </div>
        </div>
    `;
    messageDiv.className = 'form-message cancelled';
    messageDiv.style.display = 'block';
    console.log('🟡 Clase aplicada:', messageDiv.className);
}

// Función para mostrar mensaje de error con HTML
function showErrorMessage(htmlMessage) {
    console.log('🔴 Mostrando mensaje de error:', htmlMessage);
    const messageDiv = document.getElementById('formMessage');
    messageDiv.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 3rem; color: #dc3545; margin-bottom: 15px;">❌</div>
            <div style="color: #721c24; line-height: 1.6;">
                ${htmlMessage}
            </div>
            <div style="margin-top: 20px;">
                <button onclick="resetForm()" 
                        style="background: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: 600;">
                    Intentar Nuevamente
                </button>
            </div>
        </div>
    `;
    messageDiv.className = 'form-message error';
    messageDiv.style.display = 'block';
    console.log('🔴 Clase aplicada:', messageDiv.className);
}

// Función para resetear el formulario
function resetForm() {
    const cedulaForm = document.getElementById('cedulaFormElement');
    const messageDiv = document.getElementById('formMessage');
    
    cedulaForm.reset();
    messageDiv.style.display = 'none';
    
    // Limpiar estilos de validación
    const cedulaInput = document.getElementById('cedula');
    cedulaInput.style.borderColor = '#e1e5e9';
}

// Función para manejar estado de carga
function setLoadingState(loading) {
    const submitBtn = document.getElementById('submitBtn');
    const cedulaInput = document.getElementById('cedula');
    
    if (loading) {
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        cedulaInput.disabled = true;
    } else {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        cedulaInput.disabled = false;
    }
}

// Función para mostrar mensajes de error
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    
    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

// Manejar logout
logoutBtn.addEventListener('click', function() {
    logout();
});

// Función de logout centralizada
function logout() {
    // Limpiar datos de autenticación
    localStorage.removeItem('authenticated');
    localStorage.removeItem('username');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('session_id');
    
    // Mostrar formulario de login
    authContainer.style.display = 'block';
    formContainer.style.display = 'none';
    
    // Limpiar formulario
    loginForm.reset();
    
    // Enviar evento de logout a n8n
    sendLogoutDataToN8N();
}

// Función para enviar datos de autenticación a n8n
function sendAuthDataToN8N(username) {
    const authData = {
        event: 'user_login',
        timestamp: new Date().toISOString(),
        username: username,
        session_id: generateSessionId(),
        status: 'success'
    };
    
    console.log('Auth data for n8n:', authData);
}

// Función para enviar datos de logout a n8n
function sendLogoutDataToN8N() {
    const logoutData = {
        event: 'user_logout',
        timestamp: new Date().toISOString(),
        username: localStorage.getItem('username') || 'unknown',
        status: 'success'
    };
    
    console.log('Logout data for n8n:', logoutData);
}

// Función para generar ID de sesión
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}