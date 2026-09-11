// دالة لطلب إذن الإشعارات من المستخدم (تُستدعى عند التفاعل)
function requestNotificationPermission() {
    if (!('Notification' in window)) {
        alert('المتصفح لا يدعم الإشعارات');
        return;
    }

    if (Notification.permission === 'granted') {
        showLocalNotification('مرحباً!', 'الإشعارات مفعلة بالفعل ✅');
        return;
    }

    if (Notification.permission === 'denied') {
        alert('تم رفض الإشعارات مسبقاً. يرجى تفعيلها من إعدادات المتصفح.');
        return;
    }

    // طلب الإذن
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log('تم منح إذن الإشعارات');
            showLocalNotification('مرحباً!', 'تم تفعيل الإشعارات بنجاح ✅');
        } else {
            console.log('تم رفض الإشعارات');
            alert('لن تتمكن من استلام الإشعارات. يمكنك تغيير ذلك لاحقاً من إعدادات المتصفح.');
        }
    });
}

// دالة لإرسال إشعار محلي (تعمل حتى لو كان التطبيق في الخلفية عبر Service Worker)
function showLocalNotification(title, body) {
    // أولاً: نتحقق من إذن الإشعارات
    if (Notification.permission !== 'granted') {
        console.warn('الإشعارات غير مفعلة');
        return;
    }

    // ثانياً: نتحقق من وجود Service Worker لنرسل له رسالة لعرض الإشعار
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: 'SHOW_NOTIFICATION',
            title: title,
            body: body,
            url: window.location.href
        });
    } else {
        // طريقة احتياطية (إذا لم يكن الـ SW جاهزاً، نعرض إشعاراً عادياً)
        const notification = new Notification(title, {
            body: body,
            icon: '/code-snippet-hub/assets/icons/icon-192x192.png'
        });

        notification.onclick = function() {
            window.focus();
            this.close();
        };
    }
}

// دالة لإرسال إشعار عند فتح التطبيق (Welcome Back)
function sendWelcomeNotification() {
    const lastVisit = localStorage.getItem('lastVisit');
    if (!lastVisit) {
        // أول زيارة - ننتظر قليلاً ثم نعرض الإشعار
        setTimeout(() => {
            showLocalNotification('👋 أهلاً بك!', 'مرحباً في Code Snippet Hub، ابدأ بحفظ أكوادك الآن.');
        }, 1500);
    } else {
        // زيارة متكررة
        setTimeout(() => {
            const count = document.querySelectorAll('.snippet-item').length || 0;
            showLocalNotification('👋 مرحباً بعودتك!', `لديك ${count} كود محفوظ.`);
        }, 1500);
    }
    localStorage.setItem('lastVisit', new Date().toISOString());
}