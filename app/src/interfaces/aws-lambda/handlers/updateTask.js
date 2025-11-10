const UpdateTask = require('../../../application/use_cases/tasks/UpdateTask');
const TaskRepositoryImpl = require('../../../infrastructure/db/TaskRepositoryImpl');
const { TaskNotFoundError } = require('../../../shared/errors');

// Inyección de Dependencias
const taskRepository = new TaskRepositoryImpl();
const updateTaskUseCase = new UpdateTask(taskRepository);

exports.handler = async (event) => {
    try {
        // Validación de pathParameters
        if (!event.pathParameters || !event.pathParameters.id) {
            return {
                statusCode: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type,x-api-key,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
                },
                body: JSON.stringify({ error: 'Task ID is required in the path' }),
            };
        }

        const { id } = event.pathParameters;

        // Validación del ID
        if (!id || typeof id !== 'string' || !id.trim()) {
            return {
                statusCode: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type,x-api-key,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
                },
                body: JSON.stringify({ error: 'Task ID is required in the path' }),
            };
        }

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

        const updatedTask = await updateTaskUseCase.execute({ 
            taskId: id.trim(), 
            title: title.trim(), 
            description: description.trim() 
        });

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,x-api-key,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
            },
            body: JSON.stringify(updatedTask),
        };

    } catch (error) {
        console.error(error);

        if (error instanceof TaskNotFoundError) {
            return {
                statusCode: 404,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type,x-api-key,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
                },
                body: JSON.stringify({ error: error.message }),
            };
        }

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