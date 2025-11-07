class DeleteTask {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute( {taskId} ) {
        return await this.taskRepository.deleteTaskById(taskId);
    }
}

module.exports = DeleteTask;