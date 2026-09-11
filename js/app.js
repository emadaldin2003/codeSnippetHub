// ============================================
// المتغيرات العامة والعناصر (DOM Elements)
// ============================================
window.API_BASE = './php/api/';

const grid = document.getElementById('snippetsGrid');
const searchInput = document.getElementById('searchInput');
const modalOverlay = document.getElementById('modalOverlay');
const snippetForm = document.getElementById('snippetForm');
const modalTitle = document.getElementById('modalTitle');
const editId = document.getElementById('editId');
const snippetTitle = document.getElementById('snippetTitle');
const snippetLanguage = document.getElementById('snippetLanguage');
const snippetCode = document.getElementById('snippetCode');
const snippetDesc = document.getElementById('snippetDesc');
const snippetTags = document.getElementById('snippetTags');
const openAddBtn = document.getElementById('openAddModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const toastContainer = document.getElementById('toastContainer');

let allSnippets = [];
let currentFilter = 'all';

// ============================================
// دوال الـ Toast
// ============================================
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ============================================
// دالة الوقت النسبي (الميزة الجديدة)
// ============================================
function timeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);
    if (diffInSeconds < 60) return 'الآن';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'أمس';
    if (diffInDays < 7) return `منذ ${diffInDays} يوم`;
    if (diffInDays < 30) return `منذ ${Math.floor(diffInDays / 7)} أسبوع`;
    if (diffInDays < 365) return `منذ ${Math.floor(diffInDays / 30)} شهر`;
    return `منذ ${Math.floor(diffInDays / 365)} سنة`;
}

// ============================================
// تحديث الإحصائيات (الميزة الجديدة)
// ============================================
function updateStats(snippets) {
    const total = snippets.length;
    const favorites = snippets.filter(s => s.is_favorite).length;
    const languages = new Set(snippets.map(s => s.language)).size;
    document.getElementById('totalCount').textContent = total;
    document.getElementById('favCount').textContent = favorites;
    document.getElementById('langCount').textContent = languages;
}

