FROM php:8.2-apache

# تثبيت مكتبة oniguruma (مطلوبة لامتداد mbstring فقط)
RUN apt-get update && apt-get install -y libonig-dev && rm -rf /var/lib/apt/lists/*

# تفعيل mod_rewrite
RUN a2enmod rewrite

# تثبيت امتداد mbstring فقط (لمعالجة النصوص العربية)
RUN docker-php-ext-install mbstring

# نسخ ملفات المشروع
COPY . /var/www/html/

# ضبط الصلاحيات
RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html

# تفعيل AllowOverride لـ .htaccess
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

EXPOSE 80
CMD ["apache2-foreground"]