import { Component, OnInit, Inject } from '@angular/core';

import { FormGroup, FormBuilder } from '@angular/forms';

import { InventarioManagerService } from '../../../inventario-manager.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-uploads-dialog',
  templateUrl: './uploads-dialog.component.html',
  styleUrls: ['./uploads-dialog.component.css']
})
export class UploadsDialogComponent implements OnInit {
  uploadForm: FormGroup;
  uploadFileForm: FormGroup;

  fileToUpload: File;
  fileToUploadPDF: File;

  disabled = true;
  disabledPDF = true;

  codigo: string;
  showMessage = false;
  showMessagePDF = false;

  photoName: string;

  constructor(private formBuilder: FormBuilder, private inventarioMNG: InventarioManagerService,
              public dialogRef: MatDialogRef<UploadsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {codigo: string}) { }

  ngOnInit(): void {
    this.uploadForm = this.formBuilder.group({
      img: ['']
    });
    this.uploadFileForm = this.formBuilder.group({
      pdf: ['']
    });
  }

  onFileSelect(files: FileList) {
    this.fileToUpload = files.item(0);
    this.onSubmitIMG();
    this.showMessage = false;
  }

  onFileSelectPDF(files: FileList) {
    this.fileToUploadPDF = files.item(0);
    this.onSubmitPDF();
    this.showMessagePDF = false;
  }

  onSubmitIMG(){
    this.uploadForm.disable();
    this.inventarioMNG.uploadFile(this.fileToUpload, this.data.codigo, null).subscribe((result) => {
      if (result) {
        this.disabled = true;
        this.showMessage = true;
      }
      this.uploadForm.enable();
    });
  }

  onSubmitPDF(){
    this.uploadFileForm.disable();
    this.inventarioMNG.uploadFilePDF(this.fileToUploadPDF, this.data.codigo).subscribe((result) => {
      if (result) {
        this.disabledPDF = true;
        this.showMessagePDF = true;
      }
      this.uploadFileForm.enable();
    });
  }


}