// ============================================
// تصدير الأكواد كـ JSON (الميزة الجديدة)
// ============================================
function exportSnippets() {
    if (!allSnippets || allSnippets.length === 0) {
        showToast('لا توجد أكواد للتصدير', 'error');
        return;
    }
    
    // إضافة بيانات إضافية للتصدير
    const exportData = {
        exported_at: new Date().toISOString(),
        total: allSnippets.length,
        snippets: allSnippets
    };
    
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `snippets-backup-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast(`📥 تم تصدير ${allSnippets.length} كود بنجاح`, 'success');
    showLocalNotification('📥 تصدير', `تم تصدير ${allSnippets.length} كود كملف JSON`);
}

// ============================================
// جلب الأكواد
// ============================================
async function fetchSnippets() {
    try {
        const res = await fetch(API_BASE + 'get.php');
        const data = await res.json();
        if (data.success) {
            allSnippets = data.snippets || [];
            updateStats(allSnippets);
            renderSnippets(allSnippets);
        } else {
            showToast('فشل في تحميل الأكواد', 'error');
        }
    } catch (err) {
        console.error('خطأ في جلب البيانات:', err);
        showToast('تعذر الاتصال بالخادم', 'error');
    }
}

// ============================================
// عرض الأكواد في الشبكة
// ============================================
function renderSnippets(snippets) {
    updateStats(snippets);

    if (!snippets || snippets.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📦</div>
                <h3>لا توجد أكواد محفوظة</h3>
                <p>ابدأ بإضافة أول كود برمجي لك الآن!</p>
                <button class="btn btn-primary" onclick="document.getElementById('openAddModalBtn').click()">
                    ➕ إضافة كود جديد
                </button>
            </div>
        `;
        return;
    }

    let html = '';
    snippets.forEach(snip => {
        const formattedDate = timeAgo(snip.created_at);
        const tags = snip.tags || [];
        const tagsHtml = tags.map(tag => `<span class="tag">#${tag}</span>`).join('');
        const favIcon = snip.is_favorite ? '⭐' : '☆';

        html += `
            <div class="snippet-card" data-id="${snip.id}">
                <div class="card-header">
                    <h3 class="card-title">${escapeHtml(snip.title)}</h3>
                    <span class="card-language">${escapeHtml(snip.language)}</span>
                </div>
                <div class="card-description">${escapeHtml(snip.description || 'لا يوجد وصف')}</div>
                <div class="code-preview" onclick="copySnippet(${snip.id})" title="انقر لنسخ الكود">
                    ${escapeHtml(snip.code.substring(0, 120))}${snip.code.length > 120 ? '...' : ''}
                </div>
                <div class="card-tags">${tagsHtml}</div>
                <div class="card-footer">
                    <span class="card-date">🕒 ${formattedDate}</span>
                    <div class="card-actions">
                        <button class="btn-icon ${snip.is_favorite ? 'favorite' : ''}" 
                                onclick="toggleFavorite(${snip.id})" title="مفضلة">
                            ${favIcon}
                        </button>
                        <button class="btn-icon copy-btn" onclick="copyFullSnippet(${snip.id})" title="نسخ الكود">📋</button>
                        <button class="btn-icon" onclick="editSnippet(${snip.id})" title="تعديل">✏️</button>
                        <button class="btn-icon delete-btn" onclick="deleteSnippet(${snip.id})" title="حذف">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// دوال التصفية والبحث
// ============================================
function filterSnippets() {
    const query = searchInput.value.toLowerCase().trim();
    let filtered = allSnippets;
    if (currentFilter !== 'all') {
        filtered = filtered.filter(s => s.language === currentFilter);
    }
    if (query) {
        filtered = filtered.filter(s =>
            s.title.toLowerCase().includes(query) ||
            (s.description && s.description.toLowerCase().includes(query)) ||
            (s.tags && s.tags.some(t => t.toLowerCase().includes(query))) ||
            s.code.toLowerCase().includes(query)
        );
    }
    renderSnippets(filtered);
}

searchInput.addEventListener('input', filterSnippets);

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.dataset.filter;
        filterSnippets();
    });
});

// ============================================
// إضافة وتعديل وحذف ونسخ ومفضلة
// ============================================
async function addSnippet(data) {
    try {
        const res = await fetch(API_BASE + 'add.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (result.success) {
            showToast('✅ ' + result.message, 'success');
            closeModal();
            fetchSnippets();
            showLocalNotification('✅ تم الحفظ!', `تم حفظ الكود "${data.title}" بنجاح`);
        } else {
            showToast('❌ ' + result.message, 'error');
        }
    } catch (err) {
        showToast('فشل في الاتصال بالخادم', 'error');
    }
}

async function deleteSnippet(id) {
    if (!confirm('هل أنت متأكد من حذف هذا الكود؟')) return;
    try {
        const res = await fetch(API_BASE + 'delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });
        const result = await res.json();
        if (result.success) {
            showToast('🗑️ ' + result.message, 'success');
            fetchSnippets();
        } else {
            showToast('❌ ' + result.message, 'error');
        }
    } catch (err) {
        showToast('فشل في الحذف', 'error');
    }
}

async function toggleFavorite(id) {
    const snippet = allSnippets.find(s => s.id === id);
    if (!snippet) return;
    snippet.is_favorite = !snippet.is_favorite;
    renderSnippets(allSnippets.filter(s => currentFilter === 'all' || s.language === currentFilter));
    try {
        const res = await fetch(API_BASE + 'update.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, is_favorite: snippet.is_favorite })
        });
        const result = await res.json();
        if (!result.success) {
            showToast('فشل تحديث المفضلة', 'error');
            snippet.is_favorite = !snippet.is_favorite;
            renderSnippets(allSnippets);
        }
    } catch (err) {
        showToast('فشل الاتصال', 'error');
        snippet.is_favorite = !snippet.is_favorite;
        renderSnippets(allSnippets);
    }
}

function copyFullSnippet(id) {
    const snippet = allSnippets.find(s => s.id === id);
    if (!snippet) return;
    copyToClipboard(snippet.code);
}

function copySnippet(id) {
    copyFullSnippet(id);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('📋 تم نسخ الكود إلى الحافظة!', 'success');
        showLocalNotification('📋 نسخ', 'تم نسخ الكود بنجاح!');
    }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
        showToast('📋 تم نسخ الكود!', 'success');
    });
}

// ============================================
// المودال (Modal)
// ============================================
function openModal(title, snippet = null) {
    modalTitle.textContent = title;
    snippetForm.reset();
    editId.value = '';
    if (snippet) {
        editId.value = snippet.id;
        snippetTitle.value = snippet.title;
        snippetLanguage.value = snippet.language;
        snippetCode.value = snippet.code;
        snippetDesc.value = snippet.description || '';
        snippetTags.value = (snippet.tags || []).join(', ');
    }
    modalOverlay.classList.add('active');
}

function closeModal() {
    modalOverlay.classList.remove('active');
    snippetForm.reset();
    editId.value = '';
}

openAddBtn.addEventListener('click', () => openModal('إضافة كود جديد'));
closeModalBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

function editSnippet(id) {
    const snippet = allSnippets.find(s => s.id === id);
    if (!snippet) {
        showToast('الكود غير موجود', 'error');
        return;
    }
    openModal('تعديل الكود', snippet);
}

snippetForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = editId.value;
    const data = {
        user_id: 1,
        title: snippetTitle.value.trim(),
        language: snippetLanguage.value,
        code: snippetCode.value,
        description: snippetDesc.value.trim(),
        tags: snippetTags.value.split(',').map(t => t.trim()).filter(t => t)
    };

    if (id) {
        data.id = parseInt(id);
        try {
            const res = await fetch(API_BASE + 'update.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (result.success) {
                showToast('✅ تم التحديث بنجاح', 'success');
                closeModal();
                fetchSnippets();
                showLocalNotification('✅ تم التعديل!', `تم تحديث الكود "${data.title}"`);
            } else {
                showToast('❌ ' + result.message, 'error');
            }
        } catch (err) {
            showToast('فشل التحديث', 'error');
        }
    } else {
        await addSnippet(data);
    }
});

// ============================================
// تشغيل التطبيق
// ============================================
fetchSnippets();

// جعل دالة التصدير متاحة عالمياً للاستخدام من الـ HTML
window.exportSnippets = exportSnippets;