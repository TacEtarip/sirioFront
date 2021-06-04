import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-upload-sub-cat-image',
  templateUrl: './upload-sub-cat-image.component.html',
  styleUrls: ['./upload-sub-cat-image.component.css']
})
export class UploadSubCatImageComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UploadSubCatImageComponent>) { }

  ngOnInit(): void {
  }

}
