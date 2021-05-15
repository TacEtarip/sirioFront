import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Item } from 'src/app/inventario-manager.service';

@Component({
  selector: 'app-itemcard',
  templateUrl: './itemcard.component.html',
  styleUrls: ['./itemcard.component.css']
})
export class ItemcardComponent implements OnInit {
  @Input() item: Item;
  urlOfImage = new BehaviorSubject<string>(null);


  constructor() { }

  ngOnInit(): void {
    const preImageArray = this.item.photo.split('.');
    this.urlOfImage.next('https://siriouploads.s3.amazonaws.com/' + `${preImageArray[0]}.webp`);
  }

}
