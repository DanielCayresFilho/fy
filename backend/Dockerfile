FROM php:8.3-fpm

# Instalar dependências do sistema + nginx
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    zip \
    unzip \
    nginx \
    supervisor \
    && docker-php-ext-install pdo pdo_pgsql pgsql mbstring exif pcntl bcmath gd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurar diretório de trabalho
WORKDIR /var/www

# Copiar arquivos do projeto
COPY . /var/www

# Instalar dependências do Composer
RUN composer install --optimize-autoloader --no-dev --no-interaction

# Copiar configuração do nginx
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/default.conf /etc/nginx/sites-available/default

# Copiar configuração do supervisor
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Criar diretórios necessários
RUN mkdir -p /var/log/supervisor /run/php

# Configurar permissões
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache

# Criar script de inicialização inline (evita problemas de CRLF)
RUN cat > /usr/local/bin/start.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Starting Fy API..."

# Verificar se .env existe, senão copiar do example
if [ ! -f /var/www/.env ]; then
    echo "⚙️  .env not found, copying from .env.example..."
    cp /var/www/.env.example /var/www/.env
fi

# Gerar APP_KEY se não existir
if ! grep -q "APP_KEY=base64:" /var/www/.env; then
    echo "🔑 Generating APP_KEY..."
    php artisan key:generate --force
fi

# Gerar JWT_SECRET se não existir ou estiver vazio
if ! grep -q "JWT_SECRET=.*[a-zA-Z0-9]" /var/www/.env; then
    echo "🔐 Generating JWT_SECRET..."
    php artisan jwt:secret --force || echo "⚠️  JWT secret generation skipped"
fi

# Aguardar banco de dados estar pronto (máx 30 segundos)
echo "⏳ Waiting for database..."
for i in {1..30}; do
    if php artisan db:show > /dev/null 2>&1; then
        echo "✅ Database connection successful!"
        break
    fi
    echo "   Attempt $i/30 - waiting for database..."
    sleep 1
done

# Executar migrations
echo "📊 Running migrations..."
php artisan migrate --force || echo "⚠️  Migration failed or no pending migrations"

# Limpar e cachear configurações
echo "🗑️  Clearing caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "💾 Caching configurations..."
php artisan config:cache
php artisan route:cache

# Garantir permissões corretas
echo "🔒 Setting permissions..."
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

echo "✅ Laravel setup complete!"
echo "🌐 Starting nginx and php-fpm via supervisor..."

# Iniciar supervisor
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
EOF

# Dar permissão de execução
RUN chmod +x /usr/local/bin/start.sh

# Porta configurável via ENV (padrão 80)
ENV PORT=80
EXPOSE ${PORT}

# Iniciar via script
CMD ["/usr/local/bin/start.sh"]
