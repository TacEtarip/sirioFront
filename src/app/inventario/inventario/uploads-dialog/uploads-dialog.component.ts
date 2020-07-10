import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder, Form } from '@angular/forms';

import { InventarioManagerService, Item} from '../../../inventario-manager.service';

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

  constructor(private formBuilder: FormBuilder, private inventarioMNG: InventarioManagerService) { }

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
    this.disabled = false;
    this.showMessage = false;
  }

  onFileSelectPDF(files: FileList) {
    this.fileToUploadPDF = files.item(0);
    this.disabledPDF = false;
    this.showMessagePDF = false;
  }

  onSubmit(){
    this.inventarioMNG.uploadFile(this.fileToUpload, this.codigo).subscribe((result) => {
      if (result !== false) {
        this.disabled = true;
        this.showMessage = true;
      } else {
        alert('Error Al subir Imagen');
      }
    });
  }

  onSubmitPDF(){
    this.inventarioMNG.uploadFilePDF(this.fileToUploadPDF, this.codigo).subscribe((result) => {
      if (result) {
        this.disabledPDF = true;
        this.showMessagePDF = true;
      } else {
        alert('Error Al subir Ficha');
      }
    });
  }


}
