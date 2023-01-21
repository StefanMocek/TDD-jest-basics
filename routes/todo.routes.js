const express = require("express");
const TodoController = require("../controllers/todo-controller");

const router = express.Router();

router.route("/").post(TodoController.createTodo).get(TodoController.getTodos)
router.route("/:todoId").get(TodoController.getTodoById).put(TodoController.updateTodo).delete(TodoController.deleteTodo);

module.exports = router;