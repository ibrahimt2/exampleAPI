import axios from "axios";
import { getTodos, createTodo, getTodoById, updateTodo } from "../../client/sdk.gen";

// These tests assume your Flask server is running at http://localhost:5000.
// If your server uses a self-signed certificate, you might need to disable TLS checking:
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Define a local fail helper (since Jest's global fail may not be available).
const fail = (msg: string): never => {
  throw new Error(msg);
};

describe("Todo API Integration Tests", () => {
  let createdTodoId: number | undefined;
  const testTitle = `Integration Test Todo ${Date.now()}`;

  // GET /todos: List todos.
  it("should list todos (GET /todos)", async () => {
    const response = await getTodos();
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  // POST /todos: Create a new todo.
  it("should create a new todo (POST /todos) and default 'completed' to false", async () => {
    const newTodo = { title: testTitle };
    const response = await createTodo({ body: newTodo });
    expect(response.status).toBe(201);
    const todo = response.data;
    expect(todo).toBeDefined();
    expect(todo).toHaveProperty("id");
    expect(todo?.title).toBe(testTitle);
    // The API should default "completed" to false when omitted.
    expect(todo?.completed).toBe(false);
    createdTodoId = todo?.id;
  });

  // GET /todos/{todoId}: Fetch an existing todo.
  it("should fetch the created todo (GET /todos/{todoId})", async () => {
    if (createdTodoId === undefined) {
      throw new Error("Todo was not created");
    }
    const response = await getTodoById({ path: { todoId: createdTodoId } });
    expect(response.status).toBe(200);
    const todo = response.data;
    expect(todo).toBeDefined();
    expect(todo?.id).toBe(createdTodoId);
    expect(todo?.title).toBe(testTitle);
  });

  // GET /todos/{todoId}: Fetch a non-existent todo to trigger a 404.
  it("should return 404 for non-existent todo (GET /todos/{todoId})", async () => {
    let errorResponse;
    try {
      // Pass throwOnError: true to force the client to throw on non-2xx response.
      await getTodoById({ path: { todoId: -1 }, throwOnError: true });
      fail("Expected to receive a 404 error for a non-existent todo");
    } catch (error: any) {
      errorResponse = error;
    }
    expect(errorResponse).toBeDefined();
    if (axios.isAxiosError(errorResponse)) {
      expect(errorResponse.response?.status).toBe(404);
    } else {
      throw errorResponse;
    }
  });

  // POST /todos: Attempt to create a new todo without a title, expecting a 400.
  it("should return 400 when creating a new todo without a title (POST /todos)", async () => {
    let errorResponse;
    try {
      await createTodo({ body: {} as any, throwOnError: true });
      fail("Expected a 400 error due to missing 'title'");
    } catch (error: any) {
      errorResponse = error;
    }
    expect(errorResponse).toBeDefined();
    if (axios.isAxiosError(errorResponse)) {
      expect(errorResponse.response?.status).toBe(400);
    } else {
      throw errorResponse;
    }
  });

  // PUT /todos/{todoId}: Update an existing todo.
  it("should update the created todo (PUT /todos/{todoId})", async () => {
    if (createdTodoId === undefined) {
      throw new Error("Todo was not created");
    }
    const updatedTitle = `${testTitle} Updated`;
    const updatedTodo = { id: createdTodoId, title: updatedTitle, completed: true };
    const response = await updateTodo({
      path: { todoId: createdTodoId },
      body: updatedTodo,
    });
    expect(response.status).toBe(200);
    const todo = response.data;
    expect(todo).toBeDefined();
    expect(todo?.id).toBe(createdTodoId);
    expect(todo?.title).toBe(updatedTitle);
    expect(todo?.completed).toBe(true);
  });

  // PUT /todos/{todoId}: Update an existing todo with missing required fields; expect a 400.
  it("should return 400 when updating a todo with missing required fields (PUT /todos/{todoId})", async () => {
    if (createdTodoId === undefined) {
      throw new Error("Todo was not created");
    }
    let errorResponse;
    try {
      await updateTodo({
        path: { todoId: createdTodoId },
        // Body is missing 'completed'
        body: { id: createdTodoId, title: "Incomplete Update" } as any,
        throwOnError: true,
      });
      fail("Expected a 400 error for missing required fields");
    } catch (error: any) {
      errorResponse = error;
    }
    expect(errorResponse).toBeDefined();
    if (axios.isAxiosError(errorResponse)) {
      expect(errorResponse.response?.status).toBe(400);
    } else {
      throw errorResponse;
    }
  });

  // PUT /todos/{todoId}: Update a non-existent todo; expect a 404.
  it("should return 404 when updating a non-existent todo (PUT /todos/{todoId})", async () => {
    let errorResponse;
    try {
      await updateTodo({
        path: { todoId: -1 },
        body: { id: -1, title: "Non-existent", completed: false },
        throwOnError: true,
      });
      fail("Expected a 404 error for a non-existent todo");
    } catch (error: any) {
      errorResponse = error;
    }
    expect(errorResponse).toBeDefined();
    if (axios.isAxiosError(errorResponse)) {
      expect(errorResponse.response?.status).toBe(404);
    } else {
      throw errorResponse;
    }
  });
});