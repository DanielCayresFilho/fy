# Guia para o Frontend - Fy

Fala dev! Então, você tem todo o backend pronto e agora precisa criar um front bonito pra isso né? Deixa eu te guiar sobre o que você precisa criar pra fazer esse sistema ficar massa!

## A Ideia Geral

O Fy é um sistema de gestão financeira pessoal. A ideia é que o usuário consiga ter controle total das finanças dele: ver quanto tem de dinheiro, quanto tá devendo, quanto de limite sobrou nos cartões, o que tá atrasado, o que precisa pagar esse mês... enfim, um controle financeiro completo.

## Tela de Entrada - Login/Registro

Primeira coisa: você precisa de uma tela bonita pra galera entrar no sistema.

**Tela de Login**
- Campo de email
- Campo de senha
- Botão "Entrar"
- Link "Não tem conta? Cadastre-se"

Chama o endpoint `POST /api/auth/login` com email e senha. Se der certo, você recebe um token JWT que precisa guardar (localStorage, sessionStorage, cookie, tanto faz). Esse token vai em TODAS as requisições depois, no header `Authorization: Bearer {token}`.

**Tela de Registro**
- Campo "Nome completo"
- Campo "Email"
- Campo "Senha"
- Campo "Confirmar senha"
- Botão "Criar conta"

Usa o `POST /api/auth/register`. Se cadastrar certinho, já loga o cara automaticamente e guarda o token.

**Dica:** Faz uma tela bonita aqui, tipo com uns gradientes, ilustração de dinheiro, algo que passe confiança sabe? Tipo Nubank, C6, essas fintechs que tem visual maneiro.

## Dashboard Principal - A Tela Mais Importante

Depois que o usuário loga, ele cai numa dashboard principal. Essa é a tela mais importante do sistema, onde ele vê tudo de uma vez.

### Header/Navbar
- Logo do Fy
- Nome do usuário (pega do `GET /api/auth/me`)
- Menu com: Dashboard, Contas, Cartões, Entrada$, Configurações
- Botão de Logout

### Cards no Topo (tipo aqueles cards grandes com números)

Puxa do endpoint `GET /api/dashboard?month=12&year=2024` e monta esses cards:

**Card 1 - Saldo Atual**
- Número grande em destaque: `current_balance`
- Subtítulo: "Disponível agora"
- Cor verde se positivo, vermelho se negativo
- Ícone de cifrão ou carteira

**Card 2 - Total de Entradas**
- Número: `total_income`
- Subtítulo: "Recebido este mês"
- Cor verde/azul
- Ícone de seta pra cima ou dinheiro entrando

**Card 3 - Total de Gastos**
- Número: `total_expenses`
- Subtítulo: "Contas deste mês"
- Cor vermelha/laranja
- Ícone de seta pra baixo ou dinheiro saindo

**Card 4 - Saldo Projetado**
- Número: `projected_balance`
- Subtítulo: "Se pagar tudo que falta"
- Cor neutra ou amarela
- Ícone de calculadora

### Seção de Cartões de Crédito

Logo abaixo dos cards, faz uma seção mostrando os cartões que o usuário tem. Pega de `credit_cards` que vem no dashboard:

**Pra cada cartão, mostra um card menor com:**
- Nome do cartão (ex: "Nubank", "Itaú")
- Limite total
- Quanto já usou (`used_limit`)
- Quanto ainda tem disponível (`available_limit`)
- Uma barrinha de progresso mostrando o percentual usado (`used_percentage`)
  - Verde se tá abaixo de 30%
  - Amarelo se entre 30-70%
  - Vermelho se acima de 70%

**Exemplo visual:**
```
┌─────────────────────────────────┐
│ 💳 Nubank                       │
│ ────────────────────────────    │
│ Usado: R$ 1.200,00              │
│ Disponível: R$ 3.800,00         │
│ ██████░░░░░░░░░░ 24%            │
│ Limite total: R$ 5.000,00       │
└─────────────────────────────────┘
```

### Gráficos (aqui fica legal demais!)

**Gráfico 1 - Contas do Mês por Tipo**
- Usa `monthly_summary` do dashboard
- Faz um gráfico de pizza ou rosca mostrando:
  - Contas Fixas (azul): `fixed_accounts.total`
  - Contas Variáveis (laranja): `variable_accounts.total`
  - Crédito (roxo): `credit_accounts.total`

**Gráfico 2 - Status de Pagamento**
- Também do `monthly_summary`
- Gráfico de barras ou colunas mostrando:
  - Pagas (verde): `total.paid`
  - Pendentes (amarelo): `total.pending`
  - Atrasadas (vermelho): `total.late`

