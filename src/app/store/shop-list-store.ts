import { Injectable, inject } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import {
  Observable,
  filter,
  map,
  pipe,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';

import { ProductApiService } from '../core/services/api/product-api-service';
import { IProduct } from '../models/product.model';
import { IShopList } from '../models/shopList.model';
import { ShopListApiService } from '../core/services/api/shop-list-api-service';
import { IProductDetailsInShop } from '../models/ProductDetailsInShop.model';
import { UserStore } from './user-store';
import { ProductStore } from './product-store';

export interface ShopListState {
  readonly shopList: IShopList;
}

@Injectable({ providedIn: 'root' })
export class ShopListStore extends ComponentStore<ShopListState> {
  #shopListApiService = inject(ShopListApiService);
  #userStore = inject(UserStore);
  #productStore= inject(ProductStore);

  readonly shopList$ = this.select(({ shopList }) => shopList);

  constructor() {
    super({
      shopList: {
        userId: -1,
        date: new Date(),
        productDetailsInShops: [],
        isUsedSatistic:true
      },
    });
    this.updateUserIdInShopList(
      this.#userStore.user$.pipe(
        filter((u) => u.id != -1),
        map((u) => u.id)
      )
    );
    this.getShopListSatistic(
      this.#userStore.user$.pipe(
        filter((u) => u.id != -1),
        map((u) => u.id)
      )
    );
  }

  readonly updateProductDetailsInShops = this.updater(
    (state, shopList:IShopList) => ({
      ...state,
      shopList: {
        ...state.shopList,
        productDetailsInShops: shopList.productDetailsInShops,
        isUsedSatistic: shopList.isUsedSatistic
      },
    })
  );

  readonly updateUserIdInShopList = this.updater((state, userId: number) => ({
    ...state,
    shopList: {
      ...state.shopList,
      userId: userId,
    },
  }));

  readonly getShopListSatistic = this.effect((userId$: Observable<number>) =>
    userId$.pipe(
      switchMap((userId) =>
        this.#shopListApiService.getShopListSatistic(userId).pipe(
          tapResponse(
            (res) =>{
              this.patchState({
                shopList: {
                  userId: res.userId,
                  date: res.date,
                  productDetailsInShops: res.productDetailsInShops,
                  isUsedSatistic:true
                },
              });
            this.#productStore.updateNewProduct(res.productDetailsInShops)
            },
            (error: Error) => console.log('error:', error)
          )
        )
      )
    )
  );

  readonly saveList = this.effect<void>(
    pipe(
      withLatestFrom(this.select(({ shopList }) => shopList)),
      switchMap(([_, shopList]) =>
        this.#shopListApiService.saveList(shopList).pipe(
          tapResponse(
            (proucts) => alert(''),
            (error: Error) => console.log(error.message)
          )
        )
      )
    )
  );
}
