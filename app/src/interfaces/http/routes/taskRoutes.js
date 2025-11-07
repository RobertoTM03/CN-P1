const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// POST /task
router.post('/', taskController.createTask);

// GET /task/{id}
router.get('/:taskId', taskController.getTaskById);

// PUT /task/{id}
router.put('/:taskId', taskController.updateTask);

// DELETE /task/{id}
router.delete('/:taskId', taskController.deleteTask);

module.exports = router;
