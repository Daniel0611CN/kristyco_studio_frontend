import { CanActivateFn } from "@angular/router";
import { injectGuard } from "./utils/guard-dependencies";

export const canActivateAdmin: CanActivateFn = () => {
    const { storageService, router } = injectGuard();
  return storageService.isAdmin() || router.createUrlTree(['/home']);
}
