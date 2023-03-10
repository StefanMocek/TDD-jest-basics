const TodoModel = require("../models/todo.model")

exports.createTodo = async (req, res, next) => {
  try {
    const createdTodo = await TodoModel.create(req.body);
    res.status(201).json(createdTodo)  
  } catch (error) {
    next(error)
  }
};

exports.getTodos = async (req, res, next) => {
  try {
    const allTodos = await TodoModel.find({});
    res.status(200).json(allTodos);  
  } catch (error) {
    next(error)
  }
};

exports.getTodoById = async (req, res, next) => {
  try {
    const theTodo = await TodoModel.findById(req.params.todoId);
    if(theTodo) {
      res.status(200).json(theTodo);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    next(error)
  }
};

exports.updateTodo = async (req, res, next) => {
  try {
    const updatedTodo = await TodoModel.findByIdAndUpdate(req.params.todoId, req.body, {new: true, useFindAndModify: false});
    if (updatedTodo){
      res.status(200).json(updatedTodo);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    next(error)
  }
};

exports.deleteTodo = async (req, res, next) => {
  try {
    const deletedTodo = await TodoModel.findByIdAndDelete(req.params.todoId);
    if (deletedTodo){
      res.status(200).json(deletedTodo);
    } else {
      res.status(404).send()
    }
  } catch (error) {
    next(error);
  }
};