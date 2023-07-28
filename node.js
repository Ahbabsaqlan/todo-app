// app.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Int32 } = require('mongodb');

// Replace 'YOUR_MONGODB_URI' with your actual MongoDB connection string
const mongoURI = 'mongodb+srv://ahbabzami3:azamicalo@todo-app.2fkraaj.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: false })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

const todoSchema = new mongoose.Schema({
  todo: String,
  status: String,
});

const Todo = mongoose.model('Todo', todoSchema);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define the routes for CRUD operations
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const newTodo = new Todo(req.body);
    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    await Todo.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
