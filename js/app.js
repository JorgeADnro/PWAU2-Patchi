if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("js/sw.js").then(() => {
        console.log("Service Worker registrado exitosamente");
    }).catch((error) => {
        console.error("Error al registrar el Service Worker:", error);
    });
}

const paginas = {
    estilos: {
        formId: 'estilos-form',
        tableId: 'estilos-lista',
        almacen: 'estilos',
        campos: ['nombre', 'titulo', 'fecha']
    },
    artistas: {
        formId: 'artistas-form',
        tableId: 'artistas-lista',
        almacen: 'artistas',
        campos: ['nombre', 'especialidad', 'fecha']
    },
    colecciones: {
        formId: 'colecciones-form',
        tableId: 'colecciones-lista',
        almacen: 'colecciones',
        campos: ['nombre', 'categoria', 'fecha']
    }
};

document.addEventListener('DOMContentLoaded', () => {
    
    

    // Detectar página activa
    const pagina = Object.keys(paginas).find((key) => document.querySelector(`#${paginas[key].formId}`));
    if (!pagina) {
        console.error('No se detectó una página válida.');
        return;
    }

    // Inicializar lógica para la página actual
    const { formId, tableId, almacen } = paginas[pagina];
    inicializarFormularioYTabla(formId, tableId, almacen);
});

function inicializarFormularioYTabla(formId, tableId, almacen) {
    let form = document.getElementById(formId);
    let tabla = document.getElementById(tableId).querySelector('tbody');
    let listaDatos = [];
    const { campos } = paginas[almacen];

    const nuevoId = () => (listaDatos.length ? listaDatos[listaDatos.length - 1].id + 1 : 1);

    // Manejar el envío del formulario
    form.onsubmit = (evento) => {
        evento.preventDefault();
        let fd = new FormData(form);
        let datos = Object.fromEntries(fd.entries());

        // Asegurarse de que solo se incluyan los campos definidos
        datos = campos.reduce((obj, campo) => {
            obj[campo] = datos[campo];
            return obj;
        }, {});
        datos.id = form.dataset.id ? parseInt(form.dataset.id) : nuevoId();
        datos.enviado = false;

        if (form.dataset.type === 'update') {
            editarEvento(almacen, datos, generarTabla);
        } else {
            guardarEvento(almacen, datos, generarTabla);
        }
        form.reset();
        form.dataset.type = 'add';
    };

    // Generar filas de la tabla
    const generarFila = (registro) => {
        let tr = document.createElement('tr');
        campos.forEach((campo) => {
            let td = document.createElement('td');
            td.textContent = registro[campo] || '';
            tr.appendChild(td);
        });

        // Botón editar
        let td = document.createElement('td');
        let button = document.createElement('button');
        button.textContent = 'Editar';
        button.className = 'btn btn-info';
        button.onclick = () => editarRegistro(registro.id);
        td.appendChild(button);
        tr.appendChild(td);

        // Botón eliminar
        td = document.createElement('td');
        button = document.createElement('button');
        button.textContent = 'Eliminar';
        button.className = 'btn btn-danger';
        button.onclick = () => eliminarEvento(almacen, registro.id, generarTabla);
        td.appendChild(button);
        tr.appendChild(td);

        return tr;
    };

    // Generar tabla completa
    const generarTabla = () => {
        listarEventos(almacen, (datos) => {
            listaDatos = datos;
            tabla.innerHTML = '';
            datos.forEach((registro) => {
                tabla.appendChild(generarFila(registro));
            });
        });
    };

    // Cargar un registro en el formulario para editar
    const editarRegistro = (id) => {
        listarPorId(almacen, id, (registro) => {
            campos.forEach((campo) => {
                if (form[campo]) form[campo].value = registro[campo];
            });
            form.dataset.id = registro.id;
            form.dataset.type = 'update';
        });
    };

    // Inicializar tabla al cargar la página
    abrirBd(() => generarTabla());
}

