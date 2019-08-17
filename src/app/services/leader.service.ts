import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import {Dish} from '../shared/dish';
import {DISHES} from '../shared/dishes';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }

  getLeader(id: string): Leader {
    return LEADERS.filter((leader) => (leader.id === id))[0];
  }

  getLeaders = (): Leader[] => LEADERS;

  getFeaturedLeader = (): Leader => LEADERS.filter((leader) => leader.featured)[0];
}
