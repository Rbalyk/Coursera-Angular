import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { Observable } from 'rxjs';
import {delay, map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {baseURL} from '../shared/baseurl';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http: HttpClient) { }

  getLeader(id: number): Observable<Leader> {
    return this.http.get<Leader>(baseURL + 'leadership/' + id).pipe(delay(2000));
  }
  getLeaders(): Observable<Leader[]> {
    return this.http.get<Leader[]>(baseURL + 'leadership').pipe(delay(2000));
  }
  getFeaturedLeader(): Observable<Leader> {
    return this.http.get<Leader>(baseURL + 'leadership?featured=true').pipe(map(leaders => leaders[0]));
  }
}
