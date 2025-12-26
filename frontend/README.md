# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Criar arquivo .env com a URL da API
# Copie o .env.example e configure a URL do backend
echo "VITE_API_URL=http://localhost:8000/api" > .env

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Variáveis de Ambiente

O frontend precisa da variável `VITE_API_URL` configurada para se conectar ao backend.

### Desenvolvimento Local:
Crie um arquivo `.env` na raiz do projeto frontend:
```
VITE_API_URL=http://localhost:8000/api
```

### Deploy no Coolify:
Configure a variável de ambiente `VITE_API_URL` no Coolify ANTES do build:
```
VITE_API_URL=https://seu-backend.com/api
```

**Importante**: Variáveis `VITE_*` são injetadas em tempo de build, não em runtime. 
Se você alterar essa variável, será necessário fazer um rebuild completo do container.

## How can I deploy this project?

### Deploy no Coolify:
Veja o arquivo `COOLIFY.md` na raiz do projeto para instruções detalhadas.

### Deploy via Lovable:
Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
