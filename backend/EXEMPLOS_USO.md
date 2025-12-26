# Exemplos de Uso - Fy API

## Cenário 1: Primeiro Uso

### 1. Criar sua conta
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Silva",
    "email": "maria@example.com",
    "password": "senha123",
    "password_confirmation": "senha123"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "user": {
    "id": 1,
    "nome": "Maria Silva",
    "email": "maria@example.com"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

Guarde o token retornado!

### 2. Fazer login (próximas vezes)
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@example.com",
    "password": "senha123"
  }'
```

## Cenário 2: Cadastrar suas Finanças

### 1. Cadastrar seus cartões de crédito
```bash
# Cartão 1
curl -X POST http://localhost:8000/api/credit-cards \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nubank",
    "vencible_at": "2024-12-10",
    "total_limite": 5000.00
  }'

# Cartão 2
curl -X POST http://localhost:8000/api/credit-cards \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Itaú",
    "vencible_at": "2024-12-15",
    "total_limite": 3000.00
  }'
```

### 2. Cadastrar contas fixas mensais
```bash
# Internet
curl -X POST http://localhost:8000/api/account-fixes \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Internet Fibra",
    "vencible_at": "2024-12-15",
    "price": 99.90
  }'

# Luz
curl -X POST http://localhost:8000/api/account-fixes \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Conta de Luz",
    "vencible_at": "2024-12-20",
    "price": 150.00
  }'

# Aluguel
curl -X POST http://localhost:8000/api/account-fixes \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Aluguel",
    "vencible_at": "2024-12-05",
    "price": 1200.00
  }'
```

### 3. Cadastrar compras parceladas (contas variáveis)
```bash
# Geladeira parcelada
curl -X POST http://localhost:8000/api/account-variables \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Geladeira",
    "vencible_at": "2024-12-10",
    "price": 300.00,
    "quantity": 10,
    "qt_payed": 2
  }'
```

### 4. Cadastrar compras no crédito
```bash
# Notebook no cartão
curl -X POST http://localhost:8000/api/account-credits \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "card_id": 1,
    "name": "Notebook Dell",
    "total_price": 3600.00,
    "installments": 12
  }'

# Sofá no cartão
curl -X POST http://localhost:8000/api/account-credits \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "card_id": 2,
    "name": "Sofá 3 lugares",
    "total_price": 1800.00,
    "installments": 6
  }'
```

### 5. Cadastrar suas entradas de dinheiro
```bash
# Salário
curl -X POST http://localhost:8000/api/money-entries \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Salário CLT",
    "entry_date": "2024-12-05",
    "amount": 5000.00
  }'

# Freela
curl -X POST http://localhost:8000/api/money-entries \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Projeto Freelancer",
    "entry_date": "2024-12-15",
    "amount": 1500.00
  }'
```

## Cenário 3: Controle Mensal

### 1. Gerar movimentações do mês
```bash
curl -X POST http://localhost:8000/api/month-movimentations/generate \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "month": 12,
    "year": 2024
  }'
```

**Resposta:**
```json
{
  "success": true,
  "message": "Movimentações do mês geradas com sucesso",
  "data": [
    {
      "id": 1,
      "account_type": "fix",
      "account_name": "Internet Fibra",
      "amount": "99.90",
      "status": "pending",
      "due_date": "2024-12-15"
    },
    {
      "id": 2,
      "account_type": "fix",
      "account_name": "Conta de Luz",
      "amount": "150.00",
      "status": "pending",
      "due_date": "2024-12-20"
    }
    // ... mais contas
  ]
}
```

### 2. Ver resumo do mês
```bash
curl -X GET "http://localhost:8000/api/month-movimentations/summary?month=12&year=2024" \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "month": 12,
    "year": 2024,
    "summary": {
      "total_amount": "2149.90",
      "paid_amount": "0.00",
      "pending_amount": "2149.90",
      "late_amount": "0.00"
    },
    "count": {
      "total": 8,
      "paid": 0,
      "pending": 8,
      "late": 0
    }
  }
}
```

### 3. Marcar contas como pagas
```bash
# Pagar internet
curl -X POST http://localhost:8000/api/month-movimentations/1/pay \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "payment_date": "2024-12-15"
  }'

