FROM php:8.2-apache

# تفعيل mod_rewrite (مفيد للمسارات)
RUN a2enmod rewrite

# تثبيت الامتدادات المطلوبة
RUN docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# نسخ جميع ملفات المشروع إلى مجلد الويب
COPY . /var/www/html/

# منح الصلاحيات المناسبة لمجلد الكتب والبيانات
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html

# فتح المنفذ 80 (المنفذ الافتراضي لـ Apache)
EXPOSE 80

# تشغيل Apache في المقدمة
CMD ["apache2-foreground"]