# 🚀 Setup Rápido Coolify - Fy API

## ✅ Como funciona:

**Laravel lê variáveis de ambiente automaticamente!**
- Configure TUDO no Coolify (Environment Variables)
- **NÃO precisa** de arquivo `.env` no container
- O script só gera `APP_KEY` e `JWT_SECRET` se você não configurar

## 📋 Passo a passo:

### 1️⃣ Gere os secrets no seu PC (uma vez só):

```bash
# No diretório backend
cd D:\Fy\backend

# Gerar APP_KEY
php -r "echo 'base64:' . base64_encode(random_bytes(32)) . PHP_EOL;"

# Gerar JWT_SECRET
openssl rand -base64 64
```

Copia esses valores!

### 2️⃣ No Coolify - Configure TODAS as variáveis:

Vá em **Environment Variables** e adicione:

```env
# ====== APP ======
APP_NAME=Fy
APP_ENV=production
APP_DEBUG=false
APP_URL=https://fyapi.covenos.com.br

# ====== SECRETS (use os gerados acima!) ======
APP_KEY=base64:XXXXX_COLE_AQUI_XXXXX
JWT_SECRET=YYYYY_COLE_AQUI_YYYYY

# ====== BANCO DE DADOS ======
DB_CONNECTION=pgsql
DB_HOST=nome-do-postgres-no-coolify
DB_PORT=5432
DB_DATABASE=fy_database
DB_USERNAME=fy_user
DB_PASSWORD=sua_senha_segura

# ====== CORS - MUITO IMPORTANTE! ======
CORS_ALLOWED_ORIGINS=https://fy.covenos.com.br
CORS_SUPPORTS_CREDENTIALS=false
CORS_MAX_AGE=3600

# ====== JWT ======
JWT_ALGO=HS256
JWT_TTL=60

# ====== CACHE/SESSION ======
CACHE_DRIVER=file
SESSION_DRIVER=file
SESSION_LIFETIME=120
QUEUE_CONNECTION=sync

# ====== LOGS ======
LOG_CHANNEL=stack
LOG_LEVEL=error
```

### 3️⃣ Configure a aplicação:

- **Port**: `80`
- **Build Pack**: Dockerfile
- **Domínio**: `fyapi.covenos.com.br` (com SSL ativado)

### 4️⃣ Deploy:

1. Commit e push do código
2. No Coolify: **Deploy**
3. Aguarde 2-5 minutos
4. Veja os logs

### 5️⃣ Verificar:

```bash
# Deve retornar 200
curl https://fyapi.covenos.com.br/up

# Testar registro
curl -X POST https://fyapi.covenos.com.br/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@test.com",
    "password": "123456",
    "password_confirmation": "123456"
  }'
```

## 🔄 Se NÃO quiser gerar os secrets manualmente:

**Deixe `APP_KEY` e `JWT_SECRET` vazios no Coolify!**

O container vai:
1. Gerar automaticamente
2. Mostrar nos logs assim:

```
=========================================
⚠️  IMPORTANT: Add to Coolify env vars:
APP_KEY=base64:XXXXXXXXX
=========================================
```

3. **Copie do log e adicione no Coolify**
4. **Redeploy** para aplicar

## ⚠️ IMPORTANTE:

- **TODOS os outros valores** (DB_HOST, CORS, etc) devem estar no Coolify
- O Laravel pega direto das env vars, não precisa de .env
- Só APP_KEY e JWT_SECRET podem ser auto-gerados

## 🐛 Troubleshooting:

### CORS ainda não funciona:
- Verifique `CORS_ALLOWED_ORIGINS` no Coolify
- Tem que ser **exatamente** o domínio do frontend (com https://)
- Sem barra no final!

### Erro de conexão com banco:
- Verifique `DB_HOST` - deve ser o nome interno do postgres no Coolify
- Teste: `docker exec -it container-name php artisan db:show`

### 502 ainda acontece:
- Verifique se porta está como `80`
- Veja os logs: `docker logs container-name`
- Deve aparecer: `Starting nginx and php-fpm via supervisor...`

---

**Pronto! Agora suas variáveis do Coolify servem pra tudo!** 🎉
