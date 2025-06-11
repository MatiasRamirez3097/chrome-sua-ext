// content.js
console.log("¡Extensión de validación de formulario cargada y lista para la acción!");
const domain = document.URL.split('://')[1];
const subdomain = domain.split('.')[0];

const produccionPos = {
    trabajoEnVeredaPos: 'preguntas[7].idValorSelec',
    trabajoExtraccionPos: 'preguntas[9].idValorSelec',
    trabajoSubPos: 'preguntas[13].idValorSelec',
    trabajoAereaPos: 'preguntas[17].idValorSelec',
    afterCategorysPos: 'preguntas[23].idValorSelec',
    beforeCategorysPos: 'preguntas[6].idValorSelec'
}

const testingPos = {
    trabajoEnVeredaPos: 'preguntas[6].idValorSelec',
    trabajoExtraccionPos: 'preguntas[8].idValorSelec',
    trabajoSubPos: 'preguntas[12].idValorSelec',
    trabajoAereaPos: 'preguntas[16].idValorSelec',
    afterCategorysPos: 'preguntas[22].idValorSelec',
    beforeCategorysPos: 'preguntas[5].idValorSelec'
}

// --- SELECTOR DEL DIV QUE YA EXISTE Y CUYO CONTENIDO SE CARGA DINÁMICAMENTE ---
let divDatosExtrasExistente;
let formExistente
//const divDatosExtrasExistente = document.querySelector('#datosExtras');
if (document.querySelector("#datosExtras")){
    divDatosExtrasExistente = document.querySelector("#datosExtras")
} else {
    formExistente = document.querySelector('form[name="datosExtrasF"]')
}
let formularioConfigurado = false; // Bandera para asegurar que la configuración se hace solo una vez

// --- VARIABLES GLOBALES PARA LOS CAMPOS DEL FORMULARIO ---
// // Array para almacenar los campos de preguntas[NRO].texto o preguntas[NRO].idValorSelec

// Otras variables que podrías necesitar
let botonEnviar;
let formularioPrincipal;
let datosExtrasTable;
let trabajoEnVeredaPos;
let trabajoExtraccionPos;
let trabajoSubPos;
let trabajoAereaPos;
let afterCategorysPos;
let beforeCategorysPos;
let camposPreguntas;


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
    return campo.value.trim() !== '' && campo.value.trim() != -1;
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
        //botonEnviar.disabled;
        deshabilitarCampo(botonEnviar);
    }
}

function deshabiltarMultiples(index, cant) {
    for(let i = index+1; i <= index + cant;i++){
        deshabilitarCampo(camposPreguntas[i])
    }
}

function habiltarMultiples(index, cant) {
    for(let i = index+1; i <= index + cant;i++){
        habilitarCampo(camposPreguntas[i])
    }
}

