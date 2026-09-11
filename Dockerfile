FROM php:8.2-apache

# تثبيت جميع المكتبات المطلوبة لبناء امتدادات PHP
RUN apt-get update && apt-get install -y \
    libonig-dev \
    zlib1g-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libwebp-dev \
    libzip-dev \
    libxml2-dev \
    libcurl4-openssl-dev \
    && rm -rf /var/lib/apt/lists/*

# تفعيل mod_rewrite
RUN a2enmod rewrite

# تكوين GD مع دعم JPEG و FreeType
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp

# تثبيت امتدادات PHP
RUN docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd zip

# نسخ ملفات المشروع
COPY . /var/www/html/

# ضبط الصلاحيات
RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html

# تفعيل AllowOverride لـ .htaccess
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

EXPOSE 80
CMD ["apache2-foreground"]