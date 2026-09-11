<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// المسار النسبي من ملف books.php (الموجود في php/api/) إلى مجلد books في الجذر
$booksDir = '../../books/';

if (!is_dir($booksDir)) {
    echo json_encode(['success' => false, 'message' => 'مجلد الكتب غير موجود']);
    exit;
}

$files = scandir($booksDir);
$books = [];

foreach ($files as $file) {
    if ($file !== '.' && $file !== '..' && !is_dir($booksDir . $file)) {
        $ext = pathinfo($file, PATHINFO_EXTENSION);
        if (in_array(strtolower($ext), ['pdf', 'epub', 'mobi', 'docx', 'txt'])) {
            // استخدام مسار نسبي بسيط يعمل على أي استضافة
            $books[] = [
                'name' => $file,
                'size' => filesize($booksDir . $file),
                'url' => './books/' . $file  // <-- تم التعديل: مسار نسبي
            ];
        }
    }
}

echo json_encode(['success' => true, 'books' => $books]);
?>