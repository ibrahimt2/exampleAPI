/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import { NewTodo, Todo } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Todos<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @name GetTodos
   * @summary Retrieve a list of todos
   * @request GET:/todos
   */
  getTodos = (params: RequestParams = {}) =>
    this.request<Todo[], any>({
      path: `/todos`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @name CreateTodo
   * @summary Create a new todo
   * @request POST:/todos
   */
  createTodo = (data: NewTodo, params: RequestParams = {}) =>
    this.request<Todo, any>({
      path: `/todos`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @name GetTodoById
   * @summary Retrieve a specific todo by ID
   * @request GET:/todos/{todoId}
   */
  getTodoById = (todoId: number, params: RequestParams = {}) =>
    this.request<Todo, void>({
      path: `/todos/${todoId}`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @name UpdateTodo
   * @summary Update a specific todo by ID
   * @request PUT:/todos/{todoId}
   */
  updateTodo = (todoId: number, data: Todo, params: RequestParams = {}) =>
    this.request<Todo, void>({
      path: `/todos/${todoId}`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
