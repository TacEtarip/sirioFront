import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class WindowScrollService {

  elementScroll: Element;

  scrollY = new BehaviorSubject(0);
  scrollY$ = this.scrollY.asObservable();

  scrollH = new BehaviorSubject(0);

  porcent = new BehaviorSubject(0);

  constructor(@Inject(PLATFORM_ID) private platformId: any) { }

  updateScrollY(value: number): void {
      this.scrollY.next(value);
  }

  scrollToTop() {
    if (this.elementScroll) {
      this.elementScroll.scroll(0, 0);
    }
  }

}
