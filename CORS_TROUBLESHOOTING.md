# 🔧 Solução de Problemas CORS

## ⚠️ Problema Comum

Se você está vendo este erro:
```
Access to XMLHttpRequest at 'https://fyapi.covenos.com.br/auth/login' 
from origin 'https://fy.covenos.com.br' has been blocked by CORS policy
```

## ✅ Checklist de Verificação

### 1. Verifique a URL da API no Frontend

**ERRADO:**
```env
VITE_API_URL=https://fyapi.covenos.com.br
```

**CORRETO:**
```env
VITE_API_URL=https://fyapi.covenos.com.br/api
```

⚠️ **IMPORTANTE**: A URL deve terminar com `/api` porque todas as rotas do backend estão sob o prefixo `/api`.

### 2. Configure CORS no Backend

No Coolify, adicione a variável:
```env
CORS_ALLOWED_ORIGINS=https://fy.covenos.com.br
```

### 3. Limpe o Cache após Configurar

No container do backend, execute:
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

Ou faça um **rebuild completo** do container no Coolify.

### 4. Verifique se o Middleware está Aplicado

O middleware `CorsMiddleware` deve estar aplicado em `bootstrap/app.php` tanto para rotas web quanto API.

### 5. Teste a Configuração

Teste se o CORS está funcionando:

```bash
# Teste OPTIONS (preflight)
curl -X OPTIONS https://fyapi.covenos.com.br/api/auth/login \
  -H "Origin: https://fy.covenos.com.br" \
  -H "Access-Control-Request-Method: POST" \
  -v

# Você deve ver nos headers:
# Access-Control-Allow-Origin: https://fy.covenos.com.br
# Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
```

## 🎯 Solução Rápida

1. **Frontend** - Configure `VITE_API_URL` com `/api` no final:
   ```env
   VITE_API_URL=https://fyapi.covenos.com.br/api
   ```

2. **Backend** - Configure `CORS_ALLOWED_ORIGINS`:
   ```env
   CORS_ALLOWED_ORIGINS=https://fy.covenos.com.br
   ```

3. **Rebuild ambos os containers** no Coolify

4. **Teste novamente**

## 🔍 Debug

Se ainda não funcionar, verifique nos logs do backend se o middleware está sendo executado:
```bash
# No container do backend
tail -f storage/logs/laravel.log
```

E verifique se a requisição está chegando no backend corretamente.

