import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatListOption } from '@angular/material/list';
import { BehaviorSubject } from 'rxjs';
import { InventarioManagerService } from 'src/app/inventario-manager.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css'],
})
export class TagsComponent implements OnInit {
  tagList = new BehaviorSubject<{ name: string; deleted: boolean }[]>([]);

  form: UntypedFormGroup;

  constructor(
    public dialogRef: MatDialogRef<TagsComponent>,
    private formBuilder: UntypedFormBuilder,
    private inventarioMNG: InventarioManagerService
  ) {}

  ngOnInit(): void {
    this.inventarioMNG.getTags().subscribe((res) => {
      this.tagList.next(res);
    });
    this.form = this.formBuilder.group({
      name: this.formBuilder.control(
        '',
        Validators.compose([Validators.required, Validators.minLength(3)])
      ),
    });
  }

  onSubmit(tag: { name: string }) {
    tag.name = tag.name.trim();
    this.inventarioMNG.addTag(tag).subscribe((addedTag) => {
      if (addedTag !== null) {
        this.form.reset();
        const marcaTemporal = this.tagList.value;
        marcaTemporal.push(addedTag);
        this.tagList.next(marcaTemporal);
      }
    });
  }

  deleteTags(matOptions: MatListOption[]) {
    const arrayToDelete = matOptions.map((x) => x.value);
    this.inventarioMNG.deleteTag(arrayToDelete).subscribe((res) => {
      if (res) {
        this.inventarioMNG.getTags().subscribe((resTag) => {
          this.tagList.next(resTag);
        });
      }
    });
  }
}
