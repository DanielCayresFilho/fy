# Fy - Sistema de Gestão Financeira Pessoal

Sistema completo de gestão financeira pessoal desenvolvido com Laravel 11, PostgreSQL e Docker.

## Tecnologias

- Laravel 11
- PostgreSQL 16
- Docker & Docker Compose
- JWT Authentication (Argon2id)
- Eloquent ORM
- Nginx

## Funcionalidades

- Autenticação segura com JWT e Argon2id
- Gestão de contas fixas (luz, internet, etc)
- Gestão de contas variáveis (mercado, parcelas, etc)
- Gestão de cartões de crédito
- Gestão de compras no crédito
- Registro de entradas de dinheiro (salários)
- Sistema de movimentação mensal
- Dashboard completo com resumo financeiro
- Cálculo de saldo disponível
- Cálculo de limite disponível nos cartões
- Controle de contas pagas, pendentes e atrasadas

## Instalação

### Pré-requisitos

- Docker Desktop instalado e rodando
- Git

### Passo a Passo

1. Clone o repositório (ou já está na pasta):
```bash
cd D:\Fy
```

2. Inicie o Docker Desktop

3. Suba os containers:
```bash
docker-compose up -d
```

4. Instale as dependências do Composer:
```bash
docker-compose exec app composer install
```

5. Gere a chave da aplicação:
```bash
docker-compose exec app php artisan key:generate
```

6. Gere a chave JWT:
```bash
docker-compose exec app php artisan jwt:secret
```

7. Execute as migrations:
```bash
docker-compose exec app php artisan migrate
```

8. A aplicação estará disponível em: `http://localhost:8000`

## Estrutura do Banco de Dados

### Tabelas

- `users` - Usuários do sistema
- `account_fixes` - Contas fixas mensais
- `accounts_variable` - Contas variáveis/parceladas
- `credit_cards` - Cartões de crédito
- `account_credits` - Compras no crédito
- `money_entries` - Entradas de dinheiro
- `month_movimentations` - Movimentações mensais

## API Endpoints

### Autenticação

#### Registrar
```
POST /api/auth/register
{
    "nome": "João Silva",
    "email": "joao@example.com",
    "password": "senha123",
    "password_confirmation": "senha123"
}
```

#### Login
```
POST /api/auth/login
{
    "email": "joao@example.com",
    "password": "senha123"
}
```

#### Logout
```
POST /api/auth/logout
Headers: Authorization: Bearer {token}
```

#### Refresh Token
```
POST /api/auth/refresh
Headers: Authorization: Bearer {token}
```

#### Obter usuário autenticado
```
GET /api/auth/me
Headers: Authorization: Bearer {token}
```

### Dashboard

#### Dashboard completo
```
GET /api/dashboard?month=12&year=2024
Headers: Authorization: Bearer {token}
```

#### Saldo
```
GET /api/dashboard/balance?month=12&year=2024
Headers: Authorization: Bearer {token}
```

#### Cartões de crédito
```
GET /api/dashboard/credit-cards
Headers: Authorization: Bearer {token}
```

#### Análise anual
```
GET /api/dashboard/yearly-analysis?year=2024
Headers: Authorization: Bearer {token}
```

### Contas Fixas

```
GET    /api/account-fixes          - Listar todas
POST   /api/account-fixes          - Criar nova
GET    /api/account-fixes/{id}     - Ver detalhes
PUT    /api/account-fixes/{id}     - Atualizar
DELETE /api/account-fixes/{id}     - Excluir
```

**Exemplo de criação:**
```json
{
    "name": "Internet",
    "vencible_at": "2024-12-15",
    "price": 99.90
}
```

### Contas Variáveis

```
GET    /api/account-variables              - Listar todas
POST   /api/account-variables              - Criar nova
GET    /api/account-variables/{id}         - Ver detalhes
PUT    /api/account-variables/{id}         - Atualizar
DELETE /api/account-variables/{id}         - Excluir
POST   /api/account-variables/{id}/pay-installment - Pagar parcela
```

**Exemplo de criação:**
```json
{
    "name": "Mercado",
    "vencible_at": "2024-12-20",
    "price": 500.00,
    "quantity": 3,
    "qt_payed": 0
}
```

### Cartões de Crédito

```
GET    /api/credit-cards          - Listar todos
POST   /api/credit-cards          - Criar novo
GET    /api/credit-cards/{id}     - Ver detalhes
PUT    /api/credit-cards/{id}     - Atualizar
DELETE /api/credit-cards/{id}     - Excluir
```

