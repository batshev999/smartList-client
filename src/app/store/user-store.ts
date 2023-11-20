import { Injectable, inject } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, pipe, switchMap, tap, withLatestFrom } from 'rxjs';
import { IShopList } from '../models/shopList.model';
import { ShopListApiService } from '../core/services/api/shop-list-api-service';
import { IProductDetailsInShop } from '../models/ProductDetailsInShop.model';
import { UserApiService } from '../core/services/api/user-api-service';
import { IUser } from '../models/user.model';
import { Router } from '@angular/router';

export interface UserState {
  readonly user: IUser;
}

@Injectable({ providedIn: 'root' })
export class UserStore extends ComponentStore<UserState> {
  #userApiService = inject(UserApiService);
  #route = inject(Router);

  readonly user$ = this.select(({ user }) => user);

  constructor() {
    super({
      user: {
      id:  sessionStorage.getItem("userId")?+sessionStorage.getItem("userId")!:-1,
      userName: sessionStorage.getItem("userName")?sessionStorage.getItem("userName")!:"",
      firstName:"",
      lastName:"",
      email:"",
      },
    });
  }

  readonly createUser = this.effect((user$: Observable<IUser>) => {
    return user$.pipe(
      switchMap((user) =>
        this.#userApiService.saveUser(user).pipe(
          tapResponse(
            (res) =>{ this.patchState({ user: res });
            alert("המשתמש נרשם בהצלחה");
            this.#route.navigate(['login']);
          },
            (error: Error) => console.log('error', error)
          )
        )
      )
    );
  });

  readonly login = this.effect((email$: Observable<string>) => {
    return email$.pipe(
      switchMap((email) =>
        this.#userApiService.login(email).pipe(
          tapResponse(
            (res) => {
              this.patchState({ user: res });
              sessionStorage.setItem("userId",String(res.id));
              sessionStorage.setItem("userName",res.userName);
              this.#route.navigate(['home']);
            },
            (error: Error) => console.log('error', error)
          )
        )
      )
    );
  });
}
