const mognoose = require("mongoose");

const TodoSchema = new mognoose.Schema({
  title: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
    required: true
  }
});

const TodoModel = mognoose.model("Todo", TodoSchema);
module.exports = TodoModel;