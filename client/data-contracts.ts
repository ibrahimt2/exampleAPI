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

export interface Todo {
  /** @example 1 */
  id: number;
  /** @example "Buy groceries" */
  title: string;
  /** @example false */
  completed: boolean;
}

export interface NewTodo {
  /** @example "Buy groceries" */
  title: string;
  /** @example false */
  completed?: boolean;
}
