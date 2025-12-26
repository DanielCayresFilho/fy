# Deploy no Coolify

## Backend (PHP-FPM)

- **Porta**: 9000
- **Dockerfile**: `backend/Dockerfile`
- **Build Context**: `backend/`
- **Variáveis de Ambiente Necessárias**:
  - `DB_CONNECTION=pgsql`
  - `DB_HOST=<host_do_postgres>`
  - `DB_PORT=5432`
  - `DB_DATABASE=<nome_do_banco>`
  - `DB_USERNAME=<usuario>`
  - `DB_PASSWORD=<senha>`
  - `APP_KEY=<chave_do_laravel>` (gerar com `php artisan key:generate`)
  - `JWT_SECRET=<chave_jwt>` (gerar com `php artisan jwt:secret`)

### Comandos de Setup (executar no container após deploy):
```bash
php artisan migrate
php artisan db:seed
php artisan cache:clear
```

## Frontend (React/Vite)

- **Porta**: 85
- **Dockerfile**: `frontend/Dockerfile`
- **Build Context**: `frontend/`
- **Variáveis de Ambiente** (configure no Coolify antes do build):
  - `VITE_API_URL` - URL completa da API do backend
    - Exemplo: `https://api.seudominio.com/api`
    - Ou se estiver na mesma rede: `http://nome-do-servico-backend:9000/api`
    - **IMPORTANTE**: Esta variável deve ser configurada antes do build, pois o Vite injeta as variáveis `VITE_*` no código durante o build

### Configuração no Coolify:
1. Crie o serviço do Frontend
2. Nas **Variáveis de Ambiente**, adicione:
   ```
   VITE_API_URL=https://seu-backend.com/api
   ```
3. Certifique-se de adicionar a variável ANTES do primeiro build
4. Se precisar alterar depois, será necessário fazer um rebuild completo

### Notas:
- O frontend usa `serve` para servir os arquivos estáticos
- O SPA routing está habilitado (retorna index.html para todas as rotas)
- A porta 85 está configurada no Dockerfile
- As variáveis `VITE_*` são injetadas em tempo de build, não em runtime

