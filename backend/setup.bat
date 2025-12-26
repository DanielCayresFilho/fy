@echo off
echo ====================================
echo Fy - Sistema de Gestao Financeira
echo Setup Inicial
echo ====================================
echo.

echo [1/6] Subindo containers Docker...
docker-compose up -d
if %errorlevel% neq 0 (
    echo ERRO: Falha ao subir containers. Verifique se o Docker Desktop esta rodando.
    pause
    exit /b 1
)
echo Containers iniciados com sucesso!
echo.

echo [2/6] Instalando dependencias do Composer...
docker-compose exec app composer install
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias.
    pause
    exit /b 1
)
echo Dependencias instaladas!
echo.

echo [3/6] Gerando chave da aplicacao...
docker-compose exec app php artisan key:generate
echo Chave da aplicacao gerada!
echo.

echo [4/6] Gerando chave JWT...
docker-compose exec app php artisan jwt:secret
echo Chave JWT gerada!
echo.

echo [5/7] Executando migrations...
docker-compose exec app php artisan migrate
if %errorlevel% neq 0 (
    echo ERRO: Falha ao executar migrations.
    pause
    exit /b 1
)
echo Migrations executadas!
echo.

echo [6/7] Criando usuario padrao...
docker-compose exec app php artisan db:seed
if %errorlevel% neq 0 (
    echo ERRO: Falha ao executar seeders.
    pause
    exit /b 1
)
echo Usuario padrao criado!
echo.

echo [7/7] Limpando cache...
docker-compose exec app php artisan cache:clear
echo Cache limpo!
echo.

echo ====================================
echo Setup concluido com sucesso!
echo ====================================
echo.
echo A aplicacao esta rodando em: http://localhost:8000
echo.
echo Credenciais de acesso:
echo Email: daniju@mail.com
echo Senha: @D4n1Ju.2409
echo.
echo Proximos passos:
echo 1. Acesse http://localhost:8000
echo 2. Faca login com as credenciais acima
echo 3. Use o token retornado nas requisicoes
echo.
echo Para ver os logs: docker-compose logs -f
echo Para parar: docker-compose down
echo.
pause