# Pagar luz
curl -X POST http://localhost:8000/api/month-movimentations/2/pay \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "payment_date": "2024-12-20"
  }'
```

### 4. Ver dashboard completo
```bash
curl -X GET "http://localhost:8000/api/dashboard?month=12&year=2024" \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "balance": {
      "total_income": "6500.00",
      "total_expenses": "2149.90",
      "paid_expenses": "249.90",
      "pending_expenses": "1900.00",
      "current_balance": "6250.10",
      "projected_balance": "4350.10"
    },
    "credit_cards": [
      {
        "id": 1,
        "name": "Nubank",
        "total_limit": "5000.00",
        "used_limit": "300.00",
        "available_limit": "4700.00",
        "used_percentage": "6.00"
      },
      {
        "id": 2,
        "name": "Itaú",
        "total_limit": "3000.00",
        "used_limit": "300.00",
        "available_limit": "2700.00",
        "used_percentage": "10.00"
      }
    ],
    "monthly_summary": {
      "fixed_accounts": {
        "total": "1449.90",
        "count": 3,
        "paid": 2,
        "pending": 1,
        "late": 0
      },
      "variable_accounts": {
        "total": "300.00",
        "count": 1,
        "paid": 0,
        "pending": 1,
        "late": 0
      },
      "credit_accounts": {
        "total": "600.00",
        "count": 2,
        "paid": 0,
        "pending": 2,
        "late": 0
      }
    },
    "upcoming_bills": [
      {
        "id": 3,
        "name": "Aluguel",
        "amount": "1200.00",
        "due_date": "05/12/2024",
        "days_until_due": 3
      }
    ],
    "late_bills": []
  }
}
```

## Cenário 4: Pagar Parcelas

### Pagar parcela de conta variável
```bash
curl -X POST http://localhost:8000/api/account-variables/1/pay-installment \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Resposta:**
```json
{
  "success": true,
  "message": "Parcela paga com sucesso",
  "data": {
    "id": 1,
    "name": "Geladeira",
    "price": "300.00",
    "quantity": 10,
    "qt_payed": 3
  }
}
```

### Pagar parcela de compra no crédito
```bash
curl -X POST http://localhost:8000/api/account-credits/1/pay-installment \
  -H "Authorization: Bearer SEU_TOKEN"
```

## Cenário 5: Ver Limite Disponível

```bash
curl -X GET http://localhost:8000/api/dashboard/credit-cards \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Nubank",
      "total_limit": "5000.00",
      "used_limit": "300.00",
      "available_limit": "4700.00",
      "used_percentage": "6.00",
      "vencible_at": "10/12/2024"
    }
  ]
}
```

## Cenário 6: Análise Anual

```bash
curl -X GET "http://localhost:8000/api/dashboard/yearly-analysis?year=2024" \
  -H "Authorization: Bearer SEU_TOKEN"
```

Retorna análise completa de todos os 12 meses do ano!

## Cenário 7: Atualizar Contas Atrasadas

```bash
curl -X POST http://localhost:8000/api/month-movimentations/update-late \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "month": 12,
    "year": 2024
  }'
```

## Dicas de Uso

1. **Sempre gere as movimentações do mês** antes de começar a marcar pagamentos
2. **Atualize contas atrasadas periodicamente** para manter o controle
3. **Use o dashboard** para ter visão geral das finanças
4. **Marque contas como pagas** assim que pagar para ter saldo correto
5. **Cadastre todas as entradas de dinheiro** para ter controle preciso do saldo
6. **Verifique o limite dos cartões** antes de fazer novas compras

## Front-end Recomendado

Com esses endpoints você pode criar:

- Dashboard com cards mostrando saldo, gastos, limite disponível
- Lista de contas a pagar do mês com status (paga, pendente, atrasada)
- Gráficos de evolução mensal e anual
- Notificações de contas próximas do vencimento
- Histórico de movimentações
- Relatórios de gastos por categoria
