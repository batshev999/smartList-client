import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { IProduct } from 'src/app/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductApiService {

  #httpservice = inject(HttpClient);
  #baseUrl = inject(ConfigurationService).config.serverUrl;

  getProductList = () => this.#httpservice.get<IProduct[]>(`${this.#baseUrl}/products/getList`);
  addProduct = (product:IProduct) => this.#httpservice.post<IProduct>(`${this.#baseUrl}/products/add`,product);
}
