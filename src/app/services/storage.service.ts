import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  router = inject(Router);

  clean(): void {
    window.sessionStorage.clear();
    window.localStorage.clear();
  }

  public saveUser(user: any, rememberMe: boolean = false): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.localStorage.removeItem(USER_KEY);

    const storage = rememberMe ? window.localStorage : window.sessionStorage;
    storage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY) || window.sessionStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : {};
  }

  public isLoggedIn(): boolean {
    return !!(window.localStorage.getItem(USER_KEY) || window.sessionStorage.getItem(USER_KEY));
  }

  public isAdmin(): boolean {
    const user = this.getUser();
    return user?.roles?.includes('ROL_ADMIN') && this.isLoggedIn();
  }

  public logout(): void {
    this.router.navigateByUrl('/login').then(
      () => {
        this.clean();
      }
    );
  }
}
