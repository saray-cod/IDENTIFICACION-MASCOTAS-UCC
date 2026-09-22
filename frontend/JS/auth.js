const API_URL = 'http://localhost:3000/api/auth';

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

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const correo = document.getElementById('login-correo').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('user', JSON.stringify(data.user));

            if (['COORDINADOR', 'ADMINISTRADOR', 'AUXILIAR'].includes(data.user.rol)) {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        } else {
            alert(data.message || 'Credenciales incorrectas');
        }  
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Error al conectar con el servidor');
    }
});

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        nombre: document.getElementById('reg-nombre').value,
        correo: document.getElementById('reg-correo').value,
        password: document.getElementById('reg-password').value,
        rol: document.getElementById('reg-rol').value
    };

    try {
        const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (res.ok) {
            alert('Registro exitoso. Ya puedes iniciar sesión');
            toggleAuth('login');
            document.getElementById('register-form').reset();
        } else {
            alert(data.message || 'Error al registrar usuario');
        }
    } catch (error) {
        console.error('Error en el registro:', error);
        alert('Error al conectar con el servidor');
    }
});