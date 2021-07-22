import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  constructor(@Inject(DOCUMENT) private document: Document) { }

  addAnalytics(className = 'google-analytics', classNameII = 'google-analytics-second'): void {
    let script: any;
    let scriptII: any;

    let shouldAppend = false;
    let shouldAppendII = false;

    const text = `window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-199910224-1');`;

    if (this.document.head.getElementsByClassName(className).length) {
      script = this.document.head.getElementsByClassName(className)[0];
    } else {
      script = this.document.createElement('script');
      shouldAppend = true;
    }

    if (this.document.head.getElementsByClassName(classNameII).length) {
      scriptII = this.document.head.getElementsByClassName(classNameII)[0];
    } else {
      scriptII = this.document.createElement('script');
      shouldAppendII = true;
    }

    script.setAttribute('class', className);
    scriptII.setAttribute('class', classNameII);

    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-199910224-1';

    scriptII.text = text;

    if (shouldAppend) {
      this.document.head.appendChild(script);
    }

    if (shouldAppendII) {
      this.document.head.appendChild(scriptII);
    }
  }

  removeAnalytics(): void {
    const els = [];
    [ 'google-analytics-second', 'google-analytics' ].forEach(c => {
      els.push(...Array.from(this.document.head.getElementsByClassName(c)));
    });
    els.forEach(el => this.document.head.removeChild(el));
  }
}
