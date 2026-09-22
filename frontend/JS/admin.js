// Validar que exista una sesión activa
const user = JSON.parse(localStorage.getItem('user'));
if (!user || !['COORDINADOR', 'ADMINISTRADOR', 'AUXILIAR'].includes(user.rol)) {
  window.location.href = 'index.html';
}

function logout() {
  localStorage.clear();
  window.location.href = 'index.html';
}

async function loadApplications() {
  try {
    const res = await fetch('http://localhost:3000/api/admin/solicitudes');
    const request = await res.json();
    const container = document.getElementById('applications-list');

    if (!Array.isArray(request) || request.length === 0) {
      container.innerHTML = '<p>No hay solicitudes pendientes en este momento.</p>';
      return;
    }

    container.innerHTML = request.map(req => {
      // 1. Permiso: Escribir observaciones clínicas (Coordinador y Administrador)
      const canWriteObservations = ['COORDINADOR', 'ADMINISTRADOR'].includes(user.rol);
      
      // 2. Permiso: Aprobar o Rechazar solicitudes (Coordinador y Administrador)
      const canApproveOrReject = ['COORDINADOR', 'ADMINISTRADOR'].includes(user.rol);
      
      // 3. Permiso: Acciones exclusivas del Administrador (Editar mascotas / Habilitar o Deshabilitar)
      const isAdmin = user.rol === 'ADMINISTRADOR';

      return `
        <div style="border-bottom: 2px solid #E5E7EB; padding: 1.5rem 0;">
          <h4>${req.mascota_nombre || req.nombre} (${req.especie} - ${req.raza})</h4>
          <p><strong>Estudiante:</strong> ${req.estudiante_nombre || req.nombre_usuario} | <strong>Carrera:</strong> ${req.carrera || 'N/A'}</p>

          <p>
            <strong>Documentos:</strong> 
            <a href="http://localhost:3000${req.foto_url}" target="_blank">Foto</a> | 
            <a href="http://localhost:3000${req.vacunacion_url}" target="_blank">Carnet Vacunación (PDF)</a> | 
            <a href="http://localhost:3000${req.desparasitacion_url}" target="_blank">Desparasitación (PDF)</a>
          </p>

          ${canWriteObservations ? `
            <div class="form-group" style="margin-top: 1rem;">
              <label><small>Observaciones del Veterinario / Justificación:</small></label>
              <input type="text" id="obs-${req.solicitud_id || req.id}" placeholder="Escriba las observaciones clínicas o el motivo de rechazo...">
            </div>
          ` : '<p><em><small>Rol Auxiliar: Modo solo lectura de documentos y datos.</small></em></p>'}

          <div style="display: flex; gap: 1rem; margin-top: 0.5rem; flex-wrap: wrap;">
            ${canApproveOrReject ? `
              <button onclick="review('${req.solicitud_id || req.id}', 'APROBADO')" style="background-color: #16A34A; width: auto;">Aprobar Solicitud</button>
              <button onclick="review('${req.solicitud_id || req.id}', 'RECHAZADO')" style="background-color: #DC2626; width: auto;">Rechazar Solicitud</button>
            ` : ''}

            ${isAdmin ? `
              <button onclick="toggleCarnetStatus('${req.solicitud_id || req.id}')" style="background-color: #D97706; width: auto;">Habilitar / Deshabilitar Carnet</button>
              <button onclick="editPetInfo('${req.solicitud_id || req.id}')" style="background-color: #4F46E5; width: auto;">Editar Información</button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Error al cargar solicitudes:', error);
  }
}

// Acción de Aprobar / Rechazar (Coordinador y Administrador)
async function updateStatus(solicitudId, estado) {
  const inputObs = document.getElementById(`Obs-${solicitudId}`);
  const justificacion = inputObs ? inputObs.value : '';

  if (estado === 'RECHAZADO' && !justificacion.trim()) {
    alert('Por favor escriba el motivo del rechazo en las observaciones.');
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/api/admin/solicitudes/${solicitudId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        estado: estado,
        justificacion: justificacion,
        rol_usuario: user.rol
      })
    });

    const data = await res.json();
    alert(data.message || 'Operación realizada con éxito');
    loadApplications();
  } catch (error) {
    console.error('Error al actualizar el estado:', error);
    alert('Error al conectar el servidor');
  }
}

// Acción Exclusiva del Administrador: Habilitar / Deshabilitar carnet
function toggleCarnetStatus(solicitudId) {
  alert(`Acción de Administrador: Habilitar/Deshabilitar carnet de la mascota ID ${solicitudId}`);
}

// Acción Exclusiva del Administrador: Editar información de mascotas
function editPetInfo(solicitudId) {
  alert(`Acción de Administrador: Editar información de la mascota ID ${solicitudId}`);
}

loadApplications();