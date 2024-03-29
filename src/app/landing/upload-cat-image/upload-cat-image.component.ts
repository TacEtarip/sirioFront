import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InventarioManagerService, Tipo, Item } from 'src/app/inventario-manager.service';

@Component({
  selector: 'app-upload-cat-image',
  templateUrl: './upload-cat-image.component.html',
  styleUrls: ['./upload-cat-image.component.css']
})
export class UploadCatImageComponent implements OnInit {
  uploadForm: FormGroup;
  fileToUpload: File;
  showMessage = false;
  disabled = false;
  onUploaded = new EventEmitter();

  constructor(private formBuilder: FormBuilder, private inventarioMNG: InventarioManagerService,
              public dialogRef: MatDialogRef<UploadCatImageComponent>,
              @Inject(MAT_DIALOG_DATA) public data:
              { tipo: Tipo, item: Item, subTipo: { tipoName: string, subTipoName: string, oldPhoto: string } }) { }

  ngOnInit(): void {
    this.uploadForm = this.formBuilder.group({
      img: ['']
    });
  }

  onFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    if (files.length > 0) {
      this.fileToUpload = files.item(0);
      this.onSubmitIMG();
    }
  }

  onSubmitIMG(){
    this.uploadForm.disable();
    this.disabled = true;
    if (this.data.tipo) {
      this.inventarioMNG.uploadFileCAT(this.fileToUpload, this.data.tipo.codigo, this.data.tipo.link).subscribe((result) => {
        this.disabled = false;
        if (result) {
          this.showMessage = true;
          this.onUploaded.emit(result);
        }
        this.uploadForm.enable();
      });
    } else if (this.data.item) {
      this.inventarioMNG.uploadFile(this.fileToUpload, this.data.item.codigo, this.data.item.photo).subscribe(res => {
        this.disabled = false;
        if (res) {
          this.showMessage = true;
          this.onUploaded.emit(res);
        }
        this.uploadForm.enable();
      });
    } else if (this.data.subTipo) {
      this.inventarioMNG.uploadFileSubCAT(this.fileToUpload, this.data.subTipo.tipoName,
        this.data.subTipo.subTipoName, this.data.subTipo.oldPhoto)
      .subscribe((result) => {
        this.disabled = false;
        if (result) {
          this.showMessage = true;
          this.onUploaded.emit(result);
        }
        this.uploadForm.enable();
      });
    }

  }

}
