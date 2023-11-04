import { Component, OnInit, EventEmitter, Inject, ElementRef, ViewChild } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

import { UntypedFormGroup, Validators, UntypedFormBuilder, UntypedFormArray } from '@angular/forms';

import { InventarioManagerService, Item, SubConteo, Marca} from '../../../inventario-manager.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-new-item-dialog',
  templateUrl: './new-item-dialog.component.html',
  styleUrls: ['./new-item-dialog.component.css']
})
export class NewItemDialogComponent implements OnInit {

  marcasList = new BehaviorSubject<Marca[]>([]);

  onNewItem = new EventEmitter();

  subsAsignaciones = 0;

  myForm: UntypedFormGroup;

  scEnabled = false;

  textIndex;

  listOfOrders: UntypedFormArray[] = [];

  sumatorias: number[] = [0, 0];
  disponibles: number[] = [0, 0];

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  subCant: string[] = [];
  removable = true;
  addOnBlur = true;
  subConteo: UntypedFormArray;
  dualActiveStates = [false, false];
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;

  filteredTags$ = new BehaviorSubject<{name: string, deleted: boolean}[]>(null);

  tagsList$ = new BehaviorSubject<{name: string, deleted: boolean}[]>(null);

  tagsList: string[] = [];

  errorCantidadTags = false;
  errorNoTag = false;

  //////////////////////////////

  caracteristicas: string[] = [];

  constructor(private formBuilder: UntypedFormBuilder, private inventarioMNG: InventarioManagerService,
              public dialogRef: MatDialogRef<NewItemDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {subTipo: string, parentTipoName: string}) { }

