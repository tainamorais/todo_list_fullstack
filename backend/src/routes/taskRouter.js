const express = require('express');
const taskController = require('../controllers/taskController');
const { validateFieldTitle, validateFieldStatus } = require('../middlewares/tasksMiddleware');

const taskRouter = express.Router();

taskRouter.get('/tasks', taskController.getAll);

taskRouter.post(
  '/tasks',
  validateFieldTitle,
  taskController.createTask
);

taskRouter.delete('/tasks/:id', taskController.deleteTask);

taskRouter.put(
  '/tasks/:id',
  validateFieldTitle,
  validateFieldStatus,
  taskController.updateTask
);

module.exports = taskRouter;