import { Component, EventEmitter, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatListOption } from '@angular/material/list';
import { BehaviorSubject } from 'rxjs';
import { InventarioManagerService, Marca } from '../../../inventario-manager.service';

@Component({
  selector: 'app-marcas-dialog',
  templateUrl: './marcas-dialog.component.html',
  styleUrls: ['./marcas-dialog.component.css']
})
export class MarcasDialogComponent implements OnInit {


  marcasList = new BehaviorSubject<Marca[]>([]);
  onSub = new EventEmitter();

  form: UntypedFormGroup;

  constructor(public dialogRef: MatDialogRef<MarcasDialogComponent>,
              private formBuilder: UntypedFormBuilder,
              private inventarioMNG: InventarioManagerService) { }

  ngOnInit(): void {
    this.inventarioMNG.getAllMarcas().subscribe((res: Marca[]) => {
      this.marcasList.next(res);
    });
    this.form = this.formBuilder.group({
      name: this.formBuilder.control('',  Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ]))
    });
  }


  onSubmit(marca: Marca) {
    marca.name = marca.name.trim();
    this.inventarioMNG.addNewMarca(marca).subscribe((addedMarca: Marca) => {
      if (addedMarca !== null) {
        this.form.reset();
        const marcaTemporal = this.marcasList.value;
        marcaTemporal.push(addedMarca);
        this.marcasList.next(marcaTemporal);
      }
    });
  }

  deleteMarcas(matOptions: MatListOption[]) {
    const arrayToDelete = (matOptions.map(x => x.value));
    const stringToDelete = arrayToDelete.join('_');
    this.inventarioMNG.deleteMarcas(stringToDelete).subscribe((resDelete: boolean) => {
      if (resDelete) {
        this.inventarioMNG.getAllMarcas().subscribe((res: Marca[]) => {
          this.marcasList.next(res);
        });
      }
    });
  }


}
