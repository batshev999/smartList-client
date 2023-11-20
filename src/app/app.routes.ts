import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/shop-list/shop-list.component').then((x) => x.ShopListComponent),
    //title: 'Home page',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then((x) => x.RegisterComponent),
   // title: 'Register page',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((x) => x.LoginComponent),
    //title: 'Login page',
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
];
