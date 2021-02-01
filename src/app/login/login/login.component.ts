import { BehaviorSubject, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService, User } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  form: FormGroup;
  hide = true;
  countCredentialsError = new BehaviorSubject<number>(0);
  badCredentials = false;
  sitekey: string;
  subOne: Subscription;

  constructor(private formBuilder: FormBuilder, private auth: AuthService, private router: Router) {
    this.sitekey = '6Lc-GTIaAAAAABaw-oeMyoV6jZvkn9jRdaUwa_VT';
  }
  ngOnDestroy(): void {
    this.subOne.unsubscribe();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: this.formBuilder.control('',  Validators.compose([
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+$/),
        Validators.minLength(4),
        Validators.maxLength(12)
      ])),
      password: this.formBuilder.control('', Validators.compose([
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]*[A-Z]+[a-zA-Z0-9]*$/),
        Validators.pattern(/^[a-zA-Z0-9]*[0-9]+[a-zA-Z0-9]*$/),
        Validators.pattern(/^[a-zA-Z0-9]*[a-z]+[a-zA-Z0-9]*$/),
        Validators.minLength(6),
        Validators.maxLength(20)
      ])),
    });

    this.subOne = this.countCredentialsError.subscribe(cerr => {
      if (cerr > 4) {
        this.form.addControl('captcha', this.formBuilder.control('', Validators.compose([
          Validators.required
        ])));
      }
    });
  }

  trimThis(getString: string) {
    const temp = this.form.get(getString);
    temp.setValue(temp.value.trim());
  }

  accederConGoogle() {
    window.open('http://localhost:5000/auth/google', '_self');
  }


  onSubmit(user: User) {
      this.form.disable();
      this.auth.login(user).subscribe((res) => {
        this.form.enable();
        if (res.logged) {
          this.router.navigate(['/inventario']);
        } else if (res.credentialsErr) {
          this.countCredentialsError.next(this.countCredentialsError.value + 1);
          this.badCredentials = true;
          // alert('Error no se pudo iniciar sesion');
        }
      });

    // delete mediaItem.name; borrara name de el paso de variable mediaItem
    }

}
