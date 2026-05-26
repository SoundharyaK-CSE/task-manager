const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');

// GET /api/tasks - get all tasks
router.get('/', protect, getTasks);

// POST /api/tasks - create a task
router.post('/', protect, createTask);

// PUT /api/tasks/:id - update a task
router.put('/:id', protect, updateTask);

// DELETE /api/tasks/:id - delete a task
router.delete('/:id', protect, deleteTask);

module.exports = router;