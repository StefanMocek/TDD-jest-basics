const request = require("supertest");
const app = require("../../app");
const newTodo = require("../mock-data/new-todo.json");

const endpointUrl = "/todos/";

let firstTodo, newTodoId;
const nonexistingId = "63ca8b3b2d62d4d1bae434b5";
const testData = {title: "PUT test data", done: true}

beforeAll(() => jest.setTimeout(60000))

describe(endpointUrl, () => {
  it("GET" + endpointUrl, async () => {
    const res = await request(app).get(endpointUrl);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy;
    expect(res.body[0].title).toBeDefined();
    expect(res.body[0].done).toBeDefined();

    firstTodo = res.body[0];
  });

  it("GET by ID" + endpointUrl + ":todoId", async () => {
    const res = await request(app).get(endpointUrl + firstTodo._id);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(firstTodo.title);
    expect(res.body.done).toBe(firstTodo.done);
  });

  it("GET todoById id doesnt exist" + endpointUrl + ":todoId", async () => {
    const res = await request(app)
      .get(endpointUrl + nonexistingId);
    expect(res.statusCode).toBe(404);
  })

  it("POST" + endpointUrl, async () => {
    const respone = await request(app)
      .post(endpointUrl)
      .send(newTodo);

    expect(respone.statusCode).toBe(201);
    expect(respone.body.title).toStrictEqual(newTodo.title);
    expect(respone.body.done).toStrictEqual(newTodo.done);
    newTodoId = respone.body._id;
  });

  it("POST should return error 500 on malformed data with POST" + endpointUrl, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .send({title: "No done property"});
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({message: "Todo validation failed: done: Path `done` is required."})
  });

  it("PUT should update todo" + endpointUrl, async () => {
    const respone = await request(app)
      .put(endpointUrl + newTodoId)
      .send(testData)
    expect(respone.statusCode).toBe(200)
    expect(respone.body.title).toStrictEqual(testData.title);
    expect(respone.body.done).toStrictEqual(testData.done);
  });

  it("PUT todo id doesnt exist" + endpointUrl + ":todoId", async () => {
    const res = await request(app)
      .get(endpointUrl + nonexistingId);
    expect(res.statusCode).toBe(404);
  });

  it("DELETE" + endpointUrl + ":todoId", async () => {
    const res = await request(app)
      .delete(endpointUrl + newTodoId)
      .send();
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toStrictEqual(testData.title);
    expect(res.body.done).toStrictEqual(testData.done);
  });

  it("DELETE todo id doesnt exist" + endpointUrl + ":todoId", async () => {
    const res = await request(app)
      .delete(endpointUrl + nonexistingId)
      .send();
    expect(res.statusCode).toBe(404);
  });
})