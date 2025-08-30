import { Injectable } from '@angular/core';
import {BaseService} from "./base.service";
import {HttpClient} from "@angular/common/http";
import {IUser} from "../models/user.interface";
import {Observable} from "rxjs";
import {IUserInvitation} from "../models/user-invitation";
import {environment} from "../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {IBusiness} from "../models/business.interface";
import {DateUtils} from "../helpers/DateUtils";

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  inviteUser(userInvite: IUserInvitation): Observable<any> {
    console.log('Invoked inviteUser');
    return new Observable<any>();
  }

  getUser(userId: string): Observable<any> {

    const url = `${environment.apiBaseUrl}/users/${userId}`;

    console.log('Calling url:' + url);
    const r$ = this.http
      .get(url)
      .pipe(map(toUser))
      .pipe(catchError(this.handleError));
    return r$;
  }

  getUsers(): Observable<any> {

    const url = `${environment.apiBaseUrl}/users`;

    console.log('Calling url:' + url);
    const r$ = this.http
      .get(url)
      .pipe(map(this.mapUsers))
      .pipe(catchError(this.handleError));
    return r$;
  }

  deleteUser(userId: string): Observable<any> {
    console.log('Invoked deleteUser');
    return new Observable<any>();
  }

  mapUsers(response: any): IUser[] {
    const result = response.map(toUser);
    return result;
  }
}

function toUser(r: any): IUser {
  const u: IUser = r;
  u.created_on_utc_display = DateUtils.getLocalDateFromIso(r.created_on_utc);
  return u;
}
