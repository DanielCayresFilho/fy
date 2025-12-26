@echo off
echo ====================================
echo Fy - Teste de API
echo ====================================
echo.

set BASE_URL=http://localhost:8000

echo [1/5] Testando endpoint raiz...
curl -s %BASE_URL% | findstr "online"
if %errorlevel% neq 0 (
    echo ERRO: Aplicacao nao esta respondendo
    echo Certifique-se que docker-compose up -d foi executado
    pause
    exit /b 1
)
echo OK - Aplicacao online!
echo.

echo [2/5] Testando registro de usuario...
curl -s -X POST %BASE_URL%/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"nome\":\"Teste\",\"email\":\"teste%RANDOM%@example.com\",\"password\":\"senha123\",\"password_confirmation\":\"senha123\"}" ^
  > response.json

findstr "success" response.json > nul
if %errorlevel% neq 0 (
    echo ERRO: Falha ao registrar usuario
    type response.json
    del response.json
    pause
    exit /b 1
)
echo OK - Usuario registrado!
echo.

echo [3/5] Extraindo token...
for /f "tokens=2 delims=:," %%a in ('findstr "token" response.json') do (
    set TOKEN=%%a
)
set TOKEN=%TOKEN:"=%
set TOKEN=%TOKEN: =%
echo Token obtido!
echo.

echo [4/5] Testando endpoint protegido...
curl -s -X GET %BASE_URL%/api/auth/me ^
  -H "Authorization: Bearer %TOKEN%" | findstr "success"
if %errorlevel% neq 0 (
    echo ERRO: Token nao funcionou
    pause
    exit /b 1
)
echo OK - Autenticacao funcionando!
echo.

echo [5/5] Testando dashboard...
curl -s -X GET "%BASE_URL%/api/dashboard?month=12&year=2024" ^
  -H "Authorization: Bearer %TOKEN%" | findstr "success"
if %errorlevel% neq 0 (
    echo ERRO: Dashboard nao funcionou
    pause
    exit /b 1
)
echo OK - Dashboard funcionando!
echo.

del response.json

echo ====================================
echo Todos os testes passaram!
echo A API esta funcionando perfeitamente!
echo ====================================
echo.
pause
