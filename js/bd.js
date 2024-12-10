const abrirBd = (callback = null) => {
    let baseDatos = indexedDB.open('appDatabase', 1);
    baseDatos.onupgradeneeded = (evento) => {
        let db = evento.target.result;
        db.createObjectStore('estilos', { keyPath: 'id' });
        db.createObjectStore('artistas', { keyPath: 'id' });
        db.createObjectStore('colecciones', { keyPath: 'id' });
        db.createObjectStore('tendencias', { keyPath: 'id' });
    };
    baseDatos.onsuccess = (evento) => {
        db = evento.target.result;
        if (callback) callback();
    };
};

const obtenerAlmacen = (almacen, tipoTransaccion) => {
    let transaccion = db.transaction(almacen, tipoTransaccion);
    return transaccion.objectStore(almacen);
};

const guardarEvento = (almacen, datos, callback) => {
    let store = obtenerAlmacen(almacen, 'readwrite');
    let request = store.put(datos);
    request.onsuccess = callback;
};

const listarEventos = (almacen, callback) => {
    let store = obtenerAlmacen(almacen, 'readonly');
    let request = store.getAll();
    request.onsuccess = (evento) => callback(evento.target.result);
};

const listarPorId = (almacen, id, callback) => {
    let store = obtenerAlmacen(almacen, 'readonly');
    let request = store.get(id);
    request.onsuccess = (evento) => callback(evento.target.result);
};

const editarEvento = guardarEvento;

const eliminarEvento = (almacen, id, callback) => {
    let store = obtenerAlmacen(almacen, 'readwrite');
    let request = store.delete(id);
    request.onsuccess = callback;
};
