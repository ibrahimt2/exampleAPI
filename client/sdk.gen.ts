// This file is auto-generated by @hey-api/openapi-ts

import type { Options as ClientOptions, TDataShape, Client } from '@hey-api/client-axios';
import type { GetTodosData, GetTodosResponse, CreateTodoData, CreateTodoResponse, GetTodoByIdData, GetTodoByIdResponse, UpdateTodoData, UpdateTodoResponse } from './types.gen';
import { client as _heyApiClient } from './client.gen';

export type Options<TData extends TDataShape = TDataShape, ThrowOnError extends boolean = boolean> = ClientOptions<TData, ThrowOnError> & {
    /**
     * You can provide a client instance returned by `createClient()` instead of
     * individual options. This might be also useful if you want to implement a
     * custom client.
     */
    client?: Client;
    /**
     * You can pass arbitrary values through the `meta` object. This can be
     * used to access values that aren't defined as part of the SDK function.
     */
    meta?: Record<string, unknown>;
};

/**
 * Retrieve a list of todos
 */
export const getTodos = <ThrowOnError extends boolean = false>(options?: Options<GetTodosData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetTodosResponse, unknown, ThrowOnError>({
        url: '/todos',
        ...options
    });
};

/**
 * Create a new todo
 */
export const createTodo = <ThrowOnError extends boolean = false>(options: Options<CreateTodoData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).post<CreateTodoResponse, unknown, ThrowOnError>({
        url: '/todos',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Retrieve a specific todo by ID
 */
export const getTodoById = <ThrowOnError extends boolean = false>(options: Options<GetTodoByIdData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetTodoByIdResponse, unknown, ThrowOnError>({
        url: '/todos/{todoId}',
        ...options
    });
};

/**
 * Update a specific todo by ID
 */
export const updateTodo = <ThrowOnError extends boolean = false>(options: Options<UpdateTodoData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).put<UpdateTodoResponse, unknown, ThrowOnError>({
        url: '/todos/{todoId}',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};