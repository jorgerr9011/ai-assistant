## AI Assistant
Este proyecto tiene como objetivo desarrollar una aplicación web que implemente un asistente
para que usuarios de una organización puedan resolver incidencias de manera automatizada, sin
la necesidad de que un técnico tenga que resolverlas. 

Para lograr cumplir con ese objetivo, se ha utilizado la técnica RAG para integrar el LLM 
(Large Language Model) que resolverá las solicitudes de los usuarios, utilizando como base de
conocimiento información interna de la organización.

El sistema incluye autenticación, implementada usando NextAuth, que es una biblioteca de
autenticación para aplicaciones NextJs. Nextauth permite la implementación de múltiples proveedores (servicios que pueden ser
usados para iniciar sesión con un usuario) como Google o GitHub, aunque en el proyecto
se utilizará el proveedor Credentials, que permite iniciar sesión con credenciales arbitrarias
(correo y contraseña), y nos permitirá autorizar los usuarios previamente registrados en nuestra
base de datos. Para almacenar la contraseña en el backend se usó la librería bcrypt, que
nos permitirá cifrarla antes de ser guardada en la base de datos. Para configurar la sesión se 
escogió la estrategia JWT (JSON Web Token) para almacenar la información de la sesión, ya que esta
información solo se almacena del lado del cliente.

![imagen](https://github.com/user-attachments/assets/4d8bc352-52b0-4d91-8521-4a4cc89d783a)


## Historias de usuario
* Crear Chat
* Borrar Chat
* Crear solicitud a través del Chat
* Limpiar historial de mensajes de un Chat
* Mostrar historial de chats
* Iniciar sesión
* Registro

## Tecnologías utilizadas
* NextJs
* TypeScript
* React
* MongoDB
* Jest
* React Testing Library
