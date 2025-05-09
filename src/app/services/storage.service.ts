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
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) return JSON.parse(user);
    return {};
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    return !!user;
  }

  public isAdmin(): boolean {
    const user = this.getUser();
    return user?.roles?.includes('ROL_ADMIN') && this.isLoggedIn();
  }

  public logout(): void {
    this.router.navigateByUrl('/login').then(
      () => {
        // console.log(`Se ha cerrado la sesión del usuario ${this.getUser().username} correctamente.`);
        this.clean();
      }
    );
  }
}
