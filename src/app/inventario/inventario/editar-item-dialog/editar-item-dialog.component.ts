import { Component, OnInit, EventEmitter, Inject } from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { InventarioManagerService, Item} from '../../../inventario-manager.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-editar-item-dialog',
  templateUrl: './editar-item-dialog.component.html',
  styleUrls: ['./editar-item-dialog.component.css']
})
export class EditarItemDialogComponent implements OnInit {
  uploadForm: FormGroup;
  uploadFileForm: FormGroup;

  fileToUpload: File;
  fileToUploadPDF: File;

  disabled = true;
  disabledPDF = true;

  codigo: string;
  showMessage = false;
  showMessagePDF = false;

  onNewItem = new EventEmitter();

  public tipoOn: string;

  myForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private inventarioMNG: InventarioManagerService,
              public dialogRef: MatDialogRef<EditarItemDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public item: Item) { }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      name: this.formBuilder.control(this.item.name,  Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ])),
      priceIGV: this.formBuilder.control(this.item.priceIGV,  Validators.compose([
        Validators.required,
        Validators.pattern(/^\d*\.?\d{0,2}$/),
        Validators.minLength(1)
      ])),
      cantidad: this.formBuilder.control(this.item.cantidad,  Validators.compose([
        Validators.required,
        Validators.pattern('^-?[0-9][^\.]*$'),
        Validators.minLength(1)
      ])),
      unidadDeMedida: this.formBuilder.control(this.item.unidadDeMedida,  Validators.compose([
        Validators.required
      ]))
      ,
      description: this.formBuilder.control(this.item.description,  Validators.compose([
        Validators.required
      ]))
    }
    );
    this.uploadForm = this.formBuilder.group({
      img: ['']
    });
    this.uploadFileForm = this.formBuilder.group({
      pdf: ['']
    });
  }

  testFocus(){
    const numberPre: number = this.myForm.get('priceIGV').value;
    const stringNumber = numberPre.toString().trim().replace(',', '.');
    const indexOfComa = stringNumber.indexOf('.');
    let newNumber = '';

    if (this.myForm.get('priceIGV').valid) {
        if (stringNumber.indexOf('.') === -1) {
          newNumber = stringNumber + '.00';
        } else if (stringNumber.charAt(indexOfComa + 1) === '') {
          newNumber = stringNumber + '00';
        } else if (stringNumber.charAt(indexOfComa + 2) === '') {
          newNumber = stringNumber + '0';
        } else {
          newNumber = stringNumber;
        }
  }
    if (newNumber !== '') {
      this.myForm.get('priceIGV').setValue(newNumber);
    }
  }

  onSubmit(item: Item) {
    const newItem: Item = item;
    newItem.tipo = this.tipoOn;
    this.inventarioMNG.addItem(newItem).subscribe((addedItem: Item) => {
      if (addedItem !== null) {
        this.myForm.reset();
        this.onNewItem.emit(addedItem.codigo);
      }
    });
  }
  onSubmitIMG(){
    this.inventarioMNG.uploadFile(this.fileToUpload, this.codigo).subscribe((result) => {
      if (result !== false) {
        this.disabled = true;
        this.showMessage = true;
      }
    });
  }

  onSubmitPDF(){
    this.inventarioMNG.uploadFilePDF(this.fileToUploadPDF, this.codigo).subscribe((result) => {
      if (result) {
        this.disabledPDF = true;
        this.showMessagePDF = true;
      }
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
}
