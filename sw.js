// sw.js - Service Worker الخاص بـ Code Snippet Hub
const CACHE_NAME = 'code-snippet-hub-v5';
const urlsToCache = [
    './',
    './index.html',
    './login.html',
    './register.html',
    './profile.html',
    './books.html',
    './add.html',
    './offline.html',
    './css/style.css',
    './js/app.js',
    './js/auth.js',
    './js/notifications.js',
    './js/sw-register.js',
    './assets/icons/icon-72x72.png',
    './assets/icons/icon-192x192.png',
    './assets/icons/icon-512x512.png'
];

// تثبيت الـ SW
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('تم فتح الكاش وتخزين الملفات');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// تنشيط الـ SW وحذف الكاش القديم
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('تم حذف الكاش القديم:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// استراتيجية التخزين المؤقت (Cache First)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request).catch(() => {
                    if (event.request.mode === 'navigate') {
                        return caches.match('./offline.html');
                    }
                });
            })
    );
});

// الإشعارات المحلية
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const title = event.data.title || 'تنبيه من Code Snippet Hub';
        const options = {
            body: event.data.body || 'مرحباً! هذا إشعار محلي.',
            icon: './assets/icons/icon-192x192.png',
            badge: './assets/icons/icon-72x72.png',
            vibrate: [200, 100, 200],
            data: {
                url: event.data.url || './'
            }
        };
        self.registration.showNotification(title, options);
    }
});

// عند الضغط على الإشعار
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url || './')
    );
});