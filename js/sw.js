
const CACHE_NAME = 'mi-pwa-cache-v1';
const urlsToCache = [
    '/',
    '/inicio.html',
    '/estilos.html',
    '/artistas.html',
    '/colecciones.html',
    '/tendencias.html',
    '/estilos.css',
    '/js/app.js',
    '/img/otros/fondo.jpg',
    '/img/otros/NOMBRE.png',
    '/img/Logo-transparente2.png',
    '/manifest.json'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return Promise.all(
                    urlsToCache.map((url) => {
                        return fetch(url).then((response) => {
                            if (!response.ok) {
                                throw new Error(`Request for ${url} failed with status ${response.status}`);
                            }
                            return cache.put(url, response);
                        }).catch((error) => {
                            console.error(`No se pudo cachear ${url}:`, error);
                        });
                    })
                );
            })
    );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
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
            .then((response) => response || fetch(event.request))
            .catch((error) => {
                console.error('Error al manejar la solicitud:', error);
                return new Response('Error al cargar el recurso', { status: 500 });
            })
    );
});

// Manejo de notificaciones push
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Notificación sin contenido',
        icon: 'icon-192x192.png',
        badge: 'icon-192x192.png'
    };
    event.waitUntil(
        self.registration.showNotification('Título de la Notificación', options)
    );
});