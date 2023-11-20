import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { IUser } from 'src/app/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserApiService {

  #httpservice = inject(HttpClient);
  #baseUrl = inject(ConfigurationService).config.serverUrl;
  
  saveUser = (user:IUser) => this.#httpservice.post<IUser>(`${this.#baseUrl}/user/create`,user);
  login = (email: string ) => this.#httpservice.post<IUser>(`${this.#baseUrl}/user/login?email=${email}`,{});

}
