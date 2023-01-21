const TodoController = require("../../controllers/todo-controller");
const TodoModel = require("../../models/todo.model");
const httpMocks = require("node-mocks-http");
const newTodo = require("../mock-data/new-todo.json");
const allTodos = require("../mock-data/all-todos.json");

jest.mock("../../models/todo.model");

beforeAll(() => jest.setTimeout(60000))

let req, res, next;
const todoId = "63ca8b3b2d62d4d1bae434bd";

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
})

describe("TodoController.deleteTodo", () => {
  test("1. should have a deleteTodo function", () => {
    expect(typeof TodoController.deleteTodo).toBe("function")
  });

  it("2. should delete todo with TodoModel.findByIdAndDelete", async () => {
    req.params.todoId = todoId;
    await TodoController.deleteTodo(req, res, next);
    expect(TodoModel.findByIdAndDelete).toHaveBeenCalledWith(todoId)
  });

  it("3. should return json data and response code 200", async () => {
    req.params.todoId = todoId;
    TodoModel.findByIdAndDelete.mockReturnValue(newTodo);
    await TodoController.deleteTodo(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  it("4. sholud handle error", async () => {
    const errorMessage = {message: "Error deleting todo"};
    const rejectedProsmie = Promise.reject(errorMessage);
    TodoModel.findByIdAndDelete.mockReturnValue(rejectedProsmie);
    await TodoController.deleteTodo(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });

  it("5. Should return 404 when item doesnt exist", async () => {
    TodoModel.findByIdAndDelete.mockReturnValue(null);
    await TodoController.deleteTodo(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  })
})

describe("TodoController.updateTodo", () => {
  test("1. should have a updateTodo function", () => {
    expect(typeof TodoController.updateTodo).toBe("function")
  });

  it("2. should update to do with TodoModel.findByIdAndUpdate", async () => {
    req.params.todoId = todoId;
    req.body = newTodo;
    await TodoController.updateTodo(req, res, next);
    expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId, newTodo, {new: true, useFindAndModify: false})
  })

  it("3. should return json data and response code 200", async () => {
    req.params.todoId = todoId;
    req.body = newTodo;
    TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);
    await TodoController.updateTodo(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  it("4. sholud handle error", async () => {
    const errorMessage = {message: "Error updating todo"};
    const rejectedProsmie = Promise.reject(errorMessage);
    TodoModel.findByIdAndUpdate.mockReturnValue(rejectedProsmie);
    await TodoController.updateTodo(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });

  it("5. Should return 404 when item doesnt exist", async () => {
    TodoModel.findByIdAndUpdate.mockReturnValue(null);
    await TodoController.updateTodo(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  })
})

describe("TodoController.getTodoById", () => {
  test("1. should have a getTodos function", () => {
    expect(typeof TodoController.getTodoById).toBe("function")
  });

  it("2. should call TodoModel.findById with route parameters", async () => {
    req.params.todoId = todoId;
    await TodoController.getTodoById(req, res, next);
    expect(TodoModel.findById).toHaveBeenCalledWith(todoId)
  });

  it("3. should return json body and response code 200", async () => {
    TodoModel.findById.mockReturnValue(newTodo);
    await TodoController.getTodoById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  it("4. Should handle errors", async () => {
    const errorMessage = {message: "Error finding todo"};
    const rejectedProsmie = Promise.reject(errorMessage);
    TodoModel.findById.mockReturnValue(rejectedProsmie);
    await TodoController.getTodoById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });

  it("5. Should return 404 when item doesnt exist", async () => {
    TodoModel.findById.mockReturnValue(null);
    await TodoController.getTodoById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  })
})

describe("TodoController.getTodos", () => {
  it("1. should have a getTodos function", () => {
    expect(typeof TodoController.getTodos).toBe("function")
  });

  it("2. should call TodoModel.find", async () => {
    await TodoController.getTodos(req, res, next);
    expect(TodoModel.find).toHaveBeenCalledWith({})
  });

  it("3. sholud return res with status 200 and all todos", async () => {
    TodoModel.find.mockReturnValue(allTodos);
    await TodoController.getTodos(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(allTodos);
  });

  it("4. Should handle errors", async () => {
    const errorMessage = {message: "Error occured"};
    const rejectedProsmie = Promise.reject(errorMessage);
    TodoModel.find.mockReturnValue(rejectedProsmie);
    await TodoController.getTodos(req, res, next);
    expect(next).toBeCalledWith(errorMessage)
  })
})

describe("TodoController.createTodo", () => {
  beforeEach(() => {
    req.body = newTodo;
  })

  it("1. should have a createTodo function", () => {
    expect(typeof TodoController.createTodo).toBe("function")
  });

  it("2. should call TodoModel.create", () => {
    TodoController.createTodo(req, res, next);
    expect(TodoModel.create).toBeCalledWith(newTodo);
  });

  it("3. should return 201 response code", async () => {
    await TodoController.createTodo(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy
  });

  it("4. should json body in resposne", async () => {
    TodoModel.create.mockReturnValue(newTodo);
    await TodoController.createTodo(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newTodo);
  })

  it("5. Should handle errors", async () => {
    const errorMessage = {message: "Done property is missing"};
    const rejectedProsmie = Promise.reject(errorMessage);

    TodoModel.create.mockReturnValue(rejectedProsmie);
    await TodoController.createTodo(req, res, next);
    expect(next).toBeCalledWith(errorMessage)
  })
})