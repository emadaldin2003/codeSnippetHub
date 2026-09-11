// sw.js - Service Worker الخاص بـ Code Snippet Hub

const CACHE_NAME = 'code-snippet-hub-v3'; // تغيير الإصدار لتحديث الكاش
const urlsToCache = [
    '/code-snippet-hub/',
    '/code-snippet-hub/index.html',
    '/code-snippet-hub/login.html',
    '/code-snippet-hub/register.html',
    '/code-snippet-hub/profile.html',
    '/code-snippet-hub/books.html',     // صفحة الكتب الجديدة
    '/code-snippet-hub/offline.html',
    '/code-snippet-hub/css/style.css',
    '/code-snippet-hub/js/app.js',
    '/code-snippet-hub/js/auth.js',
    '/code-snippet-hub/js/notifications.js',
    '/code-snippet-hub/js/sw-register.js'
];

// تثبيت الـ SW
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('تم فتح الكاش وتخزين الملفات');
                return cache.addAll(urlsToCache);
            })
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
        })
    );
});

// استراتيجية التخزين المؤقت (Cache First)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request).catch(() => {
                    return caches.match('/code-snippet-hub/offline.html');
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
            icon: '/code-snippet-hub/assets/icons/icon-192x192.png',
            badge: '/code-snippet-hub/assets/icons/icon-72x72.png',
            vibrate: [200, 100, 200],
            data: {
                url: event.data.url || '/'
            }
        };
        self.registration.showNotification(title, options);
    }
});

// عند الضغط على الإشعار
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url || '/')
    );
});