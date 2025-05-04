import pytest
from todo_api_client.client import Client
from todo_api_client.models.new_todo import NewTodo
from todo_api_client.models.todo import Todo
from todo_api_client.api.default import (
    create_todo,
    get_todos,
    get_todo_by_id,
    update_todo,
)

BASE_URL = "http://localhost:5000"

@pytest.fixture(scope="session")
def client():
    return Client(base_url=BASE_URL, timeout=1.0)

@pytest.fixture
def created_todo_id(client):
    new_todo = NewTodo(title="Integration Test Todo")
    created = create_todo.sync(client=client, body=new_todo)
    assert created.title == "Integration Test Todo"
    assert created.completed is False
    return created.id

def test_list_todos(client):
    todos = get_todos.sync(client=client)
    assert isinstance(todos, list)

def test_create_todo(client):
    new_todo = NewTodo(title="Integration Test Todo")
    created = create_todo.sync(client=client, body=new_todo)
    assert created.title == "Integration Test Todo"
    assert created.completed is False

def test_get_todo_by_id(client, created_todo_id):
    todo = get_todo_by_id.sync(client=client, todo_id=created_todo_id)
    assert todo.id == created_todo_id

def test_404_get(client):
    todo = get_todo_by_id.sync(client=client, todo_id=-1)
    assert todo is None

def test_400_create_invalid(client):
    with pytest.raises(Exception):
        create_todo.sync(client=client, body={})  # Invalid type

def test_update_todo(client, created_todo_id):
    updated = Todo(id=created_todo_id, title="Updated Title", completed=True)
    result = update_todo.sync(client=client, todo_id=created_todo_id, body=updated)
    assert result.title == "Updated Title"
    assert result.completed is True

def test_400_update_invalid(client, created_todo_id):
    with pytest.raises(Exception):
        update_todo.sync(client=client, todo_id=created_todo_id, body={"id": created_todo_id})

def test_404_update(client):
    fake = Todo(id=-1, title="Doesn't exist", completed=False)
    result = update_todo.sync(client=client, todo_id=-1, body=fake)
    assert result is None
    print("✅ test_404_update passed")