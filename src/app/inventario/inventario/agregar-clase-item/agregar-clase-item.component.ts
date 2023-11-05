import { Component, OnInit, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  UntypedFormGroup,
  Validators,
  UntypedFormBuilder,
} from '@angular/forms';
import { InventarioManagerService } from '../../../inventario-manager.service';

@Component({
  selector: 'app-agregar-clase-item',
  templateUrl: './agregar-clase-item.component.html',
  styleUrls: ['./agregar-clase-item.component.css'],
})
export class AgregarClaseItemComponent implements OnInit {
  onSub = new EventEmitter();

  form: UntypedFormGroup;

  constructor(
    public dialogRef: MatDialogRef<AgregarClaseItemComponent>,
    private formBuilder: UntypedFormBuilder,
    private inventarioMNG: InventarioManagerService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: this.formBuilder.control(
        '',
        Validators.compose([Validators.required, Validators.minLength(3)])
      ),
    });
  }

  onSubmit(nameForm: { name: string }) {
    this.form.disable();
    this.inventarioMNG.addTipo(nameForm.name.trim()).subscribe((result) => {
      if (result) {
        this.dialogRef.close(result);
      } else {
        this.form.enable();
        alert('Error al añadir categoría.');
      }
    });
  }
}
