import {Injectable} from '@angular/core';
import {HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {delay, mergeMap, materialize, dematerialize} from 'rxjs/operators';
import {User} from '../models/user';
import {Role} from '../models/role';

@Injectable()
export class MockInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const users: User[] = [
      {
        id: 1,
        username: 'test',
        email: 'test@test.com',
        photoUrl: '',
        password: 'test',
        firstName: 'Test',
        lastName: 'User',
        role: Role.User
      },
      {
        id: 2,
        username: 'kwstarikanos',
        email: 'kwstarikanos@gmail.com',
        photoUrl: '',
        password: '123456',
        firstName: 'Κώστας',
        lastName: 'Χατζόπουλος',
        role: Role.Admin
      }
    ];

    const authHeader = request.headers.get('Authorization');
    const isLoggedIn = authHeader && authHeader.startsWith('Bearer fake-jwt-token');

    // wrap in delayed observable to simulate server api call
    return of(null).pipe(
      mergeMap(() => {

        // authenticate - public
        if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
          console.log('request', request);
          const user = users.find(x => x.email === request.body.email && x.password === request.body.password);
          if (!user) {
            return error({
              error: {
                code: 1,
                message: 'Username or password is incorrect',
              }
            });
          }
          return ok({
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            token: `fake-jwt-token`
          });
        }

        // get all users
        if (request.url.endsWith('/users') && request.method === 'GET') {
          if (!isLoggedIn) {
            return unauthorised();
          }
          return ok(users);
        }

        // pass through any requests not handled above
        return next.handle(request);
      })
    )
    // call materialize and dematerialize to ensure delay even if an error is thrown
    // (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .pipe(materialize())
      .pipe(delay(2000))
      .pipe(dematerialize());

    // private helper functions

    function ok(body) {
      return of(
        new HttpResponse({status: 200, body}));
    }

    function unauthorised() {
      return throwError({status: 401, error: {message: 'Unauthorised'}});
    }

    function error(message) {
      return throwError({status: 400, error: {message}});
    }
  }
}

export let mockProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: MockInterceptor,
  multi: true
};
