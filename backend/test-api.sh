#!/bin/bash

echo "===================================="
echo "Fy - Teste de API"
echo "===================================="
echo ""

BASE_URL="http://localhost:8000"

echo "[1/5] Testando endpoint raiz..."
response=$(curl -s $BASE_URL)
if [[ $response == *"online"* ]]; then
    echo "OK - Aplicação online!"
else
    echo "ERRO: Aplicação não está respondendo"
    echo "Certifique-se que 'docker-compose up -d' foi executado"
    exit 1
fi
echo ""

echo "[2/5] Testando registro de usuário..."
EMAIL="teste$RANDOM@example.com"
response=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Teste\",\"email\":\"$EMAIL\",\"password\":\"senha123\",\"password_confirmation\":\"senha123\"}")

if [[ $response == *"success"* ]]; then
    echo "OK - Usuário registrado!"
else
    echo "ERRO: Falha ao registrar usuário"
    echo $response
    exit 1
fi
echo ""

echo "[3/5] Extraindo token..."
TOKEN=$(echo $response | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
echo "Token obtido!"
echo ""

echo "[4/5] Testando endpoint protegido..."
response=$(curl -s -X GET $BASE_URL/api/auth/me \
  -H "Authorization: Bearer $TOKEN")

if [[ $response == *"success"* ]]; then
    echo "OK - Autenticação funcionando!"
else
    echo "ERRO: Token não funcionou"
    echo $response
    exit 1
fi
echo ""

echo "[5/5] Testando dashboard..."
response=$(curl -s -X GET "$BASE_URL/api/dashboard?month=12&year=2024" \
  -H "Authorization: Bearer $TOKEN")

if [[ $response == *"success"* ]]; then
    echo "OK - Dashboard funcionando!"
else
    echo "ERRO: Dashboard não funcionou"
    echo $response
    exit 1
fi
echo ""

echo "===================================="
echo "Todos os testes passaram!"
echo "A API está funcionando perfeitamente!"
echo "===================================="
echo ""
