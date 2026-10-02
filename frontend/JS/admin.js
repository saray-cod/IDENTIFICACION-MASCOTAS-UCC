const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');
const API_BASE_URL = localStorage.getItem('api_base_url') || `http://${window.location.hostname || 'localhost'}:3000`;

const userRol = user && user.rol ? user.rol.toUpperCase() : '';

if (!user || !['COORDINADOR', 'ADMINISTRADOR', 'AUXILIAR'].includes(userRol)) {
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    
    const btnCrearUsuario = document.getElementById('btn-crear-usuario');
    if (btnCrearUsuario) {
        btnCrearUsuario.style.display = (userRol === 'ADMINISTRADOR') ? 'block' : 'none';
    }

    loadApplications();
});

function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none');
    
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.style.display = 'block';
    }
}

async function crearUsuario() {
    if (userRol !== 'ADMINISTRADOR') {
        alert('Solo administradores pueden crear usuarios');
        return;
    }  

    const nombre = document.getElementById('crear-nombre').value;
    const documento = document.getElementById('crear-documento').value;
    const correo = document.getElementById('crear-correo').value;
    const password = document.getElementById('crear-password').value;
    const rol = document.getElementById('crear-rol').value;

    if (!nombre || !documento || !correo || !password || !rol) {
        alert('Todos los campos son obligatorios');
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/api/admin/crear-usuario`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nombre, documento, correo, password, rol })
        });

        const data = await res.json();

        if (res.ok) {
            alert('Usuario creado exitosamente');
            document.getElementById('crear-form').reset();
        } else {
            alert(data.message || 'Error al crear usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

async function loadApplications() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/admin/solicitudes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
            throw new Error(`Error en el servidor: ${res.status}`);
        }

        const request = await res.json();
        const container = document.getElementById('applications-list');

        if (!container) return;

        if (!Array.isArray(request) || request.length === 0) {
            container.innerHTML = '<p>No hay solicitudes pendientes en este momento.</p>';
            return;
        }

        container.innerHTML = request.map(req => {
            const solicitudId = req.solicitud_id || req.id;
            
            // Permisos por rol
            const canWriteObservations = ['COORDINADOR', 'ADMINISTRADOR'].includes(userRol);
            const canApproveOrReject = ['COORDINADOR', 'ADMINISTRADOR'].includes(userRol);
            const isAdmin = userRol === 'ADMINISTRADOR';

            return `
                <div style="border-bottom: 2px solid #E5E7EB; padding: 1.5rem 0;">
                    <h4>${req.mascota_nombre || req.nombre} (${req.especie || 'Sin especie'} - ${req.raza || 'Sin raza'})</h4>
                    <p><strong>Estudiante:</strong> ${req.estudiante_nombre || req.nombre_usuario} | <strong>Carrera:</strong> ${req.carrera || 'N/A'}</p>

                    <p>
                        <strong>Documentos:</strong> 
                        <a href="${API_BASE_URL}${req.foto_url}" target="_blank">Foto</a> | 
                        <a href="${API_BASE_URL}${req.vacunacion_url}" target="_blank">Carnet Vacunación (PDF)</a> | 
                        <a href="${API_BASE_URL}${req.desparasitacion_url}" target="_blank">Desparasitación (PDF)</a>
                    </p>

                    ${canWriteObservations ? `
                        <div class="form-group" style="margin-top: 1rem;">
                            <label><small>Observaciones del Veterinario / Justificación:</small></label>
                            <input type="text" id="obs-${solicitudId}" placeholder="Escriba las observaciones clínicas o el motivo de rechazo...">
                        </div>
                    ` : '<p><em><small>Rol Auxiliar: Modo solo lectura de documentos y datos.</small></em></p>'}

                    <div style="display: flex; gap: 1rem; margin-top: 0.5rem; flex-wrap: wrap;">
                        ${canApproveOrReject ? `
                            <button onclick="updateStatus('${solicitudId}', 'APROBADO')" style="background-color: #16A34A; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Aprobar Solicitud</button>
                            <button onclick="updateStatus('${solicitudId}', 'RECHAZADO')" style="background-color: #DC2626; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Rechazar Solicitud</button>
                        ` : ''}

                        ${isAdmin ? `
                            <button onclick="toggleCarnetStatus('${solicitudId}')" style="background-color: #D97706; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Habilitar / Deshabilitar Carnet</button>
                            <button onclick="editPetInfo('${solicitudId}')" style="background-color: #4F46E5; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Editar Información</button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error al cargar solicitudes:', error);
    }
}

// Acción de Aprobar / Rechazar
async function updateStatus(solicitudId, estado) {
    const inputObs = document.getElementById(`obs-${solicitudId}`);
    const justificacion = inputObs ? inputObs.value : '';

    if (estado === 'RECHAZADO' && !justificacion.trim()) {
        alert('Por favor escriba el motivo del rechazo en las observaciones.');
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/api/admin/solicitudes/${solicitudId}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Token incluido
            },
            body: JSON.stringify({
                estado: estado,
                justificacion: justificacion,
                rol_usuario: userRol
            })
        });

        const data = await res.json();
        alert(data.message || 'Operación realizada con éxito');
        loadApplications();
    } catch (error) {
        console.error('Error al actualizar el estado:', error);
        alert('Error al conectar con el servidor');
    }
}


function toggleCarnetStatus(solicitudId) {
    alert(`Acción de Administrador: Habilitar/Deshabilitar carnet de la mascota ID ${solicitudId}`);
}


function editPetInfo(solicitudId) {
    alert(`Acción de Administrador: Editar información de la mascota ID ${solicitudId}`);
}

