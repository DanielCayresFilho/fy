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
    php artisan jwt:secret --force
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
php artisan view:cache

# Garantir permissões corretas
echo "🔒 Setting permissions..."
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

echo "✅ Laravel setup complete!"
echo "🌐 Starting nginx and php-fpm via supervisor..."

# Iniciar supervisor
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
