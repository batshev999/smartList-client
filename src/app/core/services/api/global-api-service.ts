import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { IProduct } from 'src/app/models/product.model';
import { Metadata } from 'src/app/shared/models/metadata.model';

@Injectable({ providedIn: 'root' })
export class GlobalApiService {

  #httpservice = inject(HttpClient);
  #baseUrl = inject(ConfigurationService).config.serverUrl;

  getComanyList = () => this.#httpservice.get<Metadata[]>(`${this.#baseUrl}/global/getComanyList`);
  getCategoryList = () => this.#httpservice.get<Metadata[]>(`${this.#baseUrl}/global/getCategoryList`);
}
