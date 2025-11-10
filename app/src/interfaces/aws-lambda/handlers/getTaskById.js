const GetTaskById = require('../../../application/use_cases/tasks/GetTaskById');
const TaskRepositoryImpl = require('../../../infrastructure/db/TaskRepositoryImpl');
const { TaskNotFoundError } = require('../../../shared/errors');

// Inyección de Dependencias
const taskRepository = new TaskRepositoryImpl();
const getTaskByIdUseCase = new GetTaskById(taskRepository);

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

        const task = await getTaskByIdUseCase.execute({ taskId: id.trim() });

        return {
            statusCode: 200,
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
                "Access-Control-Allow-Headers": "Content-Type,x-api-key",
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
            },
            body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
        };
    }
};