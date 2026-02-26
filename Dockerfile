# Usamos Node.js versión 18 como base
FROM node:18

# Creamos la carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiamos primero los archivos de dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del proyecto
COPY . .

# Exponemos el puerto 5000
EXPOSE 5000

# Comando para iniciar el servidor
CMD ["node", "server.js"]