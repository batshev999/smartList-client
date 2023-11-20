import { inject } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { pipe, switchMap, tap, Observable } from 'rxjs';
import { todoApiService } from '../core/services/api/todo-api-service';
import { ITodo } from '../models/Todo.model';

export interface TodoState {
  readonly todos: ITodo[];
  readonly loading: boolean;
  error?: string;
}

export class TodoStore extends ComponentStore<TodoState> {
  #todoService = inject(todoApiService);

  constructor() {
    super({
      todos: [],
      loading: false,
    });
    this.fetchTodo()
  }

  readonly todos$ = this.select(({ todos }) => todos);
  readonly loading$ = this.select(({ loading }) => loading);
  readonly error$ = this.select(({ error }) => error);

  readonly vm$ = this.select(
    {
      todos: this.todos$,
      loading: this.loading$,
      error: this.error$,
    },
    { debounce: true }
  );

  readonly fetchTodo = this.effect<void>(
    pipe(
      tap(() => this.patchState({ loading: true })),
      switchMap(() =>
        this.#todoService.getAllTodo().pipe(
          tapResponse(
            (todos) => this.patchState({ todos, loading: false }),
            (error: Error) =>
              this.patchState({ error: error.message, loading: false })
          )
        )
      )
    )
  );

  readonly updateTodo = this.effect((todo$: Observable<ITodo>) =>
  todo$.pipe(
      tap(() => this.patchState({ loading: true })),
      switchMap((todo) =>
        this.#todoService.update(todo).pipe(
          tapResponse(
            (todo) => this.updateTodos(todo),
            (error: Error) =>
              this.patchState({ error: error.message, loading: false })
          )
        )
      )
    )
  );

  private readonly updateTodos = this.updater((state, todo: ITodo) => ({
    error: undefined,
    loading: false,
    todos: state.todos.map((t) => (t.id === todo.id ? { ...todo } : t)),
  }));

  readonly deleteTodo = this.effect<number>(
    pipe(
      tap(() => this.patchState({ loading: true })),
      switchMap((id) =>
        this.#todoService.delete(id).pipe(
          tapResponse(
            () => this.deleteTodoState(id),
            (error: Error) =>
              this.patchState({ error: error.message, loading: false })
          )
        )
      )
    )
  );

  private readonly deleteTodoState = this.updater((state, todoId: number) => ({
    error: undefined,
    loading: false,
    todos: state.todos.filter((todo) => todo.id !== todoId),
  }));
}
