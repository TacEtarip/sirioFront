import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JsonLDServiceService {
  static scriptType = 'application/json+ld';
  constructor(@Inject(DOCUMENT) private document: Document) { }

  crearProductSquema(nameProducto: string, image: string[], itemUrl: string,
                     description: string, sku: string, brandName: string, precio: number, availability: string): any {
    return{
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: nameProducto,
      image,
      description,
      sku,
      brand: {
        '@type': 'Brand',
        name: brandName
      },
      offers: {
        '@type': 'Offer',
        url: itemUrl,
        priceCurrency: 'PEN',
        price: precio.toString(),
        availability
      }
    };
  }

  insertSchema(schema: Record<string, any>, className = 'structured-data-product'): void {
    let script: any;
    let shouldAppend = false;
    if (this.document.head.getElementsByClassName(className).length) {
      script = this.document.head.getElementsByClassName(className)[0];
    } else {
      script = this.document.createElement('script');
      shouldAppend = true;
    }
    script.setAttribute('class', className);
    script.type = JsonLDServiceService.scriptType;
    script.text = JSON.stringify(schema);
    if (shouldAppend) {
      this.document.head.appendChild(script);
    }
  }

  removeStructuredData(): void {
    console.log('hered');
    const els = [];
    [ 'structured-data-product' ].forEach(c => {
      els.push(...Array.from(this.document.head.getElementsByClassName(c)));
    });
    els.forEach(el => this.document.head.removeChild(el));
  }
}
