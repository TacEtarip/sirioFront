import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WindowScrollService {

  elementScroll: Element;

  scrollY = new BehaviorSubject(0);
  scrollY$ = this.scrollY.asObservable();

  scrollH = new BehaviorSubject(0);

  porcent = new BehaviorSubject(0);

  constructor() { }

  updateScrollY(value: number): void {
    this.scrollY.next(value);
  }

  scrollToTop() {
    this.elementScroll.scroll(0, 0);
  }

}
