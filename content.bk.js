// content.js
console.log("¡Extensión de validación de formulario cargadaaa!");

// --- SELECTOR DEL CONTENEDOR PRINCIPAL DEL FORMULARIO ---
// Este debe ser el elemento más cercano que existe en el DOM ANTES de que se cargue la tabla.
// Puede ser un <div> principal donde se inyecta la tabla, o incluso el 'body' si no hay un contenedor intermedio.
// Si no estás seguro, 'document.body' sigue siendo una opción segura (pero menos eficiente).
const contenedorFormularioDinamico = document.querySelector('#content') || document.body;
// *** MUY IMPORTANTE: Reemplaza '#idDelContenedorPrincipalDelFormulario' con el ID o selector real de tu contenedor ***
// Si no hay un contenedor específico que exista antes de la tabla, usa 'document.body'.



/*const campo4 = document.querySelector('input[name="preguntas[4].texto"]')

function deshabilitarCampo(element) {
  if (element) {
    element.setAttribute('disabled', 'true');
    element.value = ''; // Opcional: limpiar el valor al deshabilitar
    element.style.backgroundColor = '#e9e9e9'; // Estilo visual para deshabilitado
  }
}
*/
const observer = new MutationObserver((mutationsList, observer) => {
    // Itera sobre los cambios que se han producido
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            // Un nodo hijo ha sido añadido o eliminado
            // Intentamos buscar la tabla 'datosExtra' cada vez que se detecta un cambio
            const tablaDetectada = contenedorFormularioDinamico.querySelector('#datosExtras');
            if (tablaDetectada && !formularioCargado) {
                console.log("Tabla 'datosExtras' detectada en el DOM. Intentando configurar el formulario...");
                configurarFormularioDinamico();
                break;
            }
        }
    }
});

// Configura el observer para observar el contenedor principal del formulario.
// Si la tabla 'datosExtra' se inyecta directamente dentro de este contenedor,
// 'childList: true' es suficiente. Si se inyecta más profundamente, 'subtree: true' es necesario.
const observerConfig = { childList: true, subtree: true };

// Comienza a observar el 'contenedorFormularioDinamico'
if (contenedorFormularioDinamico) {
    observer.observe(contenedorFormularioDinamico, observerConfig);
    console.log(`MutationObserver iniciado en '${contenedorFormularioDinamico.tagName}', esperando la tabla 'datosExtras' y el formulario dinámico...`);
} else {
    console.error("Error: No se encontró el contenedor principal del formulario para el MutationObserver.");
}

//deshabilitarCampo(campo4)
