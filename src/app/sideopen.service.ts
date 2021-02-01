import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SideopenService {
  static opened = new BehaviorSubject<boolean>(true);
  constructor() { }

}
