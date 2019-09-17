import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import {delay, map, catchError} from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor(private http: HttpClient,
              private processHttpMsgService: ProcessHTTPMsgService) { }

  getDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(baseURL + 'dishes').pipe(
      delay( 2000),
      catchError(this.processHttpMsgService.handleError)
    );
  }

  getDish(id: number): Observable<Dish> {
    return this.http.get<Dish>(baseURL + 'dishes/' + id)
      .pipe(
        delay( 2000),
        catchError(this.processHttpMsgService.handleError)
      );
  }

  getFeaturedDish(): Observable<Dish> {
    return this.http.get<Dish[]>(baseURL + 'dishes?featured=true')
      .pipe(
        map(dishes => dishes[0]),
        catchError(this.processHttpMsgService.handleError)
      );
  }

  getDishIds(): Observable<number[] | any> {
    return this.getDishes().pipe(
      map(dishes => dishes.map(dish => dish.id)),
      catchError(error => error)
    );
  }

  putDish(dish: Dish): Observable<Dish> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.put<Dish>(baseURL + 'dishes/' + dish.id, dish, httpOptions)
      .pipe(catchError(this.processHttpMsgService.handleError));

  }

}
