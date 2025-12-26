# Troubleshooting - Fy

## Problemas Comuns

### 1. Docker não inicia

**Erro:** `Cannot connect to the Docker daemon`

**Solução:**
- Certifique-se que o Docker Desktop está instalado e rodando
- No Windows, verifique se o Docker Desktop está iniciado
- Execute `docker --version` para verificar se está instalado

### 2. Porta 8000 já está em uso

**Erro:** `Port 8000 is already allocated`

**Solução:**
- Altere a porta no `docker-compose.yml`
- Linha 18: `"8000:80"` → `"8001:80"`
- Ou pare o serviço que está usando a porta 8000

### 3. Erro ao executar migrations

**Erro:** `SQLSTATE[08006] [7] could not translate host name "db"`

**Solução:**
- Aguarde alguns segundos após `docker-compose up`
- O PostgreSQL precisa de tempo para iniciar
- Execute novamente: `docker-compose exec app php artisan migrate`

### 4. Chave JWT não gerada

**Erro:** `The JWT secret is not set`

**Solução:**
```bash
docker-compose exec app php artisan jwt:secret
```

### 5. Chave da aplicação não gerada

**Erro:** `No application encryption key has been specified`

**Solução:**
```bash
docker-compose exec app php artisan key:generate
```

### 6. Permissões no Linux/Mac

**Erro:** `Permission denied`

**Solução:**
```bash
sudo chown -R $USER:$USER .
chmod -R 755 storage bootstrap/cache
```

### 7. Composer não encontrado

**Erro:** `composer: command not found`

**Solução:**
- Use via Docker: `docker-compose exec app composer install`
- Não precisa ter Composer instalado localmente

### 8. Token inválido

**Erro:** `Token invalid`

**Solução:**
- Verifique se o token está correto
- Verifique se está usando `Bearer` antes do token
- Exemplo: `Authorization: Bearer eyJ0eXAiOiJKV1Q...`
- Faça login novamente para obter novo token

### 9. Token expirado

**Erro:** `Token expired`

**Solução:**
- Use o endpoint de refresh para renovar:
```bash
curl -X POST http://localhost:8000/api/auth/refresh \
  -H "Authorization: Bearer SEU_TOKEN_EXPIRADO"
```

### 10. Erro de validação

**Erro:** `The given data was invalid`

**Solução:**
- Verifique se todos os campos obrigatórios foram enviados
- Verifique se os tipos estão corretos (string, number, date)
- Veja a resposta JSON para detalhes do erro

## Verificar se está tudo funcionando

### 1. Verificar containers
```bash
docker-compose ps
```

Deve mostrar 3 containers rodando:
- fy-app
- fy-nginx
- fy-postgres

### 2. Verificar logs
```bash
docker-compose logs -f app
```

### 3. Verificar banco de dados
```bash
docker-compose exec db psql -U fy_user -d fy_database -c "\dt"
```

Deve listar todas as tabelas criadas.

### 4. Testar endpoint público
```bash
curl http://localhost:8000
```

Deve retornar:
```json
{
  "app": "Fy - Sistema de Gestão Financeira Pessoal",
  "version": "1.0.0",
  "status": "online"
}
```

### 5. Testar registro
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste",
    "email": "teste@example.com",
    "password": "senha123",
    "password_confirmation": "senha123"
  }'
```

Se retornar sucesso com token, está tudo funcionando!

## Comandos de Debug

### Ver todas as rotas
```bash
docker-compose exec app php artisan route:list
```

### Limpar todos os caches
```bash
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan route:clear
docker-compose exec app php artisan view:clear
```

### Verificar configuração
```bash
docker-compose exec app php artisan config:show database
```

### Executar tinker (console interativo)
```bash
docker-compose exec app php artisan tinker
```

Dentro do tinker:
```php
// Verificar usuários
User::all();

// Criar usuário de teste
$user = new App\Models\User();
$user->nome = 'Teste';
$user->email = 'teste@test.com';
$user->password = 'senha123';
$user->save();
```

## Resetar Completamente

Se nada funcionar, resete tudo:

```bash
# Parar e remover containers
docker-compose down -v

# Remover vendor e cache
rm -rf vendor bootstrap/cache/*.php

# Subir novamente
docker-compose up -d

# Instalar dependências
docker-compose exec app composer install

# Gerar chaves
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan jwt:secret

# Executar migrations
docker-compose exec app php artisan migrate
```

## Performance

### Laravel está lento?

1. **Otimizar autoload:**
```bash
docker-compose exec app composer dump-autoload -o
```

2. **Cache de configuração:**
```bash
docker-compose exec app php artisan config:cache
docker-compose exec app php artisan route:cache
```

3. **Aumentar memória do PHP:**
Edite o `Dockerfile` e adicione:
```dockerfile
RUN echo "memory_limit = 512M" > /usr/local/etc/php/conf.d/memory.ini
```

## Suporte

Se nenhuma solução acima funcionou:

1. Verifique os logs: `docker-compose logs -f`
2. Verifique a versão do Docker: `docker --version`
3. Verifique se todas as portas estão livres
4. Reinicie o Docker Desktop
5. Reinicie o computador (às vezes ajuda!)

## Ambiente de Produção

Para usar em produção, altere:

1. `.env`:
```env
APP_ENV=production
APP_DEBUG=false
```

2. Use HTTPS
3. Configure backup do banco de dados
4. Use senha forte no PostgreSQL
5. Altere JWT_SECRET para valor seguro