**Gráfico 3 - Evolução Mensal (bônus se quiser impressionar)**
- Usa `GET /api/dashboard/yearly-analysis?year=2024`
- Gráfico de linha mostrando mês a mês:
  - Linha verde: Entradas (`total_income`)
  - Linha vermelha: Gastos (`total_expenses`)
  - Linha azul: Saldo final (`projected_balance`)

### Alertas e Avisos

**Próximas Contas a Vencer (7 dias)**
- Pega `upcoming_bills` do dashboard
- Lista com cards pequenos tipo:
  ```
  ⚠️ Internet - R$ 99,90 - Vence em 3 dias
  ⚠️ Aluguel - R$ 1.200,00 - Vence em 5 dias
  ```
- Cor amarela/laranja pra chamar atenção

**Contas Atrasadas (se tiver)**
- Pega `late_bills` do dashboard
- Lista com destaque vermelho tipo:
  ```
  🔴 Luz - R$ 150,00 - Atrasado há 5 dias
  ```
- Põe isso bem visível pra pessoa não esquecer!

### Seletor de Mês/Ano

Bota ali em cima um seletor tipo dropdown ou botões pra escolher mês e ano. Quando mudar, recarrega todo o dashboard com os novos parâmetros.

## Tela de Contas Fixas

Aqui o usuário gerencia as contas que vêm todo mês (luz, internet, aluguel, academia, etc).

**Listagem:**
- Tabela ou cards mostrando todas as contas fixas (`GET /api/account-fixes`)
- Colunas: Nome | Valor | Dia do Vencimento | Ações
- Exemplo:
  ```
  Internet Fibra | R$ 99,90 | Dia 15 | ✏️ 🗑️
  Luz | R$ 150,00 | Dia 20 | ✏️ 🗑️
  Aluguel | R$ 1.200,00 | Dia 5 | ✏️ 🗑️
  ```

**Botão "Nova Conta Fixa":**
- Abre um modal ou vai pra outra página
- Formulário com:
  - Nome da conta
  - Valor (R$)
  - Dia do vencimento (1-31)
- Salva com `POST /api/account-fixes`

**Ações:**
- ✏️ Editar: Abre modal com os dados, usa `PUT /api/account-fixes/{id}`
- 🗑️ Excluir: Pede confirmação e usa `DELETE /api/account-fixes/{id}`

## Tela de Contas Variáveis/Parceladas

Aqui fica as compras parceladas (geladeira em 10x, sofá em 6x, etc).

**Listagem:**
- Cards ou tabela com `GET /api/account-variables`
- Mostra: Nome | Valor da Parcela | Parcelas | Progresso | Ações
- Exemplo:
  ```
  Geladeira
  R$ 300,00/mês
  Parcelas: 3/10 pagas
  ███░░░░░░░ 30%
  [Pagar Parcela] ✏️ 🗑️
  ```

**Botão "Pagar Parcela":**
- Chama `POST /api/account-variables/{id}/pay-installment`
- Mostra um feedback legal tipo "Parcela paga! ✅"
- Atualiza a listagem

**Nova Conta Variável:**
- Formulário:
  - Nome (ex: "Geladeira")
  - Valor de cada parcela
  - Quantidade total de parcelas
  - Quantas já foram pagas
  - Dia do vencimento
- Salva com `POST /api/account-variables`

## Tela de Cartões de Crédito

Gerencia os cartões do usuário.

**Listagem:**
- Cards bonitos mostrando cada cartão (`GET /api/credit-cards`)
- Visual tipo cartão de crédito mesmo, colorido
- Mostra:
  - Nome do cartão
  - Limite total
  - Limite usado
  - Limite disponível
  - Barra de progresso
  - Dia do vencimento

**Novo Cartão:**
- Formulário:
  - Nome do cartão (ex: "Nubank", "Itaú")
  - Limite total
  - Dia do vencimento da fatura
- Salva com `POST /api/credit-cards`

**Ver Compras do Cartão:**
- Ao clicar num cartão, mostra todas as compras dele
- Lista as compras do `GET /api/account-credits` filtradas por `card_id`

## Tela de Compras no Crédito

Gerencia as compras parceladas nos cartões.

**Listagem:**
- Pega `GET /api/account-credits`
- Mostra: Nome | Cartão | Valor Total | Valor da Parcela | Parcelas | Ações
- Exemplo:
  ```
  Notebook Dell
  Cartão: Nubank
  Total: R$ 3.600,00
  Parcela: R$ 300,00
  Parcelas: 2/12 pagas
  ████░░░░░░░░ 17%
  [Pagar Parcela] ✏️ 🗑️
  ```

**Nova Compra:**
- Formulário:
  - Seleciona o cartão (dropdown)
  - Nome da compra
  - Valor total
  - Número de parcelas
  - Sistema calcula automaticamente o valor da parcela
