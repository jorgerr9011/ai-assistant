# Dockerfile para la aplicación Next.js
FROM node:18

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de tu aplicación
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Crear la aplicación en modo producción
#RUN npm run build

# Exponer el puerto
EXPOSE 3000

# Comando para ejecutar Next.js
CMD ["npm", "run", "dev"]
