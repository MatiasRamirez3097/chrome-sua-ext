// content.js
console.log("¡Extensión de validación de formulario cargada y lista para la acción!");

// --- SELECTOR DEL DIV QUE YA EXISTE Y CUYO CONTENIDO SE CARGA DINÁMICAMENTE ---
const divDatosExtrasExistente = document.querySelector('#datosExtras');

let formularioConfigurado = false; // Bandera para asegurar que la configuración se hace solo una vez

// --- VARIABLES GLOBALES PARA LOS CAMPOS DEL FORMULARIO ---
let camposPreguntas = []; // Array para almacenar los campos de preguntas[NRO].texto o preguntas[NRO].idValorSelec

// Otras variables que podrías necesitar
let botonEnviar;
let formularioPrincipal;


// --- FUNCIONES DE CONTROL DE ESTADO DE CAMPOS ---

function habilitarCampo(element) {
    if (element) {
        element.removeAttribute('disabled');
        element.style.backgroundColor = '';
        element.closest("tr").style.display = 'table-row';
    }
}

function deshabilitarCampo(element) {
  if (element) {
    element.setAttribute('disabled', 'true');
    element.value = ''; // Limpiar el valor (para inputs) o resetear selección (para selects)
    element.style.backgroundColor = '#e9e9e9';
    element.closest("tr").style.display = 'none';
  }
}

// --- FUNCIÓN AUXILIAR: DETERMINA SI UN CAMPO ESTÁ COMPLETO/VÁLIDO ---
// ¡MOVIDA AL ÁMBITO GLOBAL PARA SER ACCESIBLE DESDE CUALQUIER LUGAR!
const isFieldComplete = (campo) => {
    if (!campo) return false;
    if (campo.disabled) return true; // Si está deshabilitado, lo consideramos "completo" para la lógica de avance/botón

    // La lógica de validación campo.value.trim() !== '' sigue funcionando para ambos tipos
    // siempre que tu <option value="">...</option> inicial esté vacío para los selects.
    return campo.value.trim() !== '';
};


// --- FUNCIÓN DE VALIDACIÓN (Ajustada para input y select) ---

function validarFormularioCompleto() {
    if (!formularioConfigurado) {
        console.warn("Intentando validar antes de que el formulario dinámico esté configurado.");
        return false;
    }

    let esValido = true;

    // Validación: Recorrer todos los campos 'preguntas[NRO]' y asegurar que tienen un valor válido.
    camposPreguntas.forEach((campo, index) => {
        // Solo validamos campos habilitados y que existen
        if (campo && !campo.disabled) {
            if (!isFieldComplete(campo)) { // Usamos la función auxiliar aquí también
                alert(`La pregunta #${index + 1} (en el formulario) no puede estar vacía. Por favor, selecciona una opción o ingresa un texto.`);
                campo.focus();
                esValido = false;
            }
        }
    });

    if (esValido) {
        console.log("Formulario validado correctamente. ¡Listo para enviar!");
    } else {
        console.log("La validación del formulario falló.");
    }

    return esValido;
}


// --- LÓGICA PARA HABILITAR/DESHABILITAR SEGÚN AVANZA EL USUARIO ---

function actualizarEstadoBotonEnviar() {
    if (!formularioConfigurado) return;

    // Ahora isFieldComplete ya está definida globalmente
    const todasPreguntasCompletas = camposPreguntas.every(isFieldComplete);

    if (todasPreguntasCompletas) {
        habilitarCampo(botonEnviar);
    } else {
        deshabilitarCampo(botonEnviar);
    }
}

