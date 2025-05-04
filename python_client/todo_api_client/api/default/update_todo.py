from http import HTTPStatus
from typing import Any, Optional, Union, cast

import httpx

from ...client import AuthenticatedClient, Client
from ...types import Response, UNSET
from ... import errors

from ...models.todo import Todo
from typing import cast



def _get_kwargs(
    todo_id: int,
    *,
    body: Todo,

) -> dict[str, Any]:
    headers: dict[str, Any] = {}


    

    

    _kwargs: dict[str, Any] = {
        "method": "put",
        "url": "/todos/{todo_id}".format(todo_id=todo_id,),
    }

    _body = body.to_dict()


    _kwargs["json"] = _body
    headers["Content-Type"] = "application/json"

    _kwargs["headers"] = headers
    return _kwargs


def _parse_response(*, client: Union[AuthenticatedClient, Client], response: httpx.Response) -> Optional[Union[Any, Todo]]:
    if response.status_code == 200:
        response_200 = Todo.from_dict(response.json())



        return response_200
    if response.status_code == 400:
        response_400 = cast(Any, None)
        return response_400
    if response.status_code == 404:
        response_404 = cast(Any, None)
        return response_404
    if client.raise_on_unexpected_status:
        raise errors.UnexpectedStatus(response.status_code, response.content)
    else:
        return None


def _build_response(*, client: Union[AuthenticatedClient, Client], response: httpx.Response) -> Response[Union[Any, Todo]]:
    return Response(
        status_code=HTTPStatus(response.status_code),
        content=response.content,
        headers=response.headers,
        parsed=_parse_response(client=client, response=response),
    )


def sync_detailed(
    todo_id: int,
    *,
    client: Union[AuthenticatedClient, Client],
    body: Todo,

) -> Response[Union[Any, Todo]]:
    """ Update a specific todo by ID

    Args:
        todo_id (int):
        body (Todo):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[Union[Any, Todo]]
     """


    kwargs = _get_kwargs(
        todo_id=todo_id,
body=body,

    )

    response = client.get_httpx_client().request(
        **kwargs,
    )

    return _build_response(client=client, response=response)

def sync(
    todo_id: int,
    *,
    client: Union[AuthenticatedClient, Client],
    body: Todo,

) -> Optional[Union[Any, Todo]]:
    """ Update a specific todo by ID

    Args:
        todo_id (int):
        body (Todo):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Union[Any, Todo]
     """


    return sync_detailed(
        todo_id=todo_id,
client=client,
body=body,

    ).parsed

async def asyncio_detailed(
    todo_id: int,
    *,
    client: Union[AuthenticatedClient, Client],
    body: Todo,

) -> Response[Union[Any, Todo]]:
    """ Update a specific todo by ID

    Args:
        todo_id (int):
        body (Todo):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[Union[Any, Todo]]
     """


    kwargs = _get_kwargs(
        todo_id=todo_id,
body=body,

    )

    response = await client.get_async_httpx_client().request(
        **kwargs
    )

    return _build_response(client=client, response=response)

async def asyncio(
    todo_id: int,
    *,
    client: Union[AuthenticatedClient, Client],
    body: Todo,

) -> Optional[Union[Any, Todo]]:
    """ Update a specific todo by ID

    Args:
        todo_id (int):
        body (Todo):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Union[Any, Todo]
     """


    return (await asyncio_detailed(
        todo_id=todo_id,
client=client,
body=body,

    )).parsed
