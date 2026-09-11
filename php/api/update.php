<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$dbFile = '../../data/database.json';
$jsonData = file_get_contents($dbFile);
$data = json_decode($jsonData, true);

$input = json_decode(file_get_contents('php://input'), true);
$id = $input['id'] ?? null;

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'معرف الكود مطلوب']);
    exit;
}

$found = false;
foreach ($data['snippets'] as &$snippet) {
    if ($snippet['id'] == $id) {
        // تحديث الحقول المرسلة فقط
        if (isset($input['title'])) $snippet['title'] = $input['title'];
        if (isset($input['language'])) $snippet['language'] = $input['language'];
        if (isset($input['code'])) $snippet['code'] = $input['code'];
        if (isset($input['description'])) $snippet['description'] = $input['description'];
        if (isset($input['tags'])) $snippet['tags'] = $input['tags'];
        if (isset($input['is_favorite'])) $snippet['is_favorite'] = $input['is_favorite'];
        
        $found = true;
        break;
    }
}

if ($found) {
    file_put_contents($dbFile, json_encode($data, JSON_PRETTY_PRINT));
    echo json_encode(['success' => true, 'message' => 'تم تحديث الكود بنجاح']);
} else {
    echo json_encode(['success' => false, 'message' => 'الكود غير موجود']);
}
?>