const path = require('path');

const TaskRepositoryImpl = require(path.resolve(__dirname, '../../../infrastructure/db/TaskRepositoryImpl'));

const CreateTask = require(path.resolve(__dirname, '../../../application/use_cases/tasks/CreateTask'));
const DeleteTask = require(path.resolve(__dirname, '../../../application/use_cases/tasks/DeleteTask'));
const GetTaskById = require(path.resolve(__dirname, '../../../application/use_cases/tasks/GetTaskById'));
const GetAllTasks = require(path.resolve(__dirname, '../../../application/use_cases/tasks/GetAllTasks'));
const UpdateTask = require(path.resolve(__dirname, '../../../application/use_cases/tasks/UpdateTask'));

const taskRepository = new TaskRepositoryImpl();

const getTaskByIdUseCase = new GetTaskById(taskRepository);
const getAllTasksUseCase = new GetAllTasks(taskRepository);
const createTaskUseCase = new CreateTask(taskRepository);
const deleteTaskUseCase = new DeleteTask(taskRepository);
const updateTaskUseCase = new UpdateTask(taskRepository);

exports.getTaskById = async (req, res) => {
    try {
        const { taskId } = req.params;

        if (!taskId || typeof taskId !== 'string' || !taskId.trim()) {
            return res.status(400).json({ error: 'Task ID is required in the path' });
        }

        const task = await getTaskByIdUseCase.execute({ taskId: taskId.trim() });
        res.json(task);
    } catch (err) {
        console.error(err);
        switch (err.name) {
            case 'TaskNotFoundError':
                res.status(404).json({ error: 'Task not found' });
                break;
            default:
                res.status(500).json({ error: err.message });
        }
    }
};

exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await getAllTasksUseCase.execute();
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.createTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({ error: 'Title is required in the request body' });
        }

        if (!description || typeof description !== 'string' || !description.trim()) {
            return res.status(400).json({ error: 'Description is required in the request body' });
        }

        if (description.trim().length > 256) {
            return res.status(400).json({ error: 'Description must not exceed 256 characters' });
        }

        const task = await createTaskUseCase.execute({ 
            title: title.trim(), 
            description: description.trim() 
        });
        res.status(201).json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        if (!taskId || typeof taskId !== 'string' || !taskId.trim()) {
            return res.status(400).json({ error: 'Task ID is required in the path' });
        }

        await deleteTaskUseCase.execute({ taskId: taskId.trim() });
        res.status(204).send();
    } catch (err) {
        console.error(err);
        switch (err.name) {
            case 'TaskNotFoundError':
                res.status(404).json({ error: 'Task not found' });
                break;
            default:
                res.status(500).json({ error: err.message });
        }
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, description } = req.body;

        if (!taskId || typeof taskId !== 'string' || !taskId.trim()) {
            return res.status(400).json({ error: 'Task ID is required in the path' });
        }

        if (!title || typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({ error: 'Title is required in the request body' });
        }

        if (!description || typeof description !== 'string' || !description.trim()) {
            return res.status(400).json({ error: 'Description is required in the request body' });
        }

        if (description.trim().length > 256) {
            return res.status(400).json({ error: 'Description must not exceed 256 characters' });
        }

        const updatedTask = await updateTaskUseCase.execute({
            taskId: taskId.trim(),
            title: title.trim(),
            description: description.trim()
        });

        res.json(updatedTask);
    } catch (err) {
        console.error(err);
        switch (err.name) {
            case 'TaskNotFoundError':
                res.status(404).json({ error: 'Task not found' });
                break;
            default:
                res.status(500).json({ error: err.message });
        }
    }
};
