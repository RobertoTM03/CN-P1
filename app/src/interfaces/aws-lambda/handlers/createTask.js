const CreateTask = require('../../../application/use_cases/tasks/CreateTask');
const TaskRepositoryImpl = require('../../../infrastructure/db/TaskRepositoryImpl');

// Inyección de Dependencias
const taskRepository = new TaskRepositoryImpl();
const createTaskUseCase = new CreateTask(taskRepository);

exports.handler = async (event) => {
    try {
        const { title, description } = JSON.parse(event.body);

        // Validación de campos requeridos
        if (!title || typeof title !== 'string' || !title.trim()) {
            return {
                statusCode: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type,x-api-key,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
                },
                body: JSON.stringify({ error: 'Title is required in the request body' }),
            };
        }

        if (!description || typeof description !== 'string' || !description.trim()) {
            return {
                statusCode: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type,x-api-key,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
                },
                body: JSON.stringify({ error: 'Description is required in the request body' }),
            };
        }

        // Validación de longitud máxima de descripción
        if (description.trim().length > 256) {
            return {
                statusCode: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type,x-api-key,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
                },
                body: JSON.stringify({ error: 'Description must not exceed 256 characters' }),
            };
        }

        const task = await createTaskUseCase.execute({ 
            title: title.trim(), 
            description: description.trim() 
        });

        return {
            statusCode: 201,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,x-api-key,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
            },
            body: JSON.stringify(task),
        };

    } catch (error) {
        console.error(error);
        return {
            statusCode: error.statusCode || 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,x-api-key,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
            },
            body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
        };
    }
};