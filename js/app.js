if(navigator.serviceWorker){
    navigator.serviceWorker.register("/sw.js");
}

let form = document.querySelector("#estilos-form");
let tabla = document.querySelector("#estilos-lista tbody");
let listaDatos = [];

const nuevoId = () => {
    let ultimoRegistro = listaDatos[ listaDatos.length - 1];
    if (ultimoRegistro) {
        return ultimoRegistro.id + 1;
    }else {
        return 1;
    }
}

form.onsubmit = (evento) => {
    evento.preventDefault();
    let fd = new FormData(form);
    let datos = Object.fromEntries( fd.entries() );
    let tipoOperacion = form.dataset.type;
    if (tipoOperacion === "add") {
        datos.id = nuevoId();
        datos.enviado = false;
        //guardarEvento(datos, generarTabla);
        registrarTareaAsync(datos);
    }else {
        datos.id = parseInt( form.dataset.id );
        editarEvento( datos, generarTabla);
    }
    form.reset();
}

const registrarTareaAsync = ( datos ) =>{
    guardarEvento(datos,()=>{
        generarTabla();
        if("SyncManager" in window){
            navigator.serviceWorker.ready.then(swRegistrado => {
                return swRegistrado.sync.register("sync-info-libros");
            });
        }
    });
}

const generarFila = ({id, nombre,fecha,enviado }) => {
    let tr = document.createElement("tr");

    //nombre
    td = document.createElement("td");
    td.textContent = nombre;
    tr.appendChild(td);

    //titulo
    td = document.createElement("td");
    td.textContent = titulo;
    tr.appendChild(td);

    //fecha
    td = document.createElement("td");
    td.textContent = fecha;
    tr.appendChild(td);

    //enviado
    td = document.createElement("td");
    td.textContent = enviado ? "Sí" : "No";
    tr.appendChild(td);

    //boton editar
    td = document.createElement("td");
    let button = document.createElement("button");
    button.textContent = "Editar";
    button.className = "btn btn-info";
    button.onclick = () => {
        editarRegistro(id);
    }
    td.appendChild(button);
    tr.appendChild(td);

    //boton eliminar
    td = document.createElement("td");
    button = document.createElement("button");
    button.textContent = " Eliminar ";
    button.className = "btn btn-danger";
    button.onclick = () => {
        eliminarEvento(id, generarTabla);
    }
    td.appendChild( button );
    tr.appendChild( td );

    return tr;

}

const generarTabla = () => {
    listarEventos( (datos) => {
        listaDatos = datos;
        tabla.innerHTML = "";
        datos.forEach( registro => {
            tabla.appendChild( generarFila(registro));
        });
        form.dataset.type = "add";
        form.querySelector("button").textContent = "Guardar";
    });
}

const editarRegistro = (id) => {
    listarPorId(id, ({id, nombre, titulo, fecha}) => {
        form.querySelector("#nombre").value = nombre;
        form.querySelector("#titulo").value = titulo;
        form.querySelector("#fecha").value = fecha;
        form.dataset.id = id;
        form.dataset.type = "update";
        form.querySelector("button").textContent = "Actualizar";
    });
}

function eliminar(){
    sessionStorage.clear();
}

abrirBd(generarTabla);

const canal = new BroadcastChannel("sw-messages");
canal.addEventListener("message", evento => {
    generarTabla();
});