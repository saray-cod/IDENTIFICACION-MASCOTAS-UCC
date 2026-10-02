
const hostname = window.location.hostname || 'localhost';
const API_BASE_URL = `http://${hostname}:3000`;
const API_URL = `${API_BASE_URL}/api/auth`;

console.log('Conectando a API en:', API_URL);

function toggleAuth(view) {
    const loginCard = document.getElementById('login-card');
    const registerCard = document.getElementById('register-card');

    if (!loginCard || !registerCard) return;

    if (view === 'register') {
        loginCard.style.display = 'none';
        registerCard.style.display = 'block';
    } else {
        loginCard.style.display = 'block';
        registerCard.style.display = 'none';
    }
}

const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const correo = document.getElementById('login-correo').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
                    correo, 
                    password,       
                    contrasena: password 
                })
            });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('api_base_url', API_BASE_URL);

            const userRol = ('data.user && data.user.rol') ? data.user.rol.toUpperCase() : '';

            if (['COORDINADOR', 'ADMINISTRADOR', 'AUXILIAR'].includes(userRol)) {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        } else {
            alert(data.message || 'Credenciales incorrectas');
        }  
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Error al conectar con el servidor' + API_BASE_URL);
    }
    });
}

const registerForm = document.getElementById('register-form');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const passwordValue = document.getElementById('reg-password').value;

    const formData = {
        nombre: document.getElementById('reg-nombre').value,
        correo: document.getElementById('reg-correo').value,
        password: passwordValue,
        contrasena: passwordValue,
        documento: document.getElementById('reg-documento') ? document.getElementById('reg-documento').value : '',
        carrera: document.getElementById('reg-carrera') ? document.getElementById('reg-carrera').value : ''
    };
    console.log('Datos enviados al servidor:', formData);

    try {
        const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await res.json();
        console.log('Respuesta :', res.status, data);

        if (res.ok) {
            alert('Registro exitoso. Ya puedes iniciar sesión');
            toggleAuth('login');
            registerForm.reset();
        } else {
            const mensajeError = data.message || 'Error al registrar el usuario';
            console.error('error del servidor:', mensajeError);
            alert(mensajeError);
        }
    } catch (error) {
        console.error('Error en el registro:', error);
        alert(`Error al conectar con el servidor (${API_BASE_URL}).`);
    }
    });
}  