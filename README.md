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

## Despliegue y Pruebas

### Requisitos Previos
- AWS CLI configurado con credenciales válidas
- Docker instalado
- Cuenta de AWS con permisos necesarios

### Arquitectura Acoplada (ECS/Fargate)

#### 1. Crear el repositorio ECR
Desplegar la plantilla `plantillas-aws/ecr.yml` con el siguiente parámetro:
- **RepositoryName**: `tasks-acoplada`

#### 2. Construir y subir la imagen Docker
Desde la carpeta `app/`:
```bash
# Login en ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# Construir la imagen
docker build --platform linux/amd64 -t tasks-acoplada -f ./Dockerfile.acoplada . --provenance=false

# Etiquetar la imagen
docker tag tasks-acoplada:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/tasks-acoplada:latest

# Subir la imagen
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/tasks-acoplada:latest
```

#### 3. Crear la base de datos DynamoDB
Desplegar la plantilla `plantillas-aws/db_dynamodb.yml` con el siguiente parámetro:
- **TableName**: `tasks`

#### 4. Desplegar la arquitectura acoplada
Desplegar la plantilla `plantillas-aws/acoplada.yml` con las capacidades de IAM necesarias y los siguientes parámetros:
- **ImageName**: `tasks-acoplada:latest`
- **SubnetIds**: Al menos 2 subnets de la VPC
- **VpcId**: ID de la VPC donde se desplegará ECS
- **VpcCidr**: Bloque CIDR de la VPC (ej. `10.0.0.0/16`)
- **DBDynamoName**: `tasks` (nombre de la tabla DynamoDB creada)

#### 5. Obtener la URL del servicio y la API Key
Una vez desplegado el stack, obtener la URL del servicio y la API Key desde los outputs del stack. El script `scripts/get-api-key.sh` puede ayudar a obtener la API Key.

### Arquitectura Desacoplada (Lambda + API Gateway)

#### 1. Crear el repositorio ECR (si no se ha hecho antes)
Desplegar la plantilla `plantillas-aws/ecr.yml` con el siguiente parámetro:
- **RepositoryName**: `tasks-desacoplada`

#### 2. Construir y subir la imagen Docker
Desde la carpeta `app/`:
```bash
# Login en ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# Construir la imagen
docker build --platform linux/amd64 -t tasks-desacoplada -f ./Dockerfile.desacoplada . --provenance=false

# Etiquetar la imagen
docker tag tasks-desacoplada:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/tasks-desacoplada:latest

# Subir la imagen
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/tasks-desacoplada:latest
```

#### 3. Crear la base de datos DynamoDB (si no se ha hecho antes)
Desplegar la plantilla `plantillas-aws/db_dynamodb.yml` con el siguiente parámetro:
- **TableName**: `tasks`

#### 4. Desplegar la arquitectura desacoplada
Desplegar la plantilla `plantillas-aws/desacoplada.yml` con las capacidades de IAM necesarias y los siguientes parámetros:
- **ImageName**: `tasks-desacoplada:latest`
- **DBDynamoName**: `tasks` (nombre de la tabla DynamoDB creada)

#### 5. Obtener la URL de la API y la API Key
Una vez desplegado el stack, obtener la URL de la API y la API Key desde los outputs del stack. El script `scripts/get-api-key.sh` puede ayudar a obtener la API Key.

### Probar la API

#### Opción 1: Postman
1. Importar la colección `testeo/coleccion_pruebas_postman.json`
2. Configurar las variables de entorno:
   - `base_url`: URL obtenida del despliegue
   - `api_key`: API Key obtenida del stack
3. Ejecutar las pruebas

#### Opción 2: Interfaz Web
1. Abrir `testeo/index.html` en un navegador
2. Configurar la URL base de la API
3. Configurar la API Key
4. Probar los diferentes endpoints (GET, POST, PUT, DELETE)

**Nota:** Ambas arquitecturas requieren API Key para acceder a los endpoints.
