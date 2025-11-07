const CreateTask = require('../../../application/use_cases/tasks/CreateTask');
const TaskRepositoryImpl = require('../../../infrastructure/db/TaskRepositoryImpl');

// Inyección de Dependencias
const taskRepository = new TaskRepositoryImpl();
const createTaskUseCase = new CreateTask(taskRepository);

exports.handler = async (event) => {
    try {
        const { title, description } = JSON.parse(event.body);

        const task = await createTaskUseCase.execute({ title, description });

        return {
            statusCode: 201,
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