const express = require('express');
const cors = require('cors');
const taskRouter = require('./routes/taskRouter');

const app = express();

app.use(express.json());
app.use(cors());

app.use(taskRouter);

module.exports = app;
