import {switchMap} from 'rxjs/operators';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {from, Observable} from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable()
export class TokenHttpInterceptor implements HttpInterceptor {

  constructor(public auth: AuthenticationService) {
    console.log("Constructed interceptor")
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const skip = (request.headers.get('skip')!= null);

    // @ts-ignore
    return from(this.auth.session())
      .pipe(
        switchMap(session => {
          const jwt = session?.tokens?.idToken.toString();
          let requestClone: any;
          if(skip || !jwt) {
            console.log('Skipping');
            let headers = request.headers
              .delete('skip')
              .append('x-api-key', environment.xApiKey);

            requestClone = request.clone({
              headers
            });
          }
          else {
            console.log('Using Jwt');
            let headers = request.headers
              .append('Authorization', jwt)
              .append('Content-Type', 'application/json')
              .append('x-api-key', environment.xApiKey);
            requestClone = request.clone({
              headers
            });
          }
          console.log("Request clone: " + JSON.stringify(requestClone));
          return next.handle(requestClone);
        })
      );
  }
}