  ngOnInit(): void {
    this.inventarioMNG.getAllMarcas().subscribe((res: Marca[]) => {
      this.marcasList.next(res);
    });
    this.myForm = this.formBuilder.group({
      name: this.formBuilder.control('',  Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30)
      ])),
      priceIGV: this.formBuilder.control('',  Validators.compose([
        Validators.required,
        Validators.pattern(/^\d*\.?\d{0,2}$/),
        Validators.minLength(1),
        Validators.min(0.01)
      ])),
      cantidad: this.formBuilder.control(0,  Validators.compose([
        Validators.required,
        Validators.pattern('^-?[0-9][^\.]*$'),
        Validators.min(0),
      ])),
      unidadDeMedida: this.formBuilder.control('',  Validators.compose([
        Validators.required
      ]))
      ,
      description: this.formBuilder.control('',  Validators.compose([
        Validators.required
      ])),
      costoPropio: this.formBuilder.control('',  Validators.compose([
        Validators.required,
        Validators.pattern(/^\d*\.?\d{0,2}$/),
        Validators.minLength(1),
        Validators.min(0)
      ])),
      marca: this.formBuilder.control('',  Validators.compose([
      ])),
      tags: this.formBuilder.control('',  Validators.compose([
      ])),
      subConteo: this.formBuilder.array([]),
    }
    );

    this.subConteo = this.myForm.get('subConteo') as UntypedFormArray;

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


  checkExist(i: number, name: string) {
    let finded = 0;
    this.listOfOrders[0].controls.forEach(ord => {
      if (ord.get(name).value === this.listOfOrders[0].controls[i].get(name).value) {
        finded++;
      }
    });
    if (finded > 1) {
      this.listOfOrders[0].controls[i].get(name).setErrors({ incorrect: true });
    }
  }
  sumCantidades(index: number, yindex: number) {
    this.sumatorias[index] = 0;
    this.listOfOrders[index].value.forEach( (fg) => {
      let toSum = fg.cantidad;
      if (toSum === null || toSum < 0) {
        toSum = 0;
      }
      this.sumatorias[index] += toSum;
    });
    const preDisponible = this.myForm.get('cantidad').value - this.sumatorias[index];
    if (preDisponible < 0) {
      this.listOfOrders[index].at(yindex).get('cantidad').setValue(0);
      this.sumCantidades(index, yindex);
    } else {
      this.disponibles[index] = this.myForm.get('cantidad').value - this.sumatorias[index];
    }
  }

  changeCantidadMain() {
    let index = -1;
    this.listOfOrders.forEach((fa: UntypedFormArray) => {
      index++;
      this.sumatorias[index] = 0;
      fa.value.forEach(fg => {
        let toSum = fg.cantidad;
        if (toSum === null || toSum < 0) {
        toSum = 0;
        }
        this.sumatorias[index] += toSum;
      });
      const preDisponible = this.myForm.get('cantidad').value - this.sumatorias[index];
      if (preDisponible < 0) {
        // tslint:disable-next-line: prefer-for-of
        for (let yindex = 0; yindex < fa.value.length; yindex++) {
          fa.at(yindex).get('cantidad').setValue(0);
        }
        this.disponibles[index] = this.myForm.get('cantidad').value;
      } else {
        this.disponibles[index] = this.myForm.get('cantidad').value - this.sumatorias[index];
      }

    });
  }

  activateDualAss(index: number) {
    if (this.subConteo.at(index).get('nameSecond').valid && this.subConteo.at(index).get('nameSecond').value !== '') {
      this.dualActiveStates[index] = true;
        // tslint:disable-next-line: prefer-for-of
      for (let yindex = 0; yindex < this.listOfOrders[index].value.length; yindex++) {
        this.listOfOrders[index].at(yindex).get('nameSecond').enable();
      }
    } else {
      this.dualActiveStates[index] = false;

      for (let yindex = 0; yindex < this.listOfOrders[index].value.length; yindex++) {
          this.listOfOrders[index].at(yindex).get('nameSecond').disable();
          this.listOfOrders[index].at(yindex).get('nameSecond').reset();
      }
    }
  }

  addSC() {
    if (this.subsAsignaciones < 1) {
      const fg = this.formBuilder.group({
        name: this.formBuilder.control('', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30)
        ])),
        nameSecond: this.formBuilder.control('', Validators.compose([
          Validators.minLength(1),
          Validators.maxLength(30)
          ])),
        order: this.formBuilder.array([])
       });
      this.addOrder(fg);
      this.subConteo.push(fg);
      this.listOfOrders.push(fg.get('order') as UntypedFormArray);
      this.subsAsignaciones++;
      this.disponibles[this.listOfOrders.length - 1] =  this.myForm.get('cantidad').value;
    }
  }

  addOrder(secondOrderFormGropup: UntypedFormGroup) {
    const fg = this.formBuilder.group({
      name: this.formBuilder.control('', Validators.compose([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(20)
      ])),
      nameSecond: this.formBuilder.control({value: '', disabled: true}, Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(20)
        ])),
      cantidad: this.formBuilder.control(0, Validators.compose([
        Validators.required,
        Validators.pattern('^-?[0-9][^\.]*$'),
        Validators.min(0)
      ]))
     });
    const tempFormArray = secondOrderFormGropup.get('order') as UntypedFormArray;
    tempFormArray.push(fg);
  }

  agregarSubAsig(index: number, yindex: number) {
    const fg = this.formBuilder.group({
      name: this.formBuilder.control('', Validators.compose([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(20)
      ])),
      nameSecond: this.formBuilder.control({value: '', disabled: !this.dualActiveStates[index]}, Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(20)
        ])),
      cantidad: this.formBuilder.control(0, Validators.compose([
        Validators.required,
        Validators.pattern('^-?[0-9][^\.]*$'),
        Validators.min(0)
      ]))
     });
    this.listOfOrders[index].insert(yindex + 1, fg);
  }

  deleteSubAsig(index: number, yindex: number) {
    if (this.listOfOrders[index].length === 1) {
        if (index === 0) {
          this.dualActiveStates[0] = this.dualActiveStates[1];
          this.dualActiveStates[1] = false;
          this.disponibles[0] = this.disponibles[1];
          this.disponibles[1] = 0;
        }
        this.disponibles[1] = 0;
        this.subsAsignaciones--;
        this.listOfOrders[index].removeAt(yindex);
        this.listOfOrders.splice(index, 1);
        this.subConteo.removeAt(index);
    }else {
      this.listOfOrders[index].removeAt(yindex);
      this.sumCantidades(index, yindex);
    }
  }

  deleteCostAss(index: number) {
    if (index === 0) {
      this.dualActiveStates[0] = this.dualActiveStates[1];
      this.dualActiveStates[1] = false;
      this.disponibles[0] = this.disponibles[1];
      this.disponibles[1] = 0;
    }
    this.disponibles[1] = 0;
    this.subsAsignaciones--;
    this.listOfOrders.splice(index, 1);
    this.subConteo.removeAt(index);
  }


  changedInstanceCB() {
    this.scEnabled = !this.scEnabled;
    if (this.scEnabled) {
      this.myForm.get('scName').enable();
      this.myForm.get('scName').setValidators([Validators.minLength(3), Validators.required]);
    } else {
      this.myForm.get('scName').disable();
      this.myForm.get('scName').clearValidators();
      this.myForm.get('scName').reset();
    }
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

  onSubmit(item: Item) {
    const newItem: Item = item;
    newItem.name = item.name.trim();
    newItem.description = item.description.trim();
    newItem.tipo = this.data.parentTipoName;
    newItem.subTipo = this.data.subTipo;
    newItem.tags = this.tagsList;
    this.myForm.disable();
    if (this.subConteo.length > 0) {
      newItem.subConteo = this.subConteo.at(0).value;
      newItem.subConteo.name = newItem.subConteo.name.trim();
      if (newItem.subConteo.nameSecond) {
        newItem.subConteo.nameSecond = newItem.subConteo.nameSecond.trim();
      }
      newItem.subConteo.order.forEach( sc => {
        sc.name = sc.name.trim();
        if (sc.nameSecond) {
          sc.nameSecond = sc.nameSecond.trim();
        }
      });
    } else {
      newItem.subConteo = undefined;
    }
    this.inventarioMNG.addItem(newItem).subscribe((addedItem: Item) => {
      if (addedItem !== null) {
        this.myForm.reset();
        this.dialogRef.close(addedItem);
        // this.onNewItem.emit(addedItem.codigo);
      } else {
        this.myForm.enable();
        alert('Error al agregar un nuevo item');
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

  remove(sC: string): void {
    const index = this.subCant.indexOf(sC);

    if (index >= 0) {
      this.subCant.splice(index, 1);
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

  removeAll() {
    this.subCant.forEach(sc => {
      this.remove(sc);
    });
  }

  cantidadChanged() {
    this.removeAll();
    if (this.myForm.get('cantidad').valid === false) {
      // this.myForm.get('scName').setValue('');
      // this.scEnabled = false;
    }
  }

}
