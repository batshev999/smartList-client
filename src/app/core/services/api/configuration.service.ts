import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAppConfiguration } from './models/configuration.model';

@Injectable({ providedIn: 'root' })
export class ConfigurationService {
  private configu!: IAppConfiguration;
  constructor(private http: HttpClient) { }

  load(url: string): Promise<any> {
    return new Promise((resolve) => {
      this.http.get<IAppConfiguration>(url).subscribe((config) => {
        this.configu = config;
        resolve(null);
      });
    });
  }
  
  get config(): IAppConfiguration {
    return this.configu;
  }
}