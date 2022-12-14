const express = require('express');
const cors = require('cors');

 const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find(user => user.username === username);
  if (!user) {
    return response.status(400).json({error: "User not found!"});
  }
  request.user = user;

  next();
}

function checksExistsTodo(request, response, next) {
  const { id }  = request.params;
  const user = request.user;
  const todo = user.todos.find(todo => todo.id = id);
  if (!todo) {
    return response.status(404).json({error: "Todo not found!"});
  }
  request.todo = todo;

  next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  users.push({
    id: uuidv4(),
    name: name, 
    username: username, 
    todos: []
  });

  return response.status(201).json(users);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {

  const user = request.user;
 
  return response.status(200).json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;

  const user = request.user;

  user.todos.push({
    id: uuidv4(),
    title: title,
    done: false, 
    deadline: new Date(deadline),// '2021-02-27T00:00:00.000Z'
    created_at: new Date()
  });

  return response.status(201).json(user.todos);
});

app.put('/todos/:id', checksExistsUserAccount, checksExistsTodo, (request, response) => {
  const user = request.user;
  const { id }  = request.params;
  const { title, deadline } = request.body;

  const todo = request.todo;

  todo.title = title;
  todo.deadline = deadline;

  return response.status(201).json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, checksExistsTodo, (request, response) => {
  const user = request.user;
  const { id }  = request.params;
  const todo = request.todo;

  todo.done = true;

  return response.status(201).json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, checksExistsTodo, (request, response) => {
  const user = request.user;
  const { id }  = request.params;

  const todo = request.todo;

  user.todos.splice(todo, 1);

  return response.status(201).json(user.todos);
});

module.exports = app;