import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { IShopList } from 'src/app/models/shopList.model';

@Injectable({ providedIn: 'root' })
export class ShopListApiService {

  #httpservice = inject(HttpClient);
  #baseUrl = inject(ConfigurationService).config.serverUrl;
  
  saveList = (shopList:IShopList) => this.#httpservice.post<boolean>(`${this.#baseUrl}/shopList/create`,shopList);
  getShopListSatistic= (userId:number) => this.#httpservice.get<IShopList>(`${this.#baseUrl}/shopList/satistic/${userId}`);
}
