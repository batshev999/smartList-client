import { Injectable, inject } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, pipe, switchMap, tap, withLatestFrom } from 'rxjs';

import { ProductApiService } from '../core/services/api/product-api-service';
import { IProduct } from '../models/product.model';

export interface ProductState {
  readonly proucts: IProduct[];
  readonly newProuct: IProduct[]|null;
}

@Injectable({ providedIn: 'root' })
export class ProductStore extends ComponentStore<ProductState> {
  #productApiService = inject(ProductApiService);

  readonly products$ = this.select(({ proucts }) => proucts);
  readonly newProuct$ = this.select(({ newProuct }) => newProuct);


  constructor() {
    super({
      proucts: [],
      newProuct:null
    });
    this.getProductList();
  }

  readonly getProductList = this.effect<void>(
    pipe(
      switchMap(() =>
        this.#productApiService.getProductList().pipe(
          tapResponse(
            (proucts) => this.patchState({ proucts }),
            (error: Error) => console.log(error.message)
          )
        )
      )
    )
  );

  readonly addProduct = this.effect((product$: Observable<IProduct>) => {
    return product$.pipe(
      switchMap(product=>this.#productApiService.addProduct(product)),
      withLatestFrom(this.select((all) => all)),
      tap(([res,state]) =>{
        this.patchState({
          proucts:[...state.proucts,{...res,isNew:true}]
        });
        alert("המוצר שלך נוסף בהצלחה")
        // this.updateNewProduct([res]);
      }
      )
    );
  });

  readonly updateNewProduct = this.updater((state, product:IProduct[]) => ({
    ...state,
    newProuct: product.map(x=>{return{...x,isNew:true}}),
  }));
}
