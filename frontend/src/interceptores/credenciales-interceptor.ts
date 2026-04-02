import { HttpInterceptorFn } from '@angular/common/http';

export const credencialesInterceptor: HttpInterceptorFn = (req, next) => {
  req = req.clone({ withCredentials: true });
  return next(req);
};
