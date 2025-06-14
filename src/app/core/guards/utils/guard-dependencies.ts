import { inject } from "@angular/core";
import { StorageService } from "../../../components/shared/services/storage.service";
import { Router } from "@angular/router";

export function injectGuard() {
  return {
    storageService: inject(StorageService),
    router: inject(Router),
  }
}
