FROM php:8.2-apache

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-configure pgsql -with-pgsql=/usr/include/php/20220802 \
    && docker-php-ext-install pdo_pgsql pgsql pdo_mysql mbstring exif pcntl bcmath gd zip

RUN a2enmod rewrite

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock* ./

RUN composer install --optimize-autoloader --no-dev --ignore-platform-reqs --no-interaction

COPY . .

RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

EXPOSE 80

CMD ["apache2-foreground"]