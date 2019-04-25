import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve,
} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from '../../../../shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class UsersDetailResolver implements Resolve<any> {

  constructor(
    private service: UserService
  ) {
  }

  resolve(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const id = next.paramMap.get('id');
    return this.service.getById(id);
  }
}
