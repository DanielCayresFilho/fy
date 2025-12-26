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
- **Variáveis de Ambiente**:
  - `VITE_API_URL=<url_do_backend>` (ex: `http://seu-backend.com/api`)

### Notas:
- O frontend usa `serve` para servir os arquivos estáticos
- O SPA routing está habilitado (retorna index.html para todas as rotas)
- A porta 85 está configurada no Dockerfile

