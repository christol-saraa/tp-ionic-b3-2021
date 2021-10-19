import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '../models';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private readonly API_URI = 'users';

  constructor(private http: HttpClient) { }

  get(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.backendRoot}${this.API_URI}`);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${environment.backendRoot}${this.API_URI}/${id}`);
  }
}