- Valida se tem limite disponível antes de salvar!
- Salva com `POST /api/account-credits`

## Tela de Entradas de Dinheiro

Onde registra salários, freelas, rendas extras, etc.

**Listagem:**
- Lista simples com `GET /api/money-entries`
- Mostra: Nome | Valor | Data | Ações
- Ordena por data (mais recente primeiro)
- Exemplo:
  ```
  Salário CLT | R$ 5.000,00 | 05/12/2024 | ✏️ 🗑️
  Freela | R$ 1.500,00 | 15/12/2024 | ✏️ 🗑️
  ```

**Nova Entrada:**
- Formulário:
  - Nome (ex: "Salário", "Freela XYZ")
  - Valor
  - Data que recebeu
- Salva com `POST /api/money-entries`

**Dica:** Põe um total no topo mostrando quanto já recebeu no mês!

## Tela de Movimentação Mensal

Essa é a tela onde o usuário controla o que precisa pagar no mês.

### Primeiro uso do mês
Se o usuário ainda não gerou o mês, mostra um botão grande:
```
Gerar Movimentações de Dezembro/2024
```

Ao clicar, chama `POST /api/month-movimentations/generate` passando mês e ano.

### Depois de gerar

Mostra uma lista com TUDO que precisa pagar no mês (`GET /api/month-movimentations`):

**Filtros no topo:**
- Todas | Pagas | Pendentes | Atrasadas

**Cards ou tabela com:**
- Nome da conta
- Valor
- Vencimento
- Status (paga ✅ / pendente ⏳ / atrasada 🔴)
- Tipo (fixa/variável/crédito)
- Botão "Marcar como Paga" (se pendente/atrasada)

**Exemplo:**
```
┌──────────────────────────────────────┐
│ 🔴 Atrasada                          │
│ Luz                                  │
│ R$ 150,00                            │
│ Vencimento: 20/12/2024               │
│ Atrasado há 3 dias                   │
│ [Marcar como Paga]                   │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ ⏳ Pendente                           │
│ Internet                             │
│ R$ 99,90                             │
│ Vencimento: 15/12/2024               │
│ Vence em 2 dias                      │
│ [Marcar como Paga]                   │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ ✅ Paga                               │
│ Aluguel                              │
│ R$ 1.200,00                          │
│ Pago em: 05/12/2024                  │
└──────────────────────────────────────┘
```

**Marcar como Paga:**
- Ao clicar, pode abrir um modal perguntando a data do pagamento
- Chama `POST /api/month-movimentations/{id}/pay`
- Atualiza a lista
- Mostra feedback "Conta paga! ✅"

### Resumo no topo
Pega `GET /api/month-movimentations/summary` e mostra uns cards:
- Total a pagar: R$ X
- Já pago: R$ Y
- Ainda falta: R$ Z
- Atrasadas: N contas

## Funcionalidades Extras que Vão Impressionar

### 1. Modo Escuro/Claro
Põe um toggle no canto pra trocar entre tema claro e escuro. Galera adora!

### 2. Notificações
- Aviso de contas próximas do vencimento
- Aviso de contas atrasadas
- Pode usar Web Notifications API

### 3. Exportar Relatório
- Botão pra baixar um PDF ou Excel com o resumo do mês
- Usa os dados do dashboard mesmo

### 4. Filtros e Busca
- Em todas as listagens, põe um campo de busca
- Filtros por período, tipo, status, etc.

### 5. Animações Suaves
- Usa Framer Motion, React Spring ou similar
- Transições suaves entre telas
- Loading states bonitinhos

### 6. Responsivo
- PRECISA funcionar bem no celular
- Galera vai usar muito no mobile pra consultar rápido
- Testa em diferentes tamanhos de tela

### 7. PWA (Progressive Web App)
- Faz virar um PWA pra instalar no celular
- Funciona offline (pelo menos mostra dados em cache)

## Stack Sugerida

**React:**
```
- React + TypeScript
- React Router (navegação)
- Axios (requisições)
- React Query ou SWR (cache e estados)
- Recharts ou Chart.js (gráficos)
- Tailwind CSS ou Material-UI (estilo)
- React Hook Form (formulários)
- Date-fns (datas)
- React Hot Toast (notificações)
```

**Vue:**
```
- Vue 3 + TypeScript
- Vue Router
- Axios
- Pinia (estado)
- Chart.js ou ApexCharts
- Vuetify ou PrimeVue
- VeeValidate (formulários)
- Day.js (datas)
```

**Next.js (React com server-side):**
- Mesma stack do React
- Aproveita SSR pra performance

## Fluxo do Usuário (Pra você ter ideia)

