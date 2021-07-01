import { Rating } from './inventario-manager.service';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JsonLDServiceService {
  static scriptType = 'application/ld+json';
  constructor(@Inject(DOCUMENT) private document: Document) { }

  createBreadSqueme(itemlist: {position: number, name: string, link: string}[] = []) {
    const baseLink = 'https://inventario.siriodinar.com/store';
    const itemListElement = [{
      '@type': 'ListItem',
      position: 1,
      name: 'Tienda',
      item: baseLink + '/main'
    }];

    itemlist.forEach(i => {
      itemListElement.push({
        '@type': 'ListItem',
        position: i.position,
        name: i.name,
        item: baseLink + i.link
      });
    });

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement
    };
  }

  createReviewSquema(rating: number, nameItem: string, autor: string) {
    return  {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: rating.toString()
      },
      name: nameItem,
      author: {
        '@type': 'Person',
        name: autor
      },
      reviewBody: '',
    };
  }

  crearProductSquema(nameProducto: string, image: string[], itemUrl: string,
                     description: string, sku: string, brandName: string, precio: number, availability: string,
                     ratingCount: number, ratingValue: number, reviews: Rating[]): any {
    const date = new Date();

    let review = [];

    reviews.forEach(r => {
      review.push(this.createReviewSquema(r.rating, nameProducto, r.user));
    });

    date.setFullYear(date.getFullYear() + 1);
    let aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue,
      ratingCount
    };
    if (ratingCount === 0) {
      aggregateRating = undefined;
      review = undefined;
    }
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
        availability,
        priceValidUntil: date.toISOString()
      },
      aggregateRating,
      review
    };
  }

  crearOrgSquema() {
    return     {
      '@context': 'https://schema.org/',
      '@type': 'Organization',
      name: 'Sirio Dinar',
      url: 'https://inventario.siriodinar.com/store/main',
      logo: 'https://inventario.siriodinar.com/assets/logo_512.png',
      sameAs: 'https://www.facebook.com/siriodinar'
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
    const els = [];
    [ 'structured-data-product', 'structured-data-bread' ].forEach(c => {
      els.push(...Array.from(this.document.head.getElementsByClassName(c)));
    });
    els.forEach(el => this.document.head.removeChild(el));
  }
}
