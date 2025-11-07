const GetTaskById = require('../../../application/use_cases/tasks/GetTaskById');
const TaskRepositoryImpl = require('../../../infrastructure/db/TaskRepositoryImpl');
const { TaskNotFoundError } = require('../../../shared/errors');

// Inyección de Dependencias
const taskRepository = new TaskRepositoryImpl();
const getTaskByIdUseCase = new GetTaskById(taskRepository);

exports.handler = async (event) => {
    try {
        const { id } = event.pathParameters;

        const task = await getTaskByIdUseCase.execute({ taskId: id });

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,x-api-key",
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
                    "Access-Control-Allow-Headers": "Content-Type,x-api-key",
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