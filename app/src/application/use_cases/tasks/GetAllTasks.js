class GetAllTasks {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }

    async execute() {
        return await this.taskRepository.findAllTasks();
    }
}

module.exports = GetAllTasks;