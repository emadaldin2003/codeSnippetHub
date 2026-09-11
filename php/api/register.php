<?php
// السماح بطلبات من نفس الموقع (لتفادي مشاكل CORS البسيطة)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// تحديد مسار ملف قاعدة البيانات
$dbFile = '../../data/database.json';

// قراءة محتويات ملف JSON الحالي
$jsonData = file_get_contents($dbFile);
$data = json_decode($jsonData, true);

// جلب البيانات المرسلة من الواجهة (JavaScript)
$input = json_decode(file_get_contents('php://input'), true);

$username = $input['username'] ?? '';
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

// التحقق البسيط: التأكد من أن البريد الإلكتروني غير مكرر
foreach ($data['users'] as $user) {
    if ($user['email'] === $email) {
        echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني مسجل مسبقاً']);
        exit;
    }
}

// إنشاء معرف جديد (أكبر معرف + 1)
$newId = count($data['users']) > 0 ? max(array_column($data['users'], 'id')) + 1 : 1;

// إضافة المستخدم الجديد
$newUser = [
    'id' => $newId,
    'username' => $username,
    'email' => $email,
    'password' => $password // في مشروع حقيقي، نستخدم password_hash()، لكن للتبسيط نتركها عادية
];

$data['users'][] = $newUser;

// حفظ البيانات مرة أخرى في ملف JSON
file_put_contents($dbFile, json_encode($data, JSON_PRETTY_PRINT));

// إرجاع رسالة نجاح
echo json_encode(['success' => true, 'message' => 'تم إنشاء الحساب بنجاح', 'user_id' => $newId]);
?>