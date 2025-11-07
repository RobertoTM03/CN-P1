class TaskRepository {
    async createTask(taskText, OwnerId) {
        throw new Error("Not implemented.");
    }

    async findAllTasks(ownerId) {
        throw new Error("Not implemented.");
    }

    async findTaskById(taskId) {
        throw new Error("Not implemented.");
    }

    async deleteTaskById(taskId) {
        throw new Error("Not implemented.");
    }

    async updateTask(taskId, newTitle, newDescription) {
        throw new Error("Not implemented.");
    }
}

module.exports = TaskRepository;