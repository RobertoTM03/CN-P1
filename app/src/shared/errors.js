class UnknownError extends Error {
    constructor(message = 'Unknown database error') {
        super(message);
        this.name = 'UnknownError';
    }
}

class TaskNotFoundError extends Error {
    constructor(message = 'Task not found') {
        super(message);
        this.name = 'TaskNotFoundError';
    }
}

module.exports = {
    UnknownError,
    TaskNotFoundError
};
