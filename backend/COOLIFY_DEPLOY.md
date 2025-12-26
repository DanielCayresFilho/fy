# 🚀 Deploy Fy API no Coolify

Guia completo para fazer deploy da API Laravel no Coolify.

## 📋 Pré-requisitos

- Conta no Coolify
- Repositório Git configurado
- Banco de dados PostgreSQL (pode ser criado no próprio Coolify)

## 🔧 Configuração no Coolify

### 1️⃣ Criar o Banco de Dados

1. No Coolify, vá em **Databases** → **New Database**
2. Escolha **PostgreSQL 16**
3. Configure:
   - **Name**: `fy-postgres`
   - **Database**: `fy_database`
   - **Username**: `fy_user`
   - **Password**: Gere uma senha forte
4. Anote as credenciais!

### 2️⃣ Criar a Aplicação

1. No Coolify, vá em **Applications** → **New Application**
2. Escolha seu repositório Git
3. Configure:
   - **Branch**: `main` (ou sua branch)
   - **Build Pack**: `Dockerfile`
   - **Dockerfile**: `backend/Dockerfile` (se backend está em subpasta)
   - **Port**: `80` ⚠️ **IMPORTANTE!**

### 3️⃣ Configurar Variáveis de Ambiente

No Coolify, vá em **Environment Variables** e adicione:

```env
# Aplicação
APP_NAME=Fy
APP_ENV=production
APP_DEBUG=false
APP_URL=https://fyapi.covenos.com.br

# IMPORTANTE: Deixe vazio, será gerado automaticamente!
APP_KEY=
JWT_SECRET=

# Banco de Dados (use as credenciais criadas no passo 1)
DB_CONNECTION=pgsql
DB_HOST=fy-postgres
DB_PORT=5432
DB_DATABASE=fy_database
DB_USERNAME=fy_user
DB_PASSWORD=SUA_SENHA_AQUI

# CORS - CRÍTICO para funcionar com o frontend!
CORS_ALLOWED_ORIGINS=https://fy.covenos.com.br
CORS_SUPPORTS_CREDENTIALS=false
CORS_MAX_AGE=3600

# JWT
JWT_ALGO=HS256
JWT_TTL=60

# Cache e Session
CACHE_DRIVER=file
SESSION_DRIVER=file
SESSION_LIFETIME=120
QUEUE_CONNECTION=sync

# Logs
LOG_CHANNEL=stack
LOG_LEVEL=error
```

### 4️⃣ Configurar Domínio

1. No Coolify, vá em **Domains**
2. Adicione: `fyapi.covenos.com.br`
3. Ative **SSL/TLS** (Let's Encrypt automático)

### 5️⃣ Deploy!

1. Clique em **Deploy**
2. Aguarde o build (pode demorar 2-5 minutos na primeira vez)
3. Verifique os logs para confirmar que tudo iniciou:

```
✅ Database connection successful!
✅ Laravel setup complete!
🌐 Starting nginx and php-fpm via supervisor...
```

## 🧪 Testar a API

### Verificar se está no ar:

```bash
curl https://fyapi.covenos.com.br/up
```

Deve retornar status 200.

### Testar registro:

```bash
curl -X POST https://fyapi.covenos.com.br/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste User",
    "email": "teste@example.com",
    "password": "senha123",
    "password_confirmation": "senha123"
  }'
```

Deve retornar um token JWT.

### Testar login:

```bash
curl -X POST https://fyapi.covenos.com.br/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123"
  }'
```

## 🐛 Troubleshooting

### Erro 502 Bad Gateway

**Causa**: Container não está respondendo na porta correta.

**Solução**:
1. Verifique se a porta no Coolify está configurada como `80`
2. Verifique os logs: `docker logs fy-app`
3. Confirme que nginx iniciou: `docker exec -it fy-app ps aux | grep nginx`

### CORS não funciona

**Causa**: `CORS_ALLOWED_ORIGINS` não configurado ou incorreto.

**Solução**:
1. No Coolify, vá em **Environment Variables**
2. Confirme que `CORS_ALLOWED_ORIGINS=https://fy.covenos.com.br`
3. **Não use `http://`, apenas `https://`!**
4. Para múltiplos domínios: `https://domain1.com,https://domain2.com`
5. Faça redeploy após alterar

### APP_KEY vazio

**Causa**: APP_KEY não foi gerado.

**Solução**:
O script `start.sh` gera automaticamente. Se ainda assim não funcionar:
1. Entre no container: `docker exec -it fy-app bash`
2. Execute: `php artisan key:generate --force`
3. Reinicie o container

### Migrations não rodaram

**Causa**: Banco de dados não estava pronto ou credenciais incorretas.

**Solução**:
1. Verifique as credenciais do banco em **Environment Variables**
2. Confirme que o banco está rodando
3. Entre no container e rode manualmente:
   ```bash
   docker exec -it fy-app php artisan migrate --force
   ```

### Permissões de storage

**Causa**: Diretório storage sem permissão de escrita.

**Solução**:
```bash
docker exec -it fy-app chown -R www-data:www-data /var/www/storage
docker exec -it fy-app chmod -R 775 /var/www/storage
```

## 📊 Monitoramento

### Ver logs em tempo real:

```bash
# Logs do container
docker logs -f fy-app

# Logs do Laravel
docker exec -it fy-app tail -f storage/logs/laravel.log

# Logs do nginx
docker exec -it fy-app tail -f /var/log/nginx/error.log
```

### Verificar serviços rodando:

```bash
docker exec -it fy-app supervisorctl status
```

Deve mostrar:
```
nginx                            RUNNING
php-fpm                          RUNNING
```

## 🔄 Atualizar a aplicação

Quando fizer alterações no código:

1. Faça commit e push para o repositório
2. No Coolify, clique em **Redeploy**
3. Aguarde o build e deploy

**Nota**: As variáveis de ambiente e dados do banco serão preservados!

## ✅ Checklist Final

- [ ] Banco de dados PostgreSQL criado e rodando
- [ ] Variáveis de ambiente configuradas (especialmente CORS!)
- [ ] Porta configurada como `80`
- [ ] Domínio configurado com SSL
- [ ] Deploy realizado com sucesso
- [ ] `/up` retorna 200
- [ ] API `/api/auth/register` funciona
- [ ] Frontend consegue fazer login sem erro de CORS

## 🆘 Precisa de ajuda?

Se ainda estiver com problemas:

1. Verifique os logs: `docker logs fy-app`
2. Entre no container: `docker exec -it fy-app bash`
3. Teste conexão com banco: `php artisan db:show`
4. Verifique configurações: `php artisan config:show`

---

**Agora sua API deve estar rodando perfeitamente no Coolify!** 🎉
