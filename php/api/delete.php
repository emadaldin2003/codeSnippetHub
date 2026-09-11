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
foreach ($data['snippets'] as $index => $snippet) {
    if ($snippet['id'] == $id) {
        unset($data['snippets'][$index]);
        $found = true;
        break;
    }
}

if ($found) {
    // إعادة ترقيم المصفوفة
    $data['snippets'] = array_values($data['snippets']);
    file_put_contents($dbFile, json_encode($data, JSON_PRETTY_PRINT));
    echo json_encode(['success' => true, 'message' => 'تم حذف الكود بنجاح']);
} else {
    echo json_encode(['success' => false, 'message' => 'الكود غير موجود']);
}
?>