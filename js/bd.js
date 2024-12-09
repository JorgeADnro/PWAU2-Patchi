const almacen = "libros";
let db = null;

const abrirBd = (callback = null) =>{
    let baseDatos = indexedDB.open("libros", 1);

    baseDatos.onsuccess = (evento) => {
        console.log("Base de datos creada");
        db = evento.target.result;
        if(callback) callback();
    }

    baseDatos.onupgradeneeded = (evento) => {
        console.log("BD actualizada");
        db = evento.target.result;
        db.createObjectStore(almacen, { keyPath: "id"});
    }
}

const obtenerAlmacen = (tipoTransaccion) => {
    let transaccion = db.transaction( almacen, tipoTransaccion );
    return transaccion.objectStore( almacen );
}

const guardarEvento = (libro, onsuccess = null) => {
    let almacen = obtenerAlmacen("readwrite");
    let guardar = almacen.add( libro );
    guardar.onsuccess = onsuccess;
}

const listarEventos = (onsuccess = null) => {
    let almacen = obtenerAlmacen("readonly");
    let respuesta = almacen.getAll();
    respuesta.onsuccess = (evento) => {
        let lista = evento.target.result;
        if(onsuccess) onsuccess(lista);
    }
}

const listarPorId = ( id, onsuccess = null ) => {
    let almacen = obtenerAlmacen("readonly");
    let respuesta = almacen.get(id);
    respuesta.onsuccess = (e) => {
        let registro = e.target.result;
        if ( onsuccess ) onsuccess(registro);
    }
}

const editarEvento = (eventoActualizado, onsuccess = null) => {
    let almacen = obtenerAlmacen("readwrite");
    let respuesta = almacen.put( eventoActualizado);
    respuesta.onsuccess = onsuccess;
}

const eliminarEvento = (id, onsuccess = null) => {
    let almacen = obtenerAlmacen("readwrite");
    let respuesta = almacen.delete(id);
    respuesta.onsuccess = onsuccess;
}
