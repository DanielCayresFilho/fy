# Guia de Instalação - Fy

## Pré-requisitos

1. **Docker Desktop** instalado e rodando
   - Windows: https://www.docker.com/products/docker-desktop
   - Mac: https://www.docker.com/products/docker-desktop
   - Linux: https://docs.docker.com/engine/install/

2. **Git** (opcional, se quiser versionar)

## Instalação Rápida (Windows)

### Opção 1: Script Automático

1. Abra o PowerShell ou CMD na pasta do projeto
2. Execute:
```bash
setup.bat
```

3. Aguarde a instalação (pode demorar alguns minutos na primeira vez)
4. Acesse: http://localhost:8000

### Opção 2: Manual

```bash
# 1. Subir containers
docker-compose up -d

# 2. Instalar dependências
docker-compose exec app composer install

# 3. Gerar chaves
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan jwt:secret

# 4. Executar migrations
docker-compose exec app php artisan migrate
```

## Instalação Rápida (Linux/Mac)

### Opção 1: Script Automático

1. Abra o terminal na pasta do projeto
2. Dê permissão de execução:
```bash
chmod +x setup.sh
```

3. Execute:
```bash
./setup.sh
```

4. Aguarde a instalação
5. Acesse: http://localhost:8000

### Opção 2: Manual

```bash
# 1. Subir containers
docker-compose up -d

# 2. Instalar dependências
docker-compose exec app composer install

# 3. Gerar chaves
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan jwt:secret

# 4. Executar migrations
docker-compose exec app php artisan migrate

# 5. Ajustar permissões (Linux/Mac)
sudo chown -R $USER:$USER .
chmod -R 755 storage bootstrap/cache
```

## Verificar Instalação

### Windows
```bash
test-api.bat
```

### Linux/Mac
```bash
chmod +x test-api.sh
./test-api.sh
```

Se todos os testes passarem, está tudo funcionando!

## Estrutura Criada

```
Fy/
├── app/                          # Aplicação Laravel
│   ├── Http/
│   │   ├── Controllers/          # Todos os controllers
│   │   └── Middleware/           # JWT Middleware
│   └── Models/                   # Todos os models
├── config/                       # Configurações
├── database/
│   └── migrations/               # 7 migrations criadas
├── docker/
│   └── nginx/                    # Configuração Nginx
├── routes/
│   ├── api.php                   # Rotas da API
│   └── web.php                   # Rotas web
├── storage/                      # Armazenamento
├── docker-compose.yml            # Configuração Docker
├── Dockerfile                    # Imagem Docker
├── .env                          # Variáveis de ambiente
├── .env.example                  # Exemplo de .env
├── setup.bat                     # Script de instalação Windows
├── setup.sh                      # Script de instalação Linux/Mac
├── test-api.bat                  # Script de teste Windows
├── test-api.sh                   # Script de teste Linux/Mac
├── README.md                     # Documentação completa
├── QUICKSTART.md                 # Início rápido
├── API_COLLECTION.md             # Documentação dos endpoints
├── EXEMPLOS_USO.md               # Exemplos práticos
├── TROUBLESHOOTING.md            # Solução de problemas
├── INSTALACAO.md                 # Este arquivo
└── Fy.postman_collection.json    # Coleção Postman
```

## O que foi criado

### Banco de Dados (7 tabelas)
- ✅ users
- ✅ account_fixes
- ✅ accounts_variable
- ✅ credit_cards
- ✅ account_credits
- ✅ money_entries
- ✅ month_movimentations

### Models (7 models)
- ✅ User (com JWT e Argon2id)
- ✅ AccountFix
- ✅ AccountVariable
- ✅ CreditCard
- ✅ AccountCredit
- ✅ MoneyEntry
- ✅ MonthMovimentation

### Controllers (8 controllers)
- ✅ AuthController (registro, login, logout, refresh)
- ✅ AccountFixController (CRUD completo)
- ✅ AccountVariableController (CRUD + pagar parcela)
- ✅ CreditCardController (CRUD completo)
- ✅ AccountCreditController (CRUD + pagar parcela)
- ✅ MoneyEntryController (CRUD completo)
- ✅ MonthMovimentationController (gerar, listar, pagar, resumo)
- ✅ DashboardController (dashboard completo, saldo, análise anual)

### Funcionalidades
- ✅ Autenticação JWT com Argon2id
- ✅ CRUD completo para todas as entidades
- ✅ Sistema de movimentação mensal
- ✅ Dashboard com resumo financeiro
- ✅ Cálculo de saldo disponível
- ✅ Cálculo de limite disponível nos cartões
- ✅ Controle de parcelas pagas
- ✅ Marcação de contas pagas/atrasadas
- ✅ Análise anual
- ✅ Validação de dados
- ✅ Respostas padronizadas
- ✅ Proteção de rotas
- ✅ Relacionamentos entre tabelas

### Documentação
- ✅ README.md completo
- ✅ QUICKSTART.md
- ✅ API_COLLECTION.md
- ✅ EXEMPLOS_USO.md
- ✅ TROUBLESHOOTING.md
- ✅ Postman Collection
- ✅ Scripts de instalação
- ✅ Scripts de teste

## Próximos Passos

1. **Testar a API**
   - Use o Postman com a collection fornecida
   - Ou use curl conforme exemplos

2. **Cadastrar seus dados**
   - Registre-se
   - Cadastre cartões de crédito
   - Cadastre contas fixas
   - Cadastre compras parceladas
   - Cadastre entradas de dinheiro

3. **Gerar movimentações do mês**
   ```bash
   POST /api/month-movimentations/generate
   ```

4. **Acompanhar pelo dashboard**
   ```bash
   GET /api/dashboard
   ```

5. **Criar o frontend**
   - Use React, Vue, Angular ou qualquer framework
   - Conecte nos endpoints da API
   - Todos os dados estão disponíveis via JSON

## Comandos Úteis

```bash
# Ver logs
docker-compose logs -f

# Parar
docker-compose down

# Reiniciar
docker-compose restart

# Acessar container
docker-compose exec app bash

# Executar artisan
docker-compose exec app php artisan [comando]

# Acessar banco
docker-compose exec db psql -U fy_user -d fy_database
```

## Suporte

- Leia o TROUBLESHOOTING.md se tiver problemas
- Veja exemplos práticos em EXEMPLOS_USO.md
- Use a collection do Postman para testar
- Consulte a documentação completa no README.md

## Segurança

- ✅ Senhas com Argon2id (mais seguro que bcrypt)
- ✅ Autenticação JWT
- ✅ Middleware de autenticação
- ✅ Validação de dados
- ✅ Eloquent ORM (proteção contra SQL Injection)
- ✅ CORS configurado
- ✅ Variáveis de ambiente

## Performance

O sistema está otimizado com:
- Índices no banco de dados
- Eager loading nos relacionamentos
- Cache de configuração
- Docker multi-stage build
- PHP 8.3 com JIT

## Conclusão

Você agora tem um backend completo de gestão financeira pessoal!

Basta criar um frontend bonito e conectar nos endpoints. Todos os dados, cálculos e regras de negócio já estão prontos.

Bom desenvolvimento! 🚀
