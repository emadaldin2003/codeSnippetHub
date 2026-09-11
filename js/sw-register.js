// تسجيل Service Worker - نسخة بسيطة تعمل على أي استضافة
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('✅ Service Worker مسجل بنجاح:', registration.scope);
            })
            .catch(err => {
                console.error('❌ فشل تسجيل Service Worker:', err);
            });
    });
}