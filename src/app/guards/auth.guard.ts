import {CanActivateFn, Router} from '@angular/router';
import {AuthenticationService} from "../services/authentication.service";
import {EnvironmentInjector, inject, runInInjectionContext} from "@angular/core";

//const injector = inject(EnvironmentInjector);
// export const AuthGuard: CanActivateFn = async (route, state) => {
//   return await inject(AuthenticationService).authenticate() ? true : inject(Router).createUrlTree(['/login']);
// };
export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const result = await authService.authenticate();

  if(!result || result == 'undefined') {
    return router.navigateByUrl("/login");
  }
  return true;
}
