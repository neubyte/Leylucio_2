// --- Elementos del DOM ---
const dniInput = document.getElementById('dniInput');
const buscarBtn = document.getElementById('buscarBtn');
const resultadoDiv = document.getElementById('resultado');

// --- Base de datos en memoria ---
let usuarios = [];

// --- Funciones ---

/**
 * Carga los datos desde el archivo usuarios.csv y los guarda en la variable 'usuarios'
 */
async function cargarUsuarios() {
    try {
        const respuesta = await fetch('usuarios.csv');
        if (!respuesta.ok) {
            throw new Error('No se pudo encontrar el archivo usuarios.csv');
        }
        const datosCSV = await respuesta.text();
        
        usuarios = datosCSV
            .trim()
            .split('\n')
            .map(linea => {
                const [dni, usuario] = linea.split(',');
                if (dni && usuario) {
                    return { dni: dni.trim(), usuario: usuario.trim() };
                }
                return null;
            })
            .filter(user => user !== null);

    } catch (error) {
        console.error('Error al cargar los datos:', error);
        resultadoDiv.innerHTML = '<p class="error">Error: No se pudieron cargar los datos.</p>';
    }
}

/**
 * Busca el DNI introducido en la lista de usuarios cargada
 */
function buscar() {
    const dniBuscado = dniInput.value.trim().toUpperCase();
    
    if (!dniBuscado) {
        resultadoDiv.innerHTML = ''; // Limpia el resultado si no hay nada escrito
        return;
    }

    const usuarioEncontrado = usuarios.find(u => u.dni.toUpperCase() === dniBuscado);

    if (usuarioEncontrado) {
        // --- CAMBIO PRINCIPAL AQUÍ ---
        // Generamos el HTML con el usuario y la nueva leyenda
        resultadoDiv.innerHTML = `
            <p class="usuario-encontrado">Usuario: ${usuarioEncontrado.usuario}</p>
            <p class="mensaje-contrasena">
                La contraseña es <strong>Reflejar123*</strong> y se le pedirá crear una nueva al primer ingreso.
            </p>
        `;
    } else {
        resultadoDiv.innerHTML = '<p class="error">DNI no encontrado.</p>';
    }
}

// --- Eventos ---

// 1. Carga los datos CSV tan pronto como la página web se carga
document.addEventListener('DOMContentLoaded', cargarUsuarios);

// 2. Ejecuta la búsqueda al hacer clic en el botón
buscarBtn.addEventListener('click', buscar);

// 3. Permite buscar presionando la tecla "Enter" en el campo de texto
dniInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        buscar();
    }
});
