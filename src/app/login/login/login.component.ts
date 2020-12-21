import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService, User } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  hide = true;

  constructor(private formBuilder: FormBuilder, private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: this.formBuilder.control('',  Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._-]+$'),
        Validators.minLength(4),
        Validators.maxLength(8)
      ])),
      password: this.formBuilder.control('', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^[a-zA-Z0-9._-]+$'),
        Validators.maxLength(20)
      ]))
    });
  }

  trimThis(getString: string) {
    const temp = this.form.get(getString);
    temp.setValue(temp.value.trim());
  }

  onSubmit(user: User) {
      this.form.disable();
      this.auth.login(user).subscribe((res) => {
        this.form.enable();

        if (res) {
          this.router.navigate(['/inventario']);
        } else {
          // alert('Error no se pudo iniciar sesion');
        }
      });

    // delete mediaItem.name; borrara name de el paso de variable mediaItem
    }

}