// --- FUNCIÓN CENTRAL DE CONFIGURACIÓN DEL FORMULARIO DINÁMICO ---
function configurarFormularioDinamico() {
    if (formularioConfigurado) return;

    camposPreguntas = []; // Reiniciar el array de campos

    // --- RECOPILACIÓN Y DESHABILITACIÓN INICIAL DE LOS CAMPOS 'preguntas[NRO]' ---
    for (let i = 1; i <= 28; i++) { // El bucle ahora va del 1 al 28
        let campoEncontrado = null;
        let selectorCampo = '';

        // Probamos con el nombre '.texto'
        selectorCampo = `[name="preguntas[${i}].texto"]`;
        campoEncontrado = divDatosExtrasExistente.querySelector(selectorCampo);

        if (!campoEncontrado) {
            // Si no se encuentra con '.texto', probamos con '.idValorSelec'
            selectorCampo = `[name="preguntas[${i}].idValorSelec"]`;
            campoEncontrado = divDatosExtrasExistente.querySelector(selectorCampo);
        }

        if (campoEncontrado) {
            camposPreguntas.push(campoEncontrado);
            deshabilitarCampo(campoEncontrado); // Deshabilitar el campo al agregarlo al array
        } else {
            // No se encontró el campo para este NRO, lo cual es esperado.
            // Puedes ajustar el nivel de log si no quieres ver tantos warnings.
            // console.warn(`Campo 'preguntas[${i}]' (ni .texto ni .idValorSelec) no encontrado.`);
        }
    }

    if (camposPreguntas.length === 0) {
        console.warn("No se encontró ningún campo con el patrón 'preguntas[NRO]' (ni .texto ni .idValorSelec). Revisa el rango o los selectores.");
        return;
    } else {
        console.log(`¡Se encontraron ${camposPreguntas.length} campos de preguntas (input/select) de la secuencia 1-28 y se deshabilitaron inicialmente!`);
        console.log(camposPreguntas);
    }

    // --- ASIGNACIÓN DE OTROS CAMPOS Y FORMULARIO PRINCIPAL ---
    botonEnviar = document.querySelector('[onclick="javacript:guardarSolicitud(false);"]'); // O un selector de tu botón
    formularioPrincipal = document.querySelector('form'); // El formulario padre general

    if (!botonEnviar || !formularioPrincipal) {
        console.warn("Advertencia: No se encontró el botón de envío o el formulario principal. La validación de envío podría verse afectada.");
    }

    console.log("¡Contenido del formulario dinámico detectado y campos asignados!");
    formularioConfigurado = true;

    // --- INICIALIZAR EL ESTADO DEL BOTÓN DE ENVÍO ---
    actualizarEstadoBotonEnviar();


    // --- ADJUNTAR LISTENERS PARA HABILITAR EL SIGUIENTE CAMPO ---
    // Habilitar el primer campo de la lista al inicio (si hay alguno)
    if (camposPreguntas.length > 0) {
        habilitarCampo(camposPreguntas[0]);

        // Añadir listeners a cada campo para habilitar el siguiente
        for (let i = 0; i < camposPreguntas.length - 1; i++) { // Iteramos hasta el penúltimo campo del array recopilado
            const campoActual = camposPreguntas[i];
            const campoSiguiente = camposPreguntas[i + 1];

            if (campoActual && campoSiguiente) {
                campoActual.addEventListener('change', (event) => { // Usamos 'change' para que funcione en ambos
                    console.log(i)
                    if(isFieldComplete(campoActual)) {
                        if(i == 3){
                            habilitarCampo(camposPreguntas[i+1])
                            habilitarCampo(camposPreguntas[6])
                            habilitarCampo(camposPreguntas[10])
                            habilitarCampo(camposPreguntas[14])
                        } else if(i == 4){
                            habilitarCampo(camposPreguntas[i+1])
                        } else if (i == 6) {
                            for(let j = 7; j < 10; j++)
                            {
                                habilitarCampo(camposPreguntas[j]);
                            }
                            for(let k = 10;k < 19; k++){
                                deshabilitarCampo(camposPreguntas[k]);
                            }
                            deshabilitarCampo(camposPreguntas[4])
                            deshabilitarCampo(camposPreguntas[5])
                        } else if (i == 10) {
                            for(let j = 11; j < 14; j++)
                            {
                                habilitarCampo(camposPreguntas[j]);
                            }
                        } else if (i == 14) {
                            for(let j = 15; j < 19; j++)
                            {
                                habilitarCampo(camposPreguntas[j]);
                            }
                        } else if (i<=4 || i > 19) {
                            habilitarCampo(campoSiguiente);
                        } else {
                        // Si el campo actual se vacía, deshabilita el siguiente Y todos los que le siguen
                            for (let j = i + 1; j < camposPreguntas.length; j++) {
                                deshabilitarCampo(camposPreguntas[j]);
                            }
                        }
                    }else{
                        
                    }
                    actualizarEstadoBotonEnviar();
                });

                // Si necesitas validación en tiempo real para inputs (mientras se escribe), añade un 'input' listener solo para ellos:
                if (campoActual.tagName === 'INPUT') {
                    campoActual.addEventListener('input', () => {
                        // Aquí, si el campo actual se vacía, solo necesitas actualizar el siguiente y el botón de enviar.
                        // La lógica de 'change' ya se encargará de deshabilitar toda la cadena.
                        if (isFieldComplete(campoActual)) {
                             // Si se completa al escribir, solo actualiza el botón si es necesario,
                             // el 'change' listener ya se encargará de habilitar el siguiente campo.
                        } else {
                             // Si se vacía al escribir, la lógica del 'change' listener lo manejará
                             // cuando el campo pierda el foco o cambie definitivamente.
                        }
                        actualizarEstadoBotonEnviar(); // Aún así, actualizar el botón puede ser útil en cada pulsación.
                    });
                }
            }
        }
    }


    // --- ADJUNTAR LISTENER AL ENVÍO DEL FORMULARIO PRINCIPAL ---
    if (formularioPrincipal) {
        formularioPrincipal.addEventListener('submit', function(event) {
            console.log("Intento de envío de formulario principal...");
            if (!validarFormularioCompleto()) {
                event.preventDefault(); // Detiene el envío si la validación falla
            }
        });
    } else {
        console.warn("No se encontró un formulario principal para adjuntar el listener de submit.");
    }

    // Desconectar el observer una vez que el formulario se ha configurado completamente
    observer.disconnect();
    console.log("MutationObserver desconectado después de configurar el formulario.");
}


// --- MUTATION OBSERVER ---

const observer = new MutationObserver((mutationsList, observerInstance) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0 && !formularioConfigurado) {
            configurarFormularioDinamico();
        }
    }
});

// Comienza a observar el 'divDatosExtrasExistente'.
if (divDatosExtrasExistente) {
    const observerConfig = { childList: true, subtree: true };
    observer.observe(divDatosExtrasExistente, observerConfig);
    console.log(`MutationObserver iniciado en el div '#datosExtras', esperando la carga de su contenido y campos...`);
} else {
    console.error("Error: El div '#datosExtras' no se encontró en el DOM al cargar el content script.");
    console.log("Asegúrate de que el ID es correcto y que el div está presente antes de que el script se ejecute.");
}