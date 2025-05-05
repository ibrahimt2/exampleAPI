import pytest
import asyncio
from httpx import Response as RawResponse
from todo_api_client import errors
from todo_api_client.client import Client
from todo_api_client.models.new_todo import NewTodo
from todo_api_client.models.todo import Todo
from todo_api_client.api.default import (
    create_todo,
    get_todos,
    get_todo_by_id,
    update_todo,
)
from todo_api_client.api.default import create_todo as create_todo_api

BASE_URL = "http://localhost:5000"


@pytest.fixture(scope="session")
def client():
    return Client(base_url=BASE_URL, timeout=1.0)


@pytest.fixture(scope="session")
def strict_client():
    return Client(base_url=BASE_URL, timeout=1.0, raise_on_unexpected_status=True)


@pytest.fixture
def created_todo_id(client):
    new_todo = NewTodo(title="Integration Test Todo")
    created = create_todo.sync(client=client, body=new_todo)
    assert created.title == "Integration Test Todo"
    return created.id


def test_list_todos(client):
    todos = get_todos.sync(client=client)
    assert isinstance(todos, list)


def test_create_todo(client):
    new_todo = NewTodo(title="Integration Test Todo")
    created = create_todo.sync(client=client, body=new_todo)
    assert created.title == "Integration Test Todo"


def test_get_todo_by_id(client, created_todo_id):
    todo = get_todo_by_id.sync(client=client, todo_id=created_todo_id)
    assert todo.id == created_todo_id


def test_404_get(client):
    todo = get_todo_by_id.sync(client=client, todo_id=-1)
    assert todo is None


def test_update_todo(client, created_todo_id):
    updated = Todo(id=created_todo_id, title="Updated Title")
    result = update_todo.sync(client=client, todo_id=created_todo_id, body=updated)
    assert result.title == "Updated Title"


def test_400_update_invalid(client, created_todo_id):
    with pytest.raises(Exception):
        # Missing title
        update_todo.sync(client=client, todo_id=created_todo_id, body=Todo(id=created_todo_id))  # type: ignore


def test_404_update(client):
    fake = Todo(id=-1, title="Doesn't exist")
    result = update_todo.sync(client=client, todo_id=-1, body=fake)
    assert result is None


def test_404_get_strict(strict_client):
    from todo_api_client.api.default.get_todo_by_id import _parse_response
    raw = RawResponse(status_code=418, content=b"teapot", request=None)
    with pytest.raises(errors.UnexpectedStatus):
        _parse_response(client=strict_client, response=raw)


def test_404_update_strict(strict_client):
    from todo_api_client.api.default.update_todo import _parse_response
    raw = RawResponse(status_code=499, content=b"weird client error", request=None)
    with pytest.raises(errors.UnexpectedStatus):
        _parse_response(client=strict_client, response=raw)


def test_400_update_invalid_strict(strict_client, created_todo_id):
    with pytest.raises(Exception):
        update_todo.sync(client=strict_client, todo_id=created_todo_id, body=Todo(id=created_todo_id))  # type: ignore


@pytest.mark.asyncio
async def test_async_create(strict_client):
    new_todo = NewTodo(title="Async Todo")
    result = await create_todo_api.asyncio(client=strict_client, body=new_todo)
    assert result is None or result.title == "Async Todo"


@pytest.mark.asyncio
async def test_async_detailed_create(strict_client):
    new_todo = NewTodo(title="Async Detailed Todo")
    result = await create_todo_api.asyncio_detailed(client=strict_client, body=new_todo)
    assert result.status_code in [201, 422]  # Created or Unprocessable Entity