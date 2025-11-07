const DeleteTask = require('../../../application/use_cases/tasks/DeleteTask');
const TaskRepositoryImpl = require('../../../infrastructure/db/TaskRepositoryImpl');
const { TaskNotFoundError } = require('../../../shared/errors');

// Inyección de Dependencias
const taskRepository = new TaskRepositoryImpl();
const deleteTaskUseCase = new DeleteTask(taskRepository);

exports.handler = async (event) => {
    try {
        const { id } = event.pathParameters;

        await deleteTaskUseCase.execute({ taskId: id });

        return {
            statusCode: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,x-api-key,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
            },
            body: '',
        };

    } catch (error) {
        console.error(error);

        // Manejo de error específico (404)
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