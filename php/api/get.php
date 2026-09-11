<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$dbFile = '../../data/database.json';
$jsonData = file_get_contents($dbFile);
$data = json_decode($jsonData, true);

// نرجع جميع الأكواد (أو يمكن تصفيتها حسب user_id إذا أردت)
echo json_encode(['success' => true, 'snippets' => $data['snippets']]);
?>