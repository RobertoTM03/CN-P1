const TaskRepository = require('../../domain/repositories/TaskRepository');
const ddb = require('./index');
const Task = require('../../domain/entities/Task');
const { UnknownError, TaskNotFoundError } = require('../../shared/errors');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

class TaskRepositoryImpl extends TaskRepository {
    
    async createTask(taskTitle, taskDescription) {
        const taskId = uuidv4();
        const createdAt = new Date().toISOString();
        
        const params = {
            TableName: TABLE_NAME,
            Item: {
                task_id: taskId,
                title: taskTitle,
                description: taskDescription,
                createdAt: createdAt
            }
        };

        try {
            await ddb.put(params).promise();
            return new Task(
                taskId,
                params.Item.title,
                params.Item.description,
                params.Item.createdAt
            );
        } catch (error) {
            throw new UnknownError(error.message);
        }
    }

    async findAllTasks() {
        const params = { TableName: TABLE_NAME };

        try {
            const result = await ddb.scan(params).promise();
            
            const sortedItems = result.Items.sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            );

            return sortedItems.map(
                row => new Task(row.task_id, row.title, row.description, row.createdAt)
            );
        } catch (error) {
            throw new UnknownError(error.message);
        }
    }

    async findTaskById(taskId) {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                task_id: taskId
            }
        };

        try {
            const result = await ddb.get(params).promise();
            
            if (!result.Item) throw new TaskNotFoundError();

            const row = result.Item;
            return new Task(
                row.task_id,
                row.title,
                row.description,
                row.createdAt
            );
        } catch (error) {
            if (error instanceof TaskNotFoundError) throw error;
            throw new UnknownError(error.message);
        }
    }

    async deleteTaskById(taskId) {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                task_id: taskId
            },
            ReturnValues: 'ALL_OLD'
        };

        try {
            const result = await ddb.delete(params).promise();
            
            if (!result.Attributes) throw new TaskNotFoundError();
            
            return result.Attributes.task_id;
        } catch (error) {
            if (error instanceof TaskNotFoundError) throw error;
            throw new UnknownError(error.message);
        }
    }

    async updateTask(taskId, taskNewTitle, taskNewDescription) {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                task_id: taskId
            },
            UpdateExpression: 'set title = :newTitle, description = :newDesc',
            ExpressionAttributeValues: {
                ':newTitle': taskNewTitle,
                ':newDesc': taskNewDescription
            },
            ReturnValues: 'ALL_NEW',
            ConditionExpression: 'attribute_exists(task_id)'
        };

        try {
            const result = await ddb.update(params).promise();
            const row = result.Attributes;
            
            return new Task(
                row.task_id,
                row.title,
                row.description,
                row.createdAt
            );
        } catch (error) {
            if (error.code === 'ConditionalCheckFailedException') {
                throw new TaskNotFoundError();
            }
            throw new UnknownError(error.message);
        }
    }
}

module.exports = TaskRepositoryImpl;