class GetTaskById {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute( {taskId} ) {
        return await this.taskRepository.findTaskById(taskId);
    }
}

module.exports = GetTaskById;