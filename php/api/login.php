<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$dbFile = '../../data/database.json';
$jsonData = file_get_contents($dbFile);
$data = json_decode($jsonData, true);

$input = json_decode(file_get_contents('php://input'), true);

$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

// البحث عن المستخدم
$foundUser = null;
foreach ($data['users'] as $user) {
    if ($user['email'] === $email && $user['password'] === $password) {
        $foundUser = $user;
        break;
    }
}

if ($foundUser) {
    // نرسل بيانات المستخدم مع جلسة (بدون كلمة المرور للأمان)
    unset($foundUser['password']);
    echo json_encode(['success' => true, 'message' => 'تم تسجيل الدخول', 'user' => $foundUser]);
} else {
    echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة']);
}
?>