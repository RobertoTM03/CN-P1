const { DynamoDB } = require('aws-sdk');

const dynamoDbClient = new DynamoDB.DocumentClient({
});

module.exports = dynamoDbClient;