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

  constructor(private formBuilder: FormBuilder, private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: this.formBuilder.control('',  Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._-]+$'),
        Validators.minLength(4)
      ])),
      password: this.formBuilder.control('', Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ]))
    });
  }

  onSubmit(user: User) {
      this.auth.login(user).subscribe((res) => {
        if (res) {
          this.router.navigate(['/inventario']);
        } else {
          alert('Error no se pudo iniciar sesion');
        }
      });

    // delete mediaItem.name; borrara name de el paso de variable mediaItem
    }

}
