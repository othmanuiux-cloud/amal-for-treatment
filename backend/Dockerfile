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

RUN echo '<VirtualHost *:80>' > /etc/apache2/sites-available/000-default.conf && \
    echo '    DocumentRoot /var/www/html/public' >> /etc/apache2/sites-available/000-default.conf && \
    echo '    <Directory /var/www/html/public>' >> /etc/apache2/sites-available/000-default.conf && \
    echo '        Options -Indexes +FollowSymLinks' >> /etc/apache2/sites-available/000-default.conf && \
    echo '        AllowOverride All' >> /etc/apache2/sites-available/000-default.conf && \
    echo '        Require all granted' >> /etc/apache2/sites-available/000-default.conf && \
    echo '    </Directory>' >> /etc/apache2/sites-available/000-default.conf && \
    echo '</VirtualHost>' >> /etc/apache2/sites-available/000-default.conf

COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock* ./

RUN COMPOSER_MEMORY_LIMIT=-1 composer install \
    --optimize-autoloader \
    --no-dev \
    --no-interaction \
    --no-progress \
    --ignore-platform-reqs \
    --no-scripts

COPY . .

RUN php artisan package:discover --ansi || true

RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

RUN php artisan migrate --force || true

RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache || true

EXPOSE 80

CMD ["apache2-foreground"]