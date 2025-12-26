#!/bin/bash

echo "===================================="
echo "Fy - Sistema de Gestão Financeira"
echo "Setup Inicial"
echo "===================================="
echo ""

echo "[1/6] Subindo containers Docker..."
docker-compose up -d
if [ $? -ne 0 ]; then
    echo "ERRO: Falha ao subir containers. Verifique se o Docker está rodando."
    exit 1
fi
echo "Containers iniciados com sucesso!"
echo ""

echo "[2/6] Instalando dependências do Composer..."
docker-compose exec app composer install
if [ $? -ne 0 ]; then
    echo "ERRO: Falha ao instalar dependências."
    exit 1
fi
echo "Dependências instaladas!"
echo ""

echo "[3/6] Gerando chave da aplicação..."
docker-compose exec app php artisan key:generate
echo "Chave da aplicação gerada!"
echo ""

echo "[4/6] Gerando chave JWT..."
docker-compose exec app php artisan jwt:secret
echo "Chave JWT gerada!"
echo ""

echo "[5/7] Executando migrations..."
docker-compose exec app php artisan migrate
if [ $? -ne 0 ]; then
    echo "ERRO: Falha ao executar migrations."
    exit 1
fi
echo "Migrations executadas!"
echo ""

echo "[6/7] Criando usuário padrão..."
docker-compose exec app php artisan db:seed
if [ $? -ne 0 ]; then
    echo "ERRO: Falha ao executar seeders."
    exit 1
fi
echo "Usuário padrão criado!"
echo ""

echo "[7/7] Limpando cache..."
docker-compose exec app php artisan cache:clear
echo "Cache limpo!"
echo ""

echo "===================================="
echo "Setup concluído com sucesso!"
echo "===================================="
echo ""
echo "A aplicação está rodando em: http://localhost:8000"
echo ""
echo "Credenciais de acesso:"
echo "Email: daniju@mail.com"
echo "Senha: @D4n1Ju.2409"
echo ""
echo "Próximos passos:"
echo "1. Acesse http://localhost:8000"
echo "2. Faça login com as credenciais acima"
echo "3. Use o token retornado nas requisições"
echo ""
echo "Para ver os logs: docker-compose logs -f"
echo "Para parar: docker-compose down"
echo ""
