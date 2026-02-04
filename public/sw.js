self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json()
        const options = {
            body: data.body,
            icon: data.icon || '/apple-icon.png',
            badge: '/icon-light-32x32.png',
            data: {
                url: data.url,
            },
        }
        event.waitUntil(self.registration.showNotification(data.title, options))
    }
})

self.addEventListener('notificationclick', (event) => {
    event.notification.close()
    event.waitUntil(clients.openWindow(event.notification.data.url))
})

// Minimal service worker for PWA installability
self.addEventListener('install', (event) => {
    self.skipWaiting()
})

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim())
})

self.addEventListener('fetch', (event) => {
    // Simple pass-through for now, can be expanded for offline caching
    event.respondWith(fetch(event.request))
})
