const Task = require('../models/Task');

// Get all tasks for logged in user
const getTasks = async (req, res) => {
  try {
    // Find only tasks that belong to this user
    const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new task
const createTask = async (req, res) => {
  const { title, description, dueDate, priority } = req.body;
  try {
    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      user: req.userId  // attach this task to the logged in user
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    // Check if task exists
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if this task belongs to the logged in user
    if (task.user.toString() !== req.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }  // return the updated task
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    // Check if task exists
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if this task belongs to the logged in user
    if (task.user.toString() !== req.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };