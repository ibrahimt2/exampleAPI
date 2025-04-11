"""
Simple Todo API using Flask

This server exposes a RESTful API for managing todo items. 
It supports listing todos, creating new ones, fetching individual todos by ID,
and updating existing todos. The API conforms to an OpenAPI 3.0.3 specification 
with custom extensions like `x-operationname` to assist in client code generation.

Endpoints:
  GET    /todos             - Retrieve a list of todos
  POST   /todos             - Create a new todo
  GET    /todos/<todoId>    - Retrieve a specific todo
  PUT    /todos/<todoId>    - Update a specific todo
"""

from flask import Flask, request, jsonify, abort

app = Flask(__name__)

# In-memory store for todos and auto-increment counter for new todos
todos = []
next_id = 1

@app.route('/todos', methods=['GET'])
def list_todos():
    """
    GET /todos
    Retrieve a list of all todo items.

    Returns:
        200 OK with a JSON array of todos.

    x-operationname: listTodos
    """
    return jsonify(todos), 200

@app.route('/todos', methods=['POST'])
def add_todo():
    """
    POST /todos
    Create a new todo item.

    Request JSON Body:
    {
        "title": "string"   # Required
    }

    Returns:
        201 Created with the created todo object.

    x-operationname: addTodo
    """
    global next_id
    data = request.get_json()
    if not data or 'title' not in data:
        abort(400, description="Missing required field 'title'")
    
    todo = {
        'id': next_id,
        'title': data['title']
    }
    todos.append(todo)
    next_id += 1
    return jsonify(todo), 201

@app.route('/todos/<int:todoId>', methods=['GET'])
def fetch_todo(todoId):
    """
    GET /todos/<todoId>
    Retrieve a specific todo item by ID.

    Returns:
        200 OK with the todo object if found.
        404 Not Found if the ID does not exist.

    x-operationname: fetchTodo
    """
    todo = next((item for item in todos if item['id'] == todoId), None)
    if todo is None:
        abort(404, description="Todo not found")
    return jsonify(todo), 200

@app.route('/todos/<int:todoId>', methods=['PUT'])
def modify_todo(todoId):
    """
    PUT /todos/<todoId>
    Update an existing todo item by ID.

    Request JSON Body:
    {
        "title": "string"   # Required
    }

    Returns:
        200 OK with the updated todo object.
        400 Bad Request if required fields are missing.
        404 Not Found if the ID does not exist.

    x-operationname: modifyTodo
    """
    data = request.get_json()
    if not data or 'title' not in data:
        abort(400, description="Missing required field 'title'")
    
    todo = next((item for item in todos if item['id'] == todoId), None)
    if todo is None:
        abort(404, description="Todo not found")
    
    todo['title'] = data['title']
    return jsonify(todo), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)