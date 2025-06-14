import { CanActivateFn } from '@angular/router';
import { injectGuard } from './utils/guard-dependencies';

export const canActivateAuth: CanActivateFn = () => {
  const { storageService, router } = injectGuard();
  return storageService.isLoggedIn() || router.createUrlTree(['/home']);
}
