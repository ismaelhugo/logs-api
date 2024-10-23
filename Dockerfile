# Usar uma imagem base do Node.js
FROM node:18-alpine

# Definir o diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json para o container
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante do código da aplicação para o container
COPY . .

# Compilar TypeScript para JavaScript
RUN npm run build

# Expor a porta que o app vai usar
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "run", "dev"]