function habiltarCategorySelects()
{
    const categorySelectsNames = [ 
        camposPreguntas[trabajoEnVeredaPos].name,
        camposPreguntas[trabajoExtraccionPos].name,
        camposPreguntas[trabajoSubPos].name,
        camposPreguntas[trabajoAereaPos].name
    ]
    for(let i of categorySelectsNames)
    {
        for(const el of camposPreguntas){
            if(el.name == i)
            {
                habilitarCampo(el)
                break
            }
        }
        
    }
    
}
const produccion = () => {
    return subdomain == 'sua'
}
function trabajosEnVereda(campo, complete) {
    isFieldComplete(campo) ? habilitarCampo(camposPreguntas[i+1]) : deshabilitarCampo(camposPreguntas[i+1])
}
// FORM VALIDATE
function validateForm() {
  let x = document.forms["solcitud"]["preguntas[4].texto"].value;
  if (x == "") {
    alert("Fecha de dictamen no puede quedar en blanco!");
    return false;
  }
}
// --- FUNCIÓN CENTRAL DE CONFIGURACIÓN DEL FORMULARIO DINÁMICO ---
function configurarFormularioDinamico() {
    if (formularioConfigurado) return;

    if (document.querySelector("#datosExtras")){
        datosExtrasTable = document.querySelector("#datosExtras")
    } else {
        datosExtrasTable = document.querySelector('form[name="datosExtrasF"]')
    }

    camposPreguntas = datosExtrasTable.querySelectorAll('input, select')
    // --- RECOPILACIÓN Y DESHABILITACIÓN INICIAL DE LOS CAMPOS 'preguntas[NRO]' ---
    for (let i = 1; i < camposPreguntas.length; i++) {
        if(divDatosExtrasExistente) i != 0 && deshabilitarCampo(camposPreguntas[i])
        else {
            i != 1 && i != 0 && i != camposPreguntas.length - 1 && i != camposPreguntas.length - 2 &&deshabilitarCampo(camposPreguntas[i])
            habilitarCampo(camposPreguntas[2])
        }
        if(produccion()) {
            if (camposPreguntas[i].name == produccionPos.trabajoEnVeredaPos) trabajoEnVeredaPos = i
            else if (camposPreguntas[i].name == produccionPos.trabajoExtraccionPos) trabajoExtraccionPos = i
            else if (camposPreguntas[i].name == produccionPos.trabajoSubPos) trabajoSubPos = i
            else if (camposPreguntas[i].name == produccionPos.trabajoAereaPos) trabajoAereaPos = i 
            else if (camposPreguntas[i].name == produccionPos.afterCategorysPos) afterCategorysPos = i
            else if (camposPreguntas[i].name == produccionPos.beforeCategorysPos) beforeCategorysPos = i
        } else if (!produccion()) {
            if (camposPreguntas[i].name == testingPos.trabajoEnVeredaPos) trabajoEnVeredaPos = i
            else if (camposPreguntas[i].name == testingPos.trabajoExtraccionPos) trabajoExtraccionPos = i
            else if (camposPreguntas[i].name == testingPos.trabajoSubPos) trabajoSubPos = i
            else if (camposPreguntas[i].name == testingPos.trabajoAereaPos) trabajoAereaPos = i 
            else if (camposPreguntas[i].name == testingPos.afterCategorysPos) afterCategorysPos = i
            else if (camposPreguntas[i].name == testingPos.beforeCategorysPos) beforeCategorysPos = i
        }
    }
    habiltarMultiples(afterCategorysPos, camposPreguntas.length -1)
    //OTRAS ASIGNACIONES
    //botonEnviar = document.querySelector('[onclick="javacript:guardarSolicitud(false);"]');
    
    botonEnviar = Array.from(document.querySelectorAll('button'))
        .find(el => el.textContent === 'Generar solicitud');
    formularioPrincipal = document.getElementById('solicitudF');
    if(botonEnviar && formularioPrincipal) {
        //actualizarEstadoBotonEnviar();
    } else {
        console.warn("Advertencia: No se encontró el botón de envío o el formulario principal. La validación de envío podría verse afectada.");
    }
    // --- INICIALIZAR EL ESTADO DEL BOTÓN DE ENVÍO ---
    

    for (let i = 0; i < camposPreguntas.length - 1; i++) {
        const campoActual = camposPreguntas[i];
        const campoSiguiente = camposPreguntas[i + 1];

        if (campoActual && campoSiguiente) {
            campoActual.addEventListener('change', (event) => {
                if(isFieldComplete(campoActual)){
                    if(i == beforeCategorysPos){
                        habiltarCategorySelects()
                        habilitarCampo(camposPreguntas[afterCategorysPos])
                    } else if(i == trabajoEnVeredaPos ){
                        habiltarMultiples(i,1)
                    } else if(i == trabajoExtraccionPos) {
                        habiltarMultiples(i,3)
                        deshabiltarMultiples(trabajoSubPos-1, 3)
                        deshabiltarMultiples(trabajoAereaPos-1, 4)
                    } else if(i == trabajoSubPos) {
                        habiltarMultiples(i,3)
                        deshabiltarMultiples(trabajoExtraccionPos-1, 3)
                    } else if(i == trabajoAereaPos) {
                        habiltarMultiples(i,4)
                        deshabiltarMultiples(trabajoExtraccionPos-1, 3)
                    } else if (i<beforeCategorysPos) {
                        habilitarCampo(campoSiguiente);
                    }
                }
                else
                {
                    if(i == trabajoEnVeredaPos ){
                        deshabiltarMultiples(i,1)
                    } else if(i == trabajoExtraccionPos) {
                        deshabiltarMultiples(i,3)
                        habilitarCampo(camposPreguntas[trabajoEnVeredaPos])
                        habilitarCampo(camposPreguntas[trabajoSubPos])
                        habilitarCampo(camposPreguntas[trabajoAereaPos])
                    } else if(i == trabajoSubPos) {
                        deshabiltarMultiples(i,3)
                        habilitarCampo(camposPreguntas[trabajoExtraccionPos])
                    } else if(i == trabajoAereaPos) {
                        deshabiltarMultiples(i,4)
                        habilitarCampo(camposPreguntas[trabajoExtraccionPos])
                    } else if(i==beforeCategorysPos){
                        deshabiltarMultiples(trabajoEnVeredaPos-1,afterCategorysPos-1)
                    } else if(i<beforeCategorysPos){
                        deshabilitarCampo(campoSiguiente)
                    }
                }
                //actualizarEstadoBotonEnviar()
            })

        }
    }
    formularioConfigurado = true
    // Desconectar el observer una vez que el formulario se ha configurado completamente
    observer.disconnect();
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
    if(formExistente) configurarFormularioDinamico()
    console.error("Error: El div '#datosExtras' no se encontró en el DOM al cargar el content script.");
    console.log("Asegúrate de que el ID es correcto y que el div está presente antes de que el script se ejecute.");
}