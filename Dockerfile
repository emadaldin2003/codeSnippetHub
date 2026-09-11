FROM php:8.2-apache

# تثبيت مكتبة oniguruma (مطلوبة لامتداد mbstring)
RUN apt-get update && apt-get install -y libonig-dev && rm -rf /var/lib/apt/lists/*

# تفعيل mod_rewrite
RUN a2enmod rewrite

# تثبيت امتدادات PHP
RUN docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# نسخ ملفات المشروع
COPY . /var/www/html/

# ضبط الصلاحيات
RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html

EXPOSE 80
CMD ["apache2-foreground"]