import { Injectable, inject } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Metadata } from '../shared/models/metadata.model';
import { pipe, switchMap } from 'rxjs';
import { GlobalApiService } from '../core/services/api/global-api-service';

export interface GlobalRootState {
  readonly comanyList: Metadata[];
  readonly categoryList: Metadata[];
}

@Injectable({ providedIn: 'root' })
export class GlobalRootStore extends ComponentStore<GlobalRootState> {
  #globalApiService = inject(GlobalApiService);

  constructor() {
    super({
      comanyList: [],
      categoryList: [],
    });
    this.getComanyList();
    this.getCategoryList();
  }

  readonly comanyList$ = this.select(({ comanyList }) => comanyList);
  readonly categoryList$ = this.select(({ categoryList }) => categoryList);

  readonly getComanyList = this.effect<void>(
    pipe(
      switchMap(() =>
        this.#globalApiService.getComanyList().pipe(
          tapResponse(
            (companies) => this.patchState({ comanyList: companies }),
            (error: Error) => console.log(error.message)
          )
        )
      )
    )
  );

  readonly getCategoryList = this.effect<void>(
    pipe(
      switchMap(() =>
        this.#globalApiService.getCategoryList().pipe(
          tapResponse(
            (categories) => this.patchState({ categoryList: categories }),
            (error: Error) => console.log(error.message)
          )
        )
      )
    )
  );
}
