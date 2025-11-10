# CN-P1

**Autor:** Roberto Tejero Martín

Primera práctica entregable de la asignatura Computación en la Nube (CN) de la ULPGC.

Este repositorio contiene una aplicación de gestión de tareas (Tasks API) implementada con arquitectura hexagonal y desplegable en AWS. El proyecto incluye dos versiones de despliegue: una arquitectura acoplada y otra desacoplada.

## Estructura del Proyecto

### `app/`
Contiene el código fuente de la aplicación y los archivos de configuración.

- **`Dockerfile.acoplada`** - Dockerfile para la arquitectura acoplada (aplicación completa en un contenedor)
- **`Dockerfile.desacoplada`** - Dockerfile para la arquitectura desacoplada (handlers de Lambda)
- **`index.js`** - Punto de entrada principal de la aplicación Express
- **`package.json`** - Dependencias y configuración del proyecto Node.js

#### `app/src/`
Código fuente organizado siguiendo arquitectura hexagonal:

##### `application/use_cases/tasks/`
Casos de uso de la aplicación (lógica de negocio):
- **`CreateTask.js`** - Crear una nueva tarea
- **`DeleteTask.js`** - Eliminar una tarea
- **`GetAllTasks.js`** - Obtener todas las tareas
- **`GetTaskById.js`** - Obtener una tarea por ID
- **`UpdateTask.js`** - Actualizar una tarea existente

##### `domain/`
Capa de dominio con las entidades y contratos:
- **`entities/Task.js`** - Entidad de negocio Task
- **`repositories/TaskRepository.js`** - Interface del repositorio de tareas

##### `infrastructure/`
Implementaciones de infraestructura:
- **`db/index.js`** - Configuración de la base de datos
- **`db/TaskRepositoryImpl.js`** - Implementación del repositorio usando DynamoDB

##### `interfaces/`
Adaptadores de entrada (controllers y handlers):

- **`aws-lambda/handlers/`** - Handlers para AWS Lambda (arquitectura desacoplada):
  - `createTask.js`, `deleteTask.js`, `getAllTasks.js`, `getTaskById.js`, `updateTask.js`
  
- **`http/`** - Controladores y rutas HTTP (arquitectura acoplada):
  - **`controllers/taskController.js`** - Controlador de tareas
  - **`routes/taskRoutes.js`** - Definición de rutas task
  - **`routes/tasksRoutes.js`** - Definición de rutas tasks

##### `shared/`
Código compartido:
- **`errors.js`** - Definición de errores personalizados

### `archivos_entrega/`
Archivos y documentación para la entrega de la práctica:
- **`diagrama_version_acoplada.png`** - Diagrama de arquitectura de la versión acoplada
- **`diagrama_version_desacoplada.png`** - Diagrama de arquitectura de la versión desacoplada
- **`estimacion_acoplada.pdf`** - Estimación de costes de la arquitectura acoplada
- **`estimacion_desacoplada.pdf`** - Estimación de costes de la arquitectura desacoplada
- **`memoria_practica_1_roberto_tejero_martin.pdf`** - Memoria completa de la práctica

### `plantillas-aws/`
Plantillas de CloudFormation para el despliegue en AWS:
- **`acoplada.yml`** - Plantilla para arquitectura acoplada (ECS/Fargate)
- **`db_dynamodb.yml`** - Plantilla para crear la tabla DynamoDB
- **`desacoplada.yml`** - Plantilla para arquitectura desacoplada (Lambda + API Gateway)
- **`ecr.yml`** - Plantilla para crear repositorios ECR

### `scripts/`
Scripts auxiliares:
- **`get-api-key.sh`** - Script para obtener la API Key de AWS

### `testeo/`
Recursos para pruebas:
- **`coleccion_pruebas_postman.json`** - Colección de Postman con pruebas de la API
- **`index.html`** - Interfaz web para probar la API