**Exemplo de criação:**
```json
{
    "name": "Nubank",
    "vencible_at": "2024-12-10",
    "total_limite": 5000.00
}
```

### Contas de Crédito

```
GET    /api/account-credits              - Listar todas
POST   /api/account-credits              - Criar nova
GET    /api/account-credits/{id}         - Ver detalhes
PUT    /api/account-credits/{id}         - Atualizar
DELETE /api/account-credits/{id}         - Excluir
POST   /api/account-credits/{id}/pay-installment - Pagar parcela
```

**Exemplo de criação:**
```json
{
    "card_id": 1,
    "name": "Televisão",
    "total_price": 2400.00,
    "installments": 12
}
```

### Entradas de Dinheiro

```
GET    /api/money-entries          - Listar todas
POST   /api/money-entries          - Criar nova
GET    /api/money-entries/{id}     - Ver detalhes
PUT    /api/money-entries/{id}     - Atualizar
DELETE /api/money-entries/{id}     - Excluir
```

**Exemplo de criação:**
```json
{
    "name": "Salário",
    "entry_date": "2024-12-05",
    "amount": 5000.00
}
```

### Movimentações Mensais

```
GET  /api/month-movimentations?month=12&year=2024    - Listar movimentações
POST /api/month-movimentations/generate              - Gerar movimentações do mês
POST /api/month-movimentations/{id}/pay              - Marcar como paga
POST /api/month-movimentations/update-late           - Atualizar contas atrasadas
GET  /api/month-movimentations/summary               - Resumo do mês
```

**Gerar movimentações do mês:**
```json
POST /api/month-movimentations/generate
{
    "month": 12,
    "year": 2024
}
```

**Marcar como paga:**
```json
POST /api/month-movimentations/{id}/pay
{
    "payment_date": "2024-12-15"
}
```

## Fluxo de Uso Recomendado

1. **Registrar-se e fazer login** para obter o token JWT
2. **Cadastrar cartões de crédito** (se tiver)
3. **Cadastrar contas fixas** (luz, internet, aluguel, etc)
4. **Cadastrar contas variáveis** (parcelas de compras à vista, etc)
5. **Cadastrar compras no crédito** (compras parceladas no cartão)
6. **Cadastrar entradas de dinheiro** (salários, rendas extras)
7. **Gerar movimentações mensais** para ter controle do que precisa pagar
8. **Marcar contas como pagas** conforme for pagando
9. **Acompanhar o dashboard** para ver saldo, limite disponível, etc

## Comandos Úteis

### Docker

```bash
# Subir containers
docker-compose up -d

# Parar containers
docker-compose down

# Ver logs
docker-compose logs -f

# Acessar container da aplicação
docker-compose exec app bash

# Acessar PostgreSQL
docker-compose exec db psql -U fy_user -d fy_database
```

### Artisan

```bash
# Executar migrations
docker-compose exec app php artisan migrate

# Limpar cache
docker-compose exec app php artisan cache:clear

# Criar migration
docker-compose exec app php artisan make:migration nome_da_migration

# Criar controller
docker-compose exec app php artisan make:controller NomeController
```

## Segurança

- Senhas criptografadas com **Argon2id** (algoritmo mais seguro)
- Autenticação via **JWT** (JSON Web Tokens)
- Middleware de autenticação em todas as rotas protegidas
- Validação de dados em todos os endpoints
- Proteção contra SQL Injection via Eloquent ORM

## Estrutura de Pastas

```
Fy/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── DashboardController.php
│   │   │   ├── AccountFixController.php
│   │   │   ├── AccountVariableController.php
│   │   │   ├── CreditCardController.php
│   │   │   ├── AccountCreditController.php
│   │   │   ├── MoneyEntryController.php
│   │   │   └── MonthMovimentationController.php
│   │   └── Middleware/
│   │       └── JwtMiddleware.php
│   └── Models/
│       ├── User.php
│       ├── AccountFix.php
│       ├── AccountVariable.php
│       ├── CreditCard.php
│       ├── AccountCredit.php
│       ├── MoneyEntry.php
│       └── MonthMovimentation.php
├── config/
├── database/
│   └── migrations/
├── routes/
│   ├── api.php
│   └── web.php
├── docker/
│   └── nginx/
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

## Licença

MIT
