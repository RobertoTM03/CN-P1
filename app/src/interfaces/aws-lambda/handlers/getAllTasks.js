const GetAllTasks = require('../../../application/use_cases/tasks/GetAllTasks');
const TaskRepositoryImpl = require('../../../infrastructure/db/TaskRepositoryImpl');

// Inyección de Dependencias
const taskRepository = new TaskRepositoryImpl();
const getAllTasksUseCase = new GetAllTasks(taskRepository);

exports.handler = async (event) => {
    try {
        const tasks = await getAllTasksUseCase.execute();

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,x-api-key,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
            },
            body: JSON.stringify(tasks),
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