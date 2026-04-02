import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { Auth } from '../servicios/auth';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.estaAutenticado()) return true;
  else {
    const rutaLogin = router.parseUrl('/login');
    return new RedirectCommand(rutaLogin);
  }
};
