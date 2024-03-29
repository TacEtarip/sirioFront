import { Component, OnInit, EventEmitter, Inject, ViewChild, ElementRef } from '@angular/core';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { InventarioManagerService, Item, Marca} from '../../../inventario-manager.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

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

  marcasList = new BehaviorSubject<Marca[]>([]);

  public tipoOn: string;

  myForm: FormGroup;

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;

  filteredTags$ = new BehaviorSubject<{name: string, deleted: boolean}[]>(null);

  tagsList$ = new BehaviorSubject<{name: string, deleted: boolean}[]>(null);

  tagsList: string[] = [];

  errorCantidadTags = false;
  errorNoTag = false;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(private formBuilder: FormBuilder, private inventarioMNG: InventarioManagerService,
              public dialogRef: MatDialogRef<EditarItemDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public item: Item) { }

  ngOnInit(): void {
    this.inventarioMNG.getItem(this.item.codigo).subscribe((res) => {
      if (res) {
        this.item = res;
        this.tagsList = res.tags;
      }
    });
    this.inventarioMNG.getAllMarcas().subscribe((res: Marca[]) => {
      this.marcasList.next(res);
    });
    this.myForm = this.formBuilder.group({
      name: this.formBuilder.control(this.item.name,  Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ])),
      priceIGV: this.formBuilder.control(this.item.priceIGV,  Validators.compose([
        Validators.required,
        Validators.pattern(/^\d*\.?\d{0,2}$/),
        Validators.min(0.01),
        Validators.minLength(1)
      ])),
      cantidad: this.formBuilder.control({value: this.item.cantidad, disabled: true},  Validators.compose([
        Validators.required,
      ])),
      unidadDeMedida: this.formBuilder.control(this.item.unidadDeMedida,  Validators.compose([
        Validators.required
      ]))
      ,
      description: this.formBuilder.control(this.item.description,  Validators.compose([
        Validators.required
      ])),
      costoPropio: this.formBuilder.control(this.item.costoPropio,  Validators.compose([
        Validators.pattern(/^\d*\.?\d{0,2}$/),
        Validators.minLength(1),
        Validators.min(0),
        Validators.required
      ])),
      marca: this.formBuilder.control(this.item.marca,  Validators.compose([
      ])),
      tags: this.formBuilder.control('',  Validators.compose([
      ])),
    }
    );
    this.uploadForm = this.formBuilder.group({
      img: ['']
    });
    this.uploadFileForm = this.formBuilder.group({
      pdf: ['']
    });

    this.myForm.get('tags').valueChanges.subscribe((changeV: any) => {
      if (changeV) {
        if (changeV.name) {
          this.filteredTags$.next(null);
        } else {
          this.filterTagValue(changeV);
        }
      } else {
        this.filteredTags$.next(null);
      }
    });


  }

  displayFn(tag: {name: string, deleted: boolean}): string {
    return tag && tag.name ? tag.name : '';
  }

  selectTag(e: MatAutocompleteSelectedEvent) {
    const index = this.tagsList.indexOf(e.option.value.name);
    if (index >= 0) {
      this.tagsList.splice(index, 1);
    }
    this.tagsList.push(e.option.value.name);
    if (this.tagsList.length > 5) {
      this.errorCantidadTags = true;
    } else {
      this.errorCantidadTags = false;
    }
    this.tagInput.nativeElement.value = '';
    this.filteredTags$.next(null);
    this.myForm.get('tags').setValue('');
    this.errorNoTag = false;
    // this.filteredTags$.next(null);
  }

  filterTagValue(value: any) {
    this.inventarioMNG.getListOfTagsFilteredByRegex(value.name || value, 15).subscribe(res => {
      if (res && res.length > 0) {
        this.filteredTags$.next(res);
      } else {
        this.filteredTags$.next(null);
      }
    });
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if (this.filteredTags$.value) {
      const searchInd = this.filteredTags$.value.findIndex(x => x.name === value.trim());
      if (searchInd === -1) {
        this.errorNoTag = true;
        return;
      }
    } else {
      this.errorNoTag = true;
      return;
    }
    this.errorNoTag = false;
    this.filteredTags$.next(null);
    if ((value || '').trim()) {
      const index = this.tagsList.indexOf(value.trim());
      if (index >= 0) {
        this.tagsList.splice(index, 1);
      }

      this.tagsList.push(value.trim());
      if (this.tagsList.length > 5) {
        this.errorCantidadTags = true;
      } else {
        this.errorCantidadTags = false;
      }

    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTag(tag: string) {
    const index = this.tagsList.indexOf(tag);
    if (index >= 0) {
      this.tagsList.splice(index, 1);

      if (this.tagsList.length > 5) {
        this.errorCantidadTags = true;
      } else {
        this.errorCantidadTags = false;
      }
    }
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
    this.myForm.disable();
    this.uploadFileForm.disable();
    this.uploadForm.disable();
    const newItem: Item = item;
    newItem.codigo = this.item.codigo;
    newItem.name = item.name.trim();
    newItem.description = item.description.trim();
    newItem.tags = this.tagsList;
    this.inventarioMNG.updateItem(newItem).subscribe((addedItem: Item) => {
      if (addedItem !== null) {
        this.myForm.reset();
        this.dialogRef.close();
      } else {
        this.myForm.enable();
        this.uploadFileForm.enable();
        this.uploadForm.enable();
      }
    });
  }
  onSubmitIMG(){
    this.uploadFileForm.disable();
    this.uploadForm.disable();
    this.inventarioMNG.uploadFile(this.fileToUpload, this.item.codigo, this.item.photo).subscribe((result) => {
      if (result) {
        this.disabled = true;
        this.showMessage = true;
      }
      this.uploadFileForm.enable();
      this.uploadForm.enable();
    });
  }

  onSubmitPDF(){
    this.uploadFileForm.disable();
    this.uploadForm.disable();
    this.inventarioMNG.uploadFilePDF(this.fileToUploadPDF, this.item.codigo).subscribe((result) => {
      if (result) {
        this.disabledPDF = true;
        this.showMessagePDF = true;
      }
      this.uploadFileForm.enable();
      this.uploadForm.enable();
    });
  }

  onFileSelect(files: FileList) {
    this.fileToUpload = files.item(0);
    this.onSubmitIMG();
  }

  onFileSelectPDF(files: FileList) {
    this.fileToUploadPDF = files.item(0);
    this.onSubmitPDF();
  }

  convertCostoPropio(){
    if (this.myForm.get('costoPropio').value !== '') {
      const numberPre: number = this.myForm.get('costoPropio').value;
      const valid: boolean = this.myForm.get('costoPropio').valid;
      this.myForm.get('costoPropio').setValue(this.rebrandNumber(valid, numberPre));
    }
  }

  convertPriceIGV(){
    const numberPre: number = this.myForm.get('priceIGV').value;
    const valid: boolean = this.myForm.get('priceIGV').valid;
    this.myForm.get('priceIGV').setValue(this.rebrandNumber(valid, numberPre));
  }

  rebrandNumber(valid: boolean, numberToRebrand: number) {
    const stringNumber = numberToRebrand.toString().trim().replace(',', '.');
    const indexOfComa = stringNumber.indexOf('.');
    let newNumber = '';
    if (valid) {
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
    return newNumber;
  }
}
