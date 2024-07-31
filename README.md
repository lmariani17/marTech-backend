# MarTech

## Descripción

Esta aplicación gestiona campañas y sus interacciones. Permite crear, obtener, actualizar y eliminar campañas, así como registrar interacciones con ellas a traves de un sistema de colas.

## Tecnologías

- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **TypeScript**: Superset de JavaScript que agrega tipos estáticos.
- **Express**: Framework para construir aplicaciones web.
- **TypeORM**: ORM para TypeScript y JavaScript.
- **AWS SDK**: Para la integración con AWS SQS.
- **Swagger**: Documentación de API.
- **Jest**: Framework de pruebas.

## Instalación

1. **Clona el repositorio**:

   ```bash
   git clone https://github.com/lmariani17/marTech-backend.git
   cd marTech-backend

2. **Instala las dependencias**:

   ```bash
   npm install

3. **Configura las variables de entorno**:
Crea un archivo .env en la raíz del proyecto con el siguiente contenido (solicitar credenciales a mariani.lucas17@gmail.com):

   ```bash
   DB_TYPE=mysql
   DB_HOST=db
   DB_PORT=3306
   DB_USERNAME=your-database-user
   DB_PASSWORD=your-database-password
   DB_DATABASE=your-database-name
   TYPEORM_SYNCHRONIZE=true
   TYPEORM_LOGGING=false
   AWS_ACCESS_KEY_ID=your-access-key-id
   AWS_SECRET_ACCESS_KEY=your-secret-access-key
   AWS_REGION=your-region
   SQS_QUEUE_URL=your-sqs-queue-url
   JWT_SECRET=your-jwt-secret-key
   TEST_ID=your-test-user-id
   TEST_USER=your-test-user-email
   TEST_PASSWORD=your-test-user-password

4. **Inicia el servidor**:

   ```bash
   docker-compose up --build 

5. **Prueba la API**:
Abre http://localhost:3000/api-docs en tu navegador para ver la documentación generada por Swagger.

6. **Prueba ejecutar los test**:
Para ejecutar los tests, utiliza el siguiente comando:
   ```bash
   npm test

## Contribuciones
Las contribuciones son bienvenidas. Por favor, sigue el flujo de trabajo de GitHub para enviar tus contribuciones.