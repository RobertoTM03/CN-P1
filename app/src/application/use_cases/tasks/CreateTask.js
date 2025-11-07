class CreateTask {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute( {title, description} ) {
        return await this.taskRepository.createTask(title, description);
    }
}

module.exports = CreateTask;