1. **Primeiro acesso:**
   - Cadastra-se
   - Cai no dashboard vazio
   - Sistema mostra um "Getting Started" tipo:
     - "Cadastre seus cartões de crédito"
     - "Cadastre suas contas fixas"
     - "Registre suas entradas de dinheiro"

2. **Uso mensal:**
   - Todo dia 1 do mês, gera as movimentações
   - Durante o mês, vai marcando como pago conforme paga
   - Consulta o dashboard pra saber quanto tem disponível
   - Verifica limite dos cartões antes de comprar

3. **Cadastro de nova compra:**
   - Comprou algo parcelado?
   - Vai em "Compras no Crédito"
   - Cadastra
   - Sistema já mostra o impacto no limite do cartão

## Estrutura de Pastas (Sugestão React)

```
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── Input.tsx
│   ├── dashboard/
│   │   ├── BalanceCard.tsx
│   │   ├── CreditCardCard.tsx
│   │   ├── Chart.tsx
│   │   └── UpcomingBills.tsx
│   ├── accounts/
│   │   ├── AccountList.tsx
│   │   ├── AccountForm.tsx
│   │   └── AccountCard.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Layout.tsx
├── pages/
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── AccountFixes.tsx
│   ├── AccountVariables.tsx
│   ├── CreditCards.tsx
│   ├── AccountCredits.tsx
│   ├── MoneyEntries.tsx
│   └── MonthMovimentations.tsx
├── services/
│   └── api.ts (todas as chamadas pro backend)
├── hooks/
│   ├── useAuth.ts
│   ├── useDashboard.ts
│   └── useAccounts.ts
├── utils/
│   ├── formatMoney.ts
│   ├── formatDate.ts
│   └── validators.ts
├── contexts/
│   └── AuthContext.tsx
└── App.tsx
```

## Dicas de UX/UI

1. **Use ícones:** Fica muito mais visual e bonito
2. **Cores com significado:**
   - Verde = positivo (entradas, pago, disponível)
   - Vermelho = negativo (gastos, atrasado, usado)
   - Amarelo = atenção (pendente, próximo do vencimento)
   - Azul = neutro/informativo

3. **Feedback visual:**
   - Sempre mostre um loading quando tá buscando dados
   - Mensagens de sucesso/erro em toast
   - Animações ao adicionar/remover itens

4. **Confirmações:**
   - Sempre peça confirmação antes de excluir algo
   - Modal tipo "Tem certeza que quer excluir X?"

5. **Números formatados:**
   - R$ 1.234,56 (não 1234.56)
   - Use bibliotecas tipo Intl.NumberFormat

6. **Datas em português:**
   - "05 de dezembro de 2024"
   - "Vence em 3 dias"
   - "Atrasado há 5 dias"

## Exemplo de Service/API (React)

```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Interceptor pra adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (data: RegisterData) =>
    api.post('/auth/register', data),

  logout: () =>
    api.post('/auth/logout'),
};

export const dashboard = {
  get: (month: number, year: number) =>
    api.get(`/dashboard?month=${month}&year=${year}`),

  getBalance: (month: number, year: number) =>
    api.get(`/dashboard/balance?month=${month}&year=${year}`),
};

export const accountFixes = {
  list: () => api.get('/account-fixes'),
  create: (data: AccountFixData) => api.post('/account-fixes', data),
  update: (id: number, data: AccountFixData) => api.put(`/account-fixes/${id}`, data),
  delete: (id: number) => api.delete(`/account-fixes/${id}`),
};

// ... e por aí vai
```

## Prioridades de Desenvolvimento

Se você tá começando, faz nessa ordem:

1. **Semana 1:** Login/Registro + Dashboard básico
2. **Semana 2:** Contas Fixas + Entradas de Dinheiro
3. **Semana 3:** Cartões + Compras no Crédito
4. **Semana 4:** Contas Variáveis + Movimentação Mensal
5. **Semana 5:** Gráficos + Melhorias de UX
6. **Semana 6:** Responsivo + PWA + Polimento

## Conclusão

Com isso tudo você vai ter um sistema COMPLETO de gestão financeira. O backend já tá 100% pronto, é só consumir os endpoints certinho e criar uma interface bonita e funcional.

Foca em fazer algo que VOCÊ usaria. Se você não usaria, provavelmente tá faltando algo ou tá confuso demais.

Vai com calma, testa cada funcionalidade, e principalmente: COMITE PEQUENO, COMITE FREQUENTE. Não deixa pra fazer tudo de uma vez não.

Qualquer dúvida sobre os endpoints, olha lá no README.md, API_COLLECTION.md ou EXEMPLOS_USO.md que tá tudo explicadinho.

Bora codar! 🚀
