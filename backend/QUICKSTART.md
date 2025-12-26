# Quickstart - Fy

## Passo a Passo Rápido

### 1. Certifique-se que o Docker Desktop está rodando

### 2. Suba os containers
```bash
docker-compose up -d
```

### 3. Instale as dependências
```bash
docker-compose exec app composer install
```

### 4. Gere as chaves
```bash
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan jwt:secret
```

### 5. Execute as migrations
```bash
docker-compose exec app php artisan migrate
```

### 6. Acesse a aplicação
```
http://localhost:8000
```

## Testar a API

### 1. Registrar um usuário
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "password": "senha123",
    "password_confirmation": "senha123"
  }'
```

### 2. Fazer login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

Copie o token retornado e use nos próximos requests.

### 3. Ver dashboard
```bash
curl -X GET "http://localhost:8000/api/dashboard?month=12&year=2024" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Comandos Úteis

```bash
# Ver logs em tempo real
docker-compose logs -f

# Parar os containers
docker-compose down

# Reiniciar os containers
docker-compose restart

# Acessar o container
docker-compose exec app bash

# Limpar cache
docker-compose exec app php artisan cache:clear
```
