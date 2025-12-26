# Coleção de Endpoints - Fy API

## Variáveis
```
BASE_URL = http://localhost:8000/api
TOKEN = (obtenha após login)
```

## Autenticação

### Registrar
```http
POST {{BASE_URL}}/auth/register
Content-Type: application/json

{
    "nome": "João Silva",
    "email": "joao@example.com",
    "password": "senha123",
    "password_confirmation": "senha123"
}
```

### Login
```http
POST {{BASE_URL}}/auth/login
Content-Type: application/json

{
    "email": "joao@example.com",
    "password": "senha123"
}
```

### Logout
```http
POST {{BASE_URL}}/auth/logout
Authorization: Bearer {{TOKEN}}
```

### Refresh Token
```http
POST {{BASE_URL}}/auth/refresh
Authorization: Bearer {{TOKEN}}
```

### Obter Usuário Autenticado
```http
GET {{BASE_URL}}/auth/me
Authorization: Bearer {{TOKEN}}
```

## Dashboard

### Dashboard Completo
```http
GET {{BASE_URL}}/dashboard?month=12&year=2024
Authorization: Bearer {{TOKEN}}
```

### Saldo
```http
GET {{BASE_URL}}/dashboard/balance?month=12&year=2024
Authorization: Bearer {{TOKEN}}
```

### Cartões de Crédito (Dashboard)
```http
GET {{BASE_URL}}/dashboard/credit-cards
Authorization: Bearer {{TOKEN}}
```

### Análise Anual
```http
GET {{BASE_URL}}/dashboard/yearly-analysis?year=2024
Authorization: Bearer {{TOKEN}}
```

## Contas Fixas

### Listar
```http
GET {{BASE_URL}}/account-fixes
Authorization: Bearer {{TOKEN}}
```

### Criar
```http
POST {{BASE_URL}}/account-fixes
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "name": "Internet",
    "vencible_at": "2024-12-15",
    "price": 99.90
}
```

### Ver Detalhes
```http
GET {{BASE_URL}}/account-fixes/1
Authorization: Bearer {{TOKEN}}
```

### Atualizar
```http
PUT {{BASE_URL}}/account-fixes/1
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "name": "Internet Fibra",
    "price": 119.90
}
```

### Excluir
```http
DELETE {{BASE_URL}}/account-fixes/1
Authorization: Bearer {{TOKEN}}
```

## Contas Variáveis

### Listar
```http
GET {{BASE_URL}}/account-variables
Authorization: Bearer {{TOKEN}}
```

### Criar
```http
POST {{BASE_URL}}/account-variables
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "name": "Mercado",
    "vencible_at": "2024-12-20",
    "price": 500.00,
    "quantity": 3,
    "qt_payed": 0
}
```

### Ver Detalhes
```http
GET {{BASE_URL}}/account-variables/1
Authorization: Bearer {{TOKEN}}
```

### Atualizar
```http
PUT {{BASE_URL}}/account-variables/1
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "qt_payed": 1
}
```

### Excluir
```http
DELETE {{BASE_URL}}/account-variables/1
Authorization: Bearer {{TOKEN}}
```

### Pagar Parcela
```http
POST {{BASE_URL}}/account-variables/1/pay-installment
Authorization: Bearer {{TOKEN}}
```

## Cartões de Crédito

### Listar
```http
GET {{BASE_URL}}/credit-cards
Authorization: Bearer {{TOKEN}}
```

### Criar
```http
POST {{BASE_URL}}/credit-cards
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "name": "Nubank",
    "vencible_at": "2024-12-10",
    "total_limite": 5000.00
}
```

### Ver Detalhes
```http
GET {{BASE_URL}}/credit-cards/1
Authorization: Bearer {{TOKEN}}
```

### Atualizar
```http
PUT {{BASE_URL}}/credit-cards/1
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "total_limite": 6000.00
}
```

### Excluir
```http
DELETE {{BASE_URL}}/credit-cards/1
Authorization: Bearer {{TOKEN}}
```

## Contas de Crédito

### Listar
```http
GET {{BASE_URL}}/account-credits
Authorization: Bearer {{TOKEN}}
```

### Criar
```http
POST {{BASE_URL}}/account-credits
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "card_id": 1,
    "name": "Televisão Samsung",
    "total_price": 2400.00,
    "installments": 12
}
```

### Ver Detalhes
```http
GET {{BASE_URL}}/account-credits/1
Authorization: Bearer {{TOKEN}}
```

### Atualizar
```http
PUT {{BASE_URL}}/account-credits/1
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "name": "Televisão Samsung 55'"
}
```

### Excluir
```http
DELETE {{BASE_URL}}/account-credits/1
Authorization: Bearer {{TOKEN}}
```

### Pagar Parcela
```http
POST {{BASE_URL}}/account-credits/1/pay-installment
Authorization: Bearer {{TOKEN}}
```

## Entradas de Dinheiro

### Listar
```http
GET {{BASE_URL}}/money-entries
Authorization: Bearer {{TOKEN}}
```

### Criar
```http
POST {{BASE_URL}}/money-entries
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "name": "Salário",
    "entry_date": "2024-12-05",
    "amount": 5000.00
}
```

### Ver Detalhes
```http
GET {{BASE_URL}}/money-entries/1
Authorization: Bearer {{TOKEN}}
```

### Atualizar
```http
PUT {{BASE_URL}}/money-entries/1
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "amount": 5500.00
}
```

### Excluir
```http
DELETE {{BASE_URL}}/money-entries/1
Authorization: Bearer {{TOKEN}}
```

## Movimentações Mensais

### Listar Movimentações
```http
GET {{BASE_URL}}/month-movimentations?month=12&year=2024
Authorization: Bearer {{TOKEN}}
```

### Gerar Movimentações do Mês
```http
POST {{BASE_URL}}/month-movimentations/generate
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "month": 12,
    "year": 2024
}
```

### Marcar como Paga
```http
POST {{BASE_URL}}/month-movimentations/1/pay
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "payment_date": "2024-12-15"
}
```

### Atualizar Contas Atrasadas
```http
POST {{BASE_URL}}/month-movimentations/update-late
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "month": 12,
    "year": 2024
}
```

### Resumo do Mês
```http
GET {{BASE_URL}}/month-movimentations/summary?month=12&year=2024
Authorization: Bearer {{TOKEN}}
```
