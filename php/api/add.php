<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$dbFile = '../../data/database.json';
$jsonData = file_get_contents($dbFile);
$data = json_decode($jsonData, true);

$input = json_decode(file_get_contents('php://input'), true);

// قراءة البيانات
$userId = $input['user_id'] ?? 1; // في التطبيق الحقيقي تؤخذ من الجلسة
$title = $input['title'] ?? 'بدون عنوان';
$language = $input['language'] ?? 'نص';
$code = $input['code'] ?? '';
$description = $input['description'] ?? '';
$tags = $input['tags'] ?? [];

// معالجة الوسوم (إذا كانت نصاً، نحولها إلى مصفوفة)
if (is_string($tags)) {
    $tags = array_map('trim', explode(',', $tags));
}

$newId = count($data['snippets']) > 0 ? max(array_column($data['snippets'], 'id')) + 1 : 1;

$newSnippet = [
    'id' => $newId,
    'user_id' => $userId,
    'title' => $title,
    'language' => $language,
    'code' => $code,
    'description' => $description,
    'tags' => $tags,
    'is_favorite' => false,
    'created_at' => date('Y-m-d H:i:s')
];

$data['snippets'][] = $newSnippet;
file_put_contents($dbFile, json_encode($data, JSON_PRETTY_PRINT));

echo json_encode(['success' => true, 'message' => 'تم حفظ الكود بنجاح', 'snippet' => $newSnippet]);
?>