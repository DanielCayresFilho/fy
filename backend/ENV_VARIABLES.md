# Variáveis de Ambiente do Backend

## Variáveis Obrigatórias

```env
APP_KEY=base64:... (gerar com: php artisan key:generate)
JWT_SECRET=... (gerar com: php artisan jwt:secret)

DB_CONNECTION=pgsql
DB_HOST=seu-host-postgres
DB_PORT=5432
DB_DATABASE=nome_do_banco
DB_USERNAME=usuario
DB_PASSWORD=senha
```

## Variáveis de CORS

```env
# Permitir todas as origens (não recomendado para produção)
CORS_ALLOWED_ORIGINS=*

# Ou especificar URLs específicas (separadas por vírgula)
CORS_ALLOWED_ORIGINS=https://app.seudominio.com,https://www.seudominio.com

# Tempo de cache do preflight em segundos (opcional, padrão: 0)
CORS_MAX_AGE=3600

# Permitir credenciais nas requisições (opcional, padrão: false)
CORS_SUPPORTS_CREDENTIALS=false
```

## Variáveis Opcionais

```env
APP_NAME=Fy
APP_ENV=production
APP_DEBUG=false
APP_URL=http://localhost

SESSION_DRIVER=database
SESSION_LIFETIME=120

CACHE_STORE=database
QUEUE_CONNECTION=database

LOG_CHANNEL=stack
LOG_LEVEL=debug
```

## Exemplo Completo para Coolify

```env
APP_NAME=Fy
APP_ENV=production
APP_KEY=base64:SUA_CHAVE_AQUI
APP_DEBUG=false
APP_URL=https://api.seudominio.com

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=fy_database
DB_USERNAME=fy_user
DB_PASSWORD=senha_segura

JWT_SECRET=sua_chave_jwt_secreta_aqui

CORS_ALLOWED_ORIGINS=https://app.seudominio.com
CORS_MAX_AGE=3600
CORS_SUPPORTS_CREDENTIALS=false

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
```

