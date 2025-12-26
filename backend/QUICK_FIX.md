# 🔥 FIX RÁPIDO - Erro 502 + CORS

## 🎯 O que foi corrigido?

### Problema identificado:
- ❌ Container tinha apenas PHP-FPM (não responde HTTP)
- ❌ Coolify esperava resposta HTTP na porta 80 → **502**
- ❌ CORS era consequência do 502

### Solução implementada:
- ✅ Adicionado nginx ao Dockerfile
- ✅ Configurado nginx + php-fpm no mesmo container
- ✅ Script de inicialização automática
- ✅ CORS configurado corretamente

## 🚀 Como aplicar a correção

### 1. Commit e Push das alterações

```bash
cd backend
git add .
git commit -m "fix: add nginx to Dockerfile for Coolify deployment"
git push
```

### 2. No Coolify - Configurar a porta

⚠️ **MUITO IMPORTANTE:**

1. Vá em **Settings** da sua aplicação
2. Procure **Port** ou **Exposed Port**
3. Configure como **`80`** (ou a porta que o Coolify usa: 80, 84, 87, etc)
4. Salve

**Nota**: O container internamente sempre usa porta 80. O Coolify mapeia automaticamente!

### 3. Configurar variáveis de ambiente

**IMPORTANTE:** Coolify injeta as variáveis direto no container, Laravel lê automaticamente!

**Opção A - Gerar secrets localmente (recomendado):**
```bash
# Gerar APP_KEY
php -r "echo 'base64:' . base64_encode(random_bytes(32)) . PHP_EOL;"

# Gerar JWT_SECRET
openssl rand -base64 64
```

**Opção B - Deixar vazio (container gera e mostra no log)**

No Coolify, configure:

```env
# Secrets (use os gerados ou deixe vazio)
APP_KEY=base64:XXXXX
JWT_SECRET=YYYYY

# OBRIGATÓRIO
CORS_ALLOWED_ORIGINS=https://fy.covenos.com.br
DB_HOST=seu-postgres-host-interno
DB_DATABASE=fy_database
DB_USERNAME=fy_user
DB_PASSWORD=sua-senha
APP_URL=https://fyapi.covenos.com.br
```

**Veja `COOLIFY_SETUP.md` para lista completa de variáveis!**

### 4. Redeploy

1. No Coolify, clique em **Redeploy** ou **Force Rebuild**
2. Aguarde 2-5 minutos
3. Verifique os logs

### 5. Verificar se funcionou

```bash
# Deve retornar 200:
curl https://fyapi.covenos.com.br/up

# Teste de registro:
curl -X POST https://fyapi.covenos.com.br/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456","password_confirmation":"123456"}'
```

## 📁 Arquivos modificados/criados:

- ✏️ `Dockerfile` - Adicionado nginx + supervisor
- 📄 `docker/nginx/nginx.conf` - Config principal do nginx
- ✏️ `docker/nginx/default.conf` - Site config (atualizado)
- 📄 `docker/supervisor/supervisord.conf` - Gerencia nginx + php-fpm
- 📄 `docker/start.sh` - Script de inicialização
- 📄 `.env.production` - Template de variáveis
- 📄 `.dockerignore` - Otimização de build
- 📄 `COOLIFY_DEPLOY.md` - Guia completo

## ✅ Checklist pós-deploy:

- [ ] Porta alterada para `80` no Coolify
- [ ] Variável `CORS_ALLOWED_ORIGINS` configurada
- [ ] Credenciais do banco configuradas
- [ ] Redeploy realizado
- [ ] `/up` retorna 200
- [ ] `/api/auth/register` funciona
- [ ] Frontend conecta sem erro CORS

## 🆘 Ainda com problemas?

Veja os logs:
```bash
docker logs nome-do-container-no-coolify
```

Procure por:
- ✅ `Starting nginx and php-fpm via supervisor...`
- ✅ `Database connection successful!`
- ❌ Qualquer erro em vermelho

---

**Leia `COOLIFY_DEPLOY.md` para guia detalhado!**
