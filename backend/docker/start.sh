#!/bin/bash
set -e

echo "🚀 Starting Fy API..."
echo "📋 Laravel will use environment variables from Coolify"

# Apenas criar .env mínimo se APP_KEY/JWT_SECRET não estiverem no ambiente
# Laravel vai pegar as outras vars do ambiente automaticamente!
if [ -z "$APP_KEY" ] || [ -z "$JWT_SECRET" ]; then
    echo "⚠️  APP_KEY or JWT_SECRET missing in environment!"
    echo "📝 Creating minimal .env to generate secrets..."

    cat > /var/www/.env << 'ENVEOF'
APP_KEY=
JWT_SECRET=
ENVEOF

    # Gerar APP_KEY se não existir
    if [ -z "$APP_KEY" ]; then
        echo "🔑 Generating APP_KEY..."
        php artisan key:generate --force
        NEW_APP_KEY=$(grep APP_KEY /var/www/.env | cut -d '=' -f2)
        export APP_KEY="$NEW_APP_KEY"
        echo ""
        echo "========================================="
        echo "⚠️  IMPORTANT: Add to Coolify env vars:"
        echo "APP_KEY=$NEW_APP_KEY"
        echo "========================================="
        echo ""
    fi

    # Gerar JWT_SECRET se não existir
    if [ -z "$JWT_SECRET" ]; then
        echo "🔐 Generating JWT_SECRET..."
        JWT_SECRET=$(openssl rand -base64 64)
        export JWT_SECRET
        echo "JWT_SECRET=$JWT_SECRET" >> /var/www/.env
        echo ""
        echo "========================================="
        echo "⚠️  IMPORTANT: Add to Coolify env vars:"
        echo "JWT_SECRET=$JWT_SECRET"
        echo "========================================="
        echo ""
    fi
else
    echo "✅ APP_KEY and JWT_SECRET found in environment"
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

# Verificar variáveis críticas
echo "🔍 Checking critical environment variables..."
if [ -z "$CORS_ALLOWED_ORIGINS" ]; then
    echo "⚠️  WARNING: CORS_ALLOWED_ORIGINS not set!"
    echo "   CORS will default to '*' (allow all)"
else
    echo "✅ CORS_ALLOWED_ORIGINS: $CORS_ALLOWED_ORIGINS"
fi

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
