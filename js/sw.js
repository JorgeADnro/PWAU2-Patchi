if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then(() => {
      console.log("Service Worker registrado exitosamente");
    }).catch((error) => {
      console.error("Error al registrar el Service Worker:", error);
    });
  }

const CACHE_NAME = 'mi-pwa-cache-v1';
const urlsToCache = [
    '/',
    '/inicio.html',
    '/estilos.html',
    '/artistas.html',
    '/colecciones.html',
    '/tendencias.html',
    '/css/styles.css',
    '/js/app.js',
    '/icon-192x192.png',
    '/icon-512x512.png',
    '/manifest.json'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
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
            .then((response) => {
                return response || fetch(event.request);
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