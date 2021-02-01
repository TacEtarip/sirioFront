import { first } from 'rxjs/operators';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-auto',
  templateUrl: './auto.component.html',
  styleUrls: ['./auto.component.css']
})
export class AutoComponent implements OnInit, AfterViewInit {

  mensajeToShow = new BehaviorSubject<string>('Espere un momento');

  constructor(private ar: ActivatedRoute, private auth: AuthService, private route: Router) {
   }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.ar.paramMap.pipe(first()).subscribe( param => {
      const token = param.get('token');
      this.auth.loginFast(token).subscribe((res) => {
        switch (res.code) {
          case 0:
            this.mensajeToShow.next(res.message);
            this.route.navigate(['/inventario']);
            break;
          case 1:
            this.mensajeToShow.next(res.message);
            this.route.navigate(['/login']);
            break;
          default:
            this.mensajeToShow.next(res.message);
            break;
        }
      });
    });
  }

}
