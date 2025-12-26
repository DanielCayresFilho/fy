# Build stage
FROM node:20-alpine AS build

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production=false

# Copiar arquivos do projeto
COPY . .

# Construir aplicação para produção
RUN npm run build

# Production stage
FROM node:20-alpine

# Instalar serve globalmente para servir arquivos estáticos
RUN npm install -g serve

# Criar diretório para os arquivos construídos
WORKDIR /app

# Copiar arquivos construídos do stage de build
COPY --from=build /app/dist ./dist

# Expor porta 85
EXPOSE 85

# Comando para servir os arquivos estáticos na porta 85
# -s flag para SPA routing (retorna index.html para todas as rotas)
# -l 85 para escutar na porta 85
CMD ["serve", "-s", "dist", "-l", "85"]

