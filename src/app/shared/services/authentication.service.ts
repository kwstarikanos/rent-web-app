import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Session} from '../models/session';
import {environment} from '../../../environments/environment';
import {JwtHelperService} from '@auth0/angular-jwt';

function getRandomColor() {
  const color = Math.floor(0x1000000 * Math.random()).toString(16);
  return ('000000' + color).slice(-6);
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private sessionSubject$: BehaviorSubject<Session>;
  session$: Observable<Session>;

  constructor(
    private http: HttpClient
  ) {
    const local = localStorage.getItem('session');
    const session = sessionStorage.getItem('session');
    this.sessionSubject$ = new BehaviorSubject<Session>(JSON.parse(local ? local : session));
    this.session$ = this.sessionSubject$.asObservable();
  }

  public get session(): any {
    return this.sessionSubject$.value;
  }

  login(data: any) {
    console.log('data', data);
    return this.http.post<any>(environment.apiRoot + '/auth/login', data)
      .pipe(
        map((response: any) => {
          console.log('d', response);
          // login successful if there's a jwt token in the response
          if (response && response.access.token) {
            console.log('jwt');
            const helper = new JwtHelperService();
            const decodedToken: any = helper.decodeToken(response.access.token);
            const expirationDate = helper.getTokenExpirationDate(response.access.token);
            const isExpired = helper.isTokenExpired(response.access.token);
            console.log('helper', helper);
            console.log('decodedToken', decodedToken);
            console.log('pending_provider', decodedToken.pending_provider);
            console.log('expirationDate', expirationDate);
            console.log('isExpired', isExpired);
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            const session = {
              access: response.access,
              user: {
                ...response.user,
                role: response.user.role.name,
                photoUrl: 'https://ui-avatars.com/api/?name=' + response.user.name + '+' + response.user.surname +
                  '&rounded=true&%20bold=true&background=' + getRandomColor()
              }
            };
            sessionStorage.setItem('session', JSON.stringify(session));
            if (data.remember) {
              localStorage.setItem('session', JSON.stringify(session));
            }
            this.sessionSubject$.next(session);
          }
          return response;
        })
      );
  }

  register(data: any) {
    console.log('data', data);
    return this.http.post<any>(environment.apiRoot + '/auth/register', data)
      .pipe(
        map((response: any) => {
          console.log('d', response);
          // login successful if there's a jwt token in the response
          if (response && response.access.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            const session = {
              access: {
                ...response.access,
                pendingForProvider: true
              },
              user: {
                ...response.user,
                role: response.user.role.name,
                photoUrl: 'https://ui-avatars.com/api/?name=' + response.user.name + '+' + response.user.surname +
                  '&rounded=true&%20bold=true&background=' + getRandomColor()
              }
            };
            localStorage.setItem('session', JSON.stringify(session));
            this.sessionSubject$.next(session);
          }
          return response;
        })
      );
  }

  logout() {
    console.log('logout');
    localStorage.removeItem('session');
    sessionStorage.removeItem('session');
    this.sessionSubject$.next(null);
  }

  mockLogin(data: any) {
    console.log('data', data);
    return this.http.post<any>(`/users/authenticate`, data)
      .pipe(
        map((response: any) => {
          console.log('d', response);
          // login successful if there's a jwt token in the response
          if (response && response.access.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            const session = {
              access: response.access,
              user: {
                ...response.user,
                role: response.user.role.name,
                photoUrl: 'https://ui-avatars.com/api/?name=' + response.user.name + '+' + response.user.surname +
                  '&rounded=true&%20bold=true&background=' + getRandomColor()
              }
            };
            localStorage.setItem('session', JSON.stringify(session));
            this.sessionSubject$.next(session);
          }
          return response;
        })
      );
  }

}
