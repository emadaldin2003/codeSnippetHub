// ============================================
// إدارة المصادقة (Authentication)
// ============================================

window.API_BASE = window.API_BASE || './php/api/';

// دالة التحقق من وجود مستخدم مسجل دخول
function getCurrentUser() {
    const userData = localStorage.getItem('user_data');
    if (userData) {
        try {
            return JSON.parse(userData);
        } catch (e) {
            return null;
        }
    }
    return null;
}

// دالة لحفظ بيانات المستخدم بعد تسجيل الدخول
function setCurrentUser(user) {
    localStorage.setItem('user_data', JSON.stringify(user));
}

// دالة لحذف بيانات المستخدم (تسجيل الخروج)
function clearCurrentUser() {
    localStorage.removeItem('user_data');
    sessionStorage.clear();
}

// دالة للتحقق من المصادقة
function requireAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// دالة لتسجيل الدخول
async function loginUser(email, password) {
    try {
        const res = await fetch(API_BASE + 'login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success) {
            setCurrentUser(data.user);
            return { success: true, user: data.user };
        } else {
            return { success: false, message: data.message };
        }
    } catch (err) {
        return { success: false, message: 'فشل الاتصال بالخادم' };
    }
}

// دالة لتسجيل مستخدم جديد
async function registerUser(username, email, password) {
    try {
        const res = await fetch(API_BASE + 'register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (data.success) {
            const loginResult = await loginUser(email, password);
            return loginResult;
        } else {
            return { success: false, message: data.message };
        }
    } catch (err) {
        return { success: false, message: 'فشل الاتصال بالخادم' };
    }
}

// دالة تسجيل الخروج
function logoutUser() {
    clearCurrentUser();
    if (typeof showLocalNotification === 'function') {
        showLocalNotification('👋 مع السلامة', 'تم تسجيل الخروج بنجاح');
    }
    window.location.href = 'login.html';
}

// دالة لتحديث واجهة المستخدم
function updateUIForAuth() {
    const user = getCurrentUser();
    const userNameElements = document.querySelectorAll('.user-name-display');
    const userEmailElements = document.querySelectorAll('.user-email-display');
    
    if (user) {
        userNameElements.forEach(el => el.textContent = user.username || 'مستخدم');
        userEmailElements.forEach(el => el.textContent = user.email || '');
    }
}

// دالة لتوليد لون عشوائي (مستخدمة في الصورة الرمزية)
function generateRandomAvatarColor() {
    const colors = [
        '#6C63FF', '#34D399', '#F87171', '#FBBF24', '#60A5FA',
        '#A78BFA', '#F472B6', '#34D399', '#FB923C', '#818CF8',
        '#2DD4BF', '#E879F9', '#F97316', '#22D3EE'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}