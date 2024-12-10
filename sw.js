const CACHE_NAME = 'mi-pwa-cache-v1';
const urlsToCache = [
    '/inicio.html',             // Correcto
    '/estilos.html',            // Correcto
    '/artistas.html',           // Correcto
    '/colecciones.html',        // Correcto
    '/tendencias.html',         // Correcto
    '/estilos.css',             // Correcto
    '/js/app.js',               // Correcto
    '/js/bd.js',                // Añadido, según tu estructura
    '/img/otros/fondo.jpg',     // Correcto
    '/img/otros/NOMBRE.png',    // Correcto
    '/img/Logo-transparente2.png', // Correcto
    '/manifest.json'            // Correcto
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
            .catch((error) => console.error('Error al cachear archivos:', error))
    );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log(`Borrando caché antigua: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Intercepción de las solicitudes
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
            .catch((error) => {
                console.error('Error al manejar la solicitud:', error);
                // Fallback en caso de error o sin conexión
                if (event.request.destination === 'document') {
                    return caches.match('/inicio.html'); // Página predeterminada offline
                }
            })
    );
});
