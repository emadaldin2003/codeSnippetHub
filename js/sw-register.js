// تسجيل Service Worker بطريقة متوافقة مع InfinityFree
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // توليد كود Service Worker كـ Blob
        const swCode = `
            const CACHE_NAME = 'code-snippet-hub-v4';
            const urlsToCache = [
                './',
                './index.html',
                './login.html',
                './register.html',
                './profile.html',
                './books.html',
                './offline.html',
                './css/style.css',
                './js/app.js',
                './js/auth.js',
                './js/notifications.js',
                './js/sw-register.js'
            ];

            self.addEventListener('install', event => {
                event.waitUntil(
                    caches.open(CACHE_NAME)
                        .then(cache => cache.addAll(urlsToCache))
                );
            });

            self.addEventListener('activate', event => {
                event.waitUntil(
                    caches.keys().then(cacheNames => {
                        return Promise.all(
                            cacheNames.map(cache => {
                                if (cache !== CACHE_NAME) return caches.delete(cache);
                            })
                        );
                    })
                );
            });

            self.addEventListener('fetch', event => {
                event.respondWith(
                    caches.match(event.request)
                        .then(response => response || fetch(event.request).catch(() => {
                            return caches.match('./offline.html');
                        }))
                );
            });

            self.addEventListener('message', event => {
                if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
                    const title = event.data.title || 'تنبيه';
                    const options = {
                        body: event.data.body || 'مرحباً!',
                        icon: './assets/icons/icon-192x192.png',
                        badge: './assets/icons/icon-72x72.png',
                        vibrate: [200, 100, 200],
                        data: { url: event.data.url || './' }
                    };
                    self.registration.showNotification(title, options);
                }
            });

            self.addEventListener('notificationclick', event => {
                event.notification.close();
                event.waitUntil(clients.openWindow(event.notification.data.url || './'));
            });
        `;

        const blob = new Blob([swCode], { type: 'application/javascript' });
        const swUrl = URL.createObjectURL(blob);

        navigator.serviceWorker.register(swUrl)
            .then(registration => {
                console.log('Service Worker مسجل بنجاح!', registration);
            })
            .catch(err => {
                console.log('فشل تسجيل Service Worker:', err);
            });
    });
}