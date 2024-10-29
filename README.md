## AI Assistant

Como objetivo de superar el Trabajo de Fin de Grado de Ingeniería Informática en la Coruña, se
propuso la realización del siguiente trabajo. Este proyecto tiene como objetivo desarrollar una 
aplicación web que implemente un asistente para que usuarios de una organización puedan 
resolver incidencias de manera automatizada, sin la necesidad de que un técnico tenga que resolverlas. 

Para lograr cumplir con ese objetivo, se ha utilizado la técnica RAG para integrar el LLM 
(Large Language Model) que resolverá las solicitudes de los usuarios, utilizando como base de
conocimiento información interna de la organización.

### Autenticación

El sistema incluye autenticación, implementada usando NextAuth, que es una biblioteca de
autenticación para aplicaciones NextJs. Nextauth permite la implementación de múltiples proveedores (servicios que pueden ser
usados para iniciar sesión con un usuario) como Google o GitHub, aunque en el proyecto
se utilizará el proveedor Credentials, que permite iniciar sesión con credenciales arbitrarias
(correo y contraseña), y nos permitirá autorizar los usuarios previamente registrados en nuestra
base de datos. Para almacenar la contraseña en el backend se usó la librería bcrypt, que
nos permitirá cifrarla antes de ser guardada en la base de datos. Para configurar la sesión se 
escogió la estrategia JWT (JSON Web Token) para almacenar la información de la sesión, ya que esta
información solo se almacena del lado del cliente.

![Captura desde 2024-10-07 23-12-31](https://github.com/user-attachments/assets/c8cf9995-d7dd-449c-9a16-4a6db097e185)

## Historias de usuario
* Crear Chat
* Borrar Chat
* Crear solicitud a través del Chat
* Limpiar historial de mensajes de un Chat
* Mostrar historial de chats
* Iniciar sesión
* Registro

## RAG como técnica para la recuperación de información y alimentación del modelo

## Tecnologías utilizadas en el Frontend

![Next.js](https://img.shields.io/badge/next.js-%23000000.svg?style=for-the-badge&logo=nextdotjs&logoColor=white)
![typescript](https://img.shields.io/badge/typescript-%233178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)
![tailwindcss](https://img.shields.io/badge/tailwindcss-%2306B6D4.svg?style=for-the-badge&logo=tailwindcss&logoColor=white)
![react](https://img.shields.io/badge/react-%2361DAFB.svg?style=for-the-badge&logo=react&logoColor=white)
![jest](https://img.shields.io/badge/jest-%23C21325.svg?style=for-the-badge&logo=jest&logoColor=white)

## Tecnologías utilizadas en el Backend

![langchain](https://img.shields.io/badge/langchain-%231C3C3C.svg?style=for-the-badge&logo=langchain&logoColor=white)
![fastapi](https://img.shields.io/badge/fastapi-%23009688.svg?style=for-the-badge&logo=fastapi&logoColor=white)
![python](https://img.shields.io/badge/python-%233776AB.svg?style=for-the-badge&logo=python&logoColor=white)
![openai](https://img.shields.io/badge/openai-%23412991.svg?style=for-the-badge&logo=openai&logoColor=white)
![confluence](https://img.shields.io/badge/confluence-%23172B4D.svg?style=for-the-badge&logo=confluence&logoColor=white)
![mongodb](https://img.shields.io/badge/mongodb-%2347A248.svg?style=for-the-badge&logo=mongodb&logoColor=white)
