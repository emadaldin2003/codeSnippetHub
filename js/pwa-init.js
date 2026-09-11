// js/pwa-init.js - تهيئة PWA متوافقة مع InfinityFree
// يتم توليد manifest.json كـ Blob لتجاوز حجب الاستضافة للملفات الثابتة
(function() {
    // بيانات manifest
    const manifest = {
        name: "Code Snippet Hub",
        short_name: "Snippet Hub",
        description: "منصة لحفظ وإدارة الأكواد البرمجية",
        start_url: "./index.html",
        scope: "./",
        display: "standalone",
        background_color: "#0B0E14",
        theme_color: "#6C63FF",
        orientation: "portrait-primary",
        lang: "ar",
        dir: "ltr",
        icons: [
            {
                src: "./assets/icons/icon-72x72.png",
                sizes: "72x72",
                type: "image/png",
                purpose: "any"
            },
            {
                src: "./assets/icons/icon-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "any"
            },
            {
                src: "./assets/icons/icon-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any"
            },
            {
                src: "./assets/icons/icon-512x512-maskable.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable"
            }
        ]
    };

    // توليد الـ manifest كـ Blob
    const manifestBlob = new Blob(
        [JSON.stringify(manifest)],
        { type: 'application/manifest+json' }
    );
    const manifestUrl = URL.createObjectURL(manifestBlob);

    // إضافة رابط manifest إلى الصفحة
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = manifestUrl;
    document.head.appendChild(link);

    // إضافة apple-touch-icon لدعم iOS
    const appleIcon = document.createElement('link');
    appleIcon.rel = 'apple-touch-icon';
    appleIcon.href = './assets/icons/icon-192x192.png';
    document.head.appendChild(appleIcon);

    // إضافة meta للتطبيقات على iOS
    const appleCapable = document.createElement('meta');
    appleCapable.name = 'apple-mobile-web-app-capable';
    appleCapable.content = 'yes';
    document.head.appendChild(appleCapable);

    const appleStatusBar = document.createElement('meta');
    appleStatusBar.name = 'apple-mobile-web-app-status-bar-style';
    appleStatusBar.content = 'black-translucent';
    document.head.appendChild(appleStatusBar);

    const appleTitle = document.createElement('meta');
    appleTitle.name = 'apple-mobile-web-app-title';
    appleTitle.content = 'Snippet Hub';
    document.head.appendChild(appleTitle);

    console.log('تم تهيئة PWA بنجاح');
})();