const user = JSON.parse(localStorage.getItem('user'));
if (!user) {
    window.location.href = 'index.html';
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

document.getElementById('pet-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new formData ();
    formData.appened('usuario_id', user.id);
    formData.appened('nombre'.getElementById('nombre').value);
    formData.appened('especie', document.getElementById('especie').value);
    formData.appened('raza', document.getElementById('raza').value);
    formData.appened('sexo', document.getElementById('sexo').value);
    formData.appened('edad', document.getElementById('edad').value);
    formData.appened('foto', document.getElementById('foto').files[0]);
    formData.appened('vacunacion', document.getElementById('vacunacion').files[0]);
    formData.appened('desparacitacion', document.getElementById('desparacitacion').files[0]);

    try {
        const res = await fetch('http://localhost:3000/api/pets/register', {
            method: 'POST',
            body: formData
        });

        const  data = await res.json();
        alert(data.message || 'solicitud enviada correctamente');

        if (res.ok) {
            document.getElementById('pet-form').reset();
            loadMyPets();
        }
    } catch(error) {
        console.error('Error al registrar la mascota : ', error);
        alert('error al conectar con el servidor');
    }
});   

async function loadMyPets() {
    try {
        const res = await fetch (`http://localhost:3000/api/pets/mis-mascotas/${user.id}`);
        const pets = await res.json();
        const container = document.getElementById('pets-list');

        if (!Array.isArray(pets) || pets.length === 0) {
            container.innerHTML = '<p>No tienes mascotas registradas aún</p>'
            return;
        }

        container.innerHTML = pets.map(pet => ` 
            <div style="border-bottom: 1px solid #E5E7EB; padding: 1rem 0; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="margin: 0 0 0.5rem 0;">${pet.nombre} (${pet.especie} - ${pet.raza})</h4>
                    <p style="margin: 0;">Estado: <span class="badge badge-${pet.estado}">${pet.estado}</span></p>
                    ${pet.justificacion ? `<p style="margin: 0.5rem 0 0 0; color: #DC2626;"><small><strong>Observación:</strong> ${pet.justificacion}</small></p>` : ''}
                </div>
                <div>
                    ${pet.estado === 'APROBADO' 
                        ? `<a href="http://localhost:3000/api/pets/${pet.id}/carnet" target="_blank">
                             <button style="width: auto;">Descargar Carnet PDF</button>
                           </a>` 
                        : `<button disabled style="background: #9CA3AF; width: auto; cursor: not-allowed;">Carnet no disponible</button>`}
                </div>
            </div>
        `).join('');
        }  catch (error) {
            console.error ('error al cargar mascotas', error);
        }
    }    

    loadMyPets(); 
        
        
    



