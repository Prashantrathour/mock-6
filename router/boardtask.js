const express = require('express');
const boardRouter = express.Router();
const Board = require('../model/board');
const Task = require('../model/task');
const Subtask = require('../model/subtask');

boardRouter.post('/create', async (req, res) => {
  try {
    const board = await Board.create(req.body);
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create the board.' });
  }
});

boardRouter.get('/', async (req, res) => {
  try {
    const boards = await Board.find().populate({
      path: 'tasks',
      populate: {
        path: 'subtask',
      },
    });

    const formattedResponse = boards.map((board) => {
      return {
        _id: board._id, 
        name: board.name,
        tasks: board.tasks.map((task) => {
          return {
            _id: task._id,
            title: task.title,
            description: task.description,
            status: task.status,
            subtasks: task.subtask.map((subtask) => {
              return {
                _id: subtask._id,
                title: subtask.title,
                isCompleted: subtask.isCompleted,
              };
            }),
          };
        }),
      };
    });

    res.json(formattedResponse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch boards.........' });
  }
});

boardRouter.post('/tasks_create', async (req, res) => {
  try {
    const task = await Task.create(req.body);
    const board = await Board.findById(req.body.boardId);
    board.tasks.push(task);
    await board.save();
    res.status(201).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to create the task.' });
  }
});

boardRouter.post('/subtasks_create', async (req, res) => {
  try {
    const subtask = await Subtask.create(req.body);
    const task = await Task.findById(req.body.taskId); 
    task.subtask.push(subtask);
    await task.save();
    res.status(201).json(subtask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create the subtask.' });
  }
});

module.exports = boardRouter;
