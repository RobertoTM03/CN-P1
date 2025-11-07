class UpdateTask {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute( {taskId, title, description} ) {
        return await this.taskRepository.updateTask(taskId, title, description);
    }
}

module.exports = UpdateTask;