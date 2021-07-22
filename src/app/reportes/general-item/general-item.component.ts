import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { InventarioManagerService, TablaReporteItem } from 'src/app/inventario-manager.service';

@Component({
  selector: 'app-general-item',
  templateUrl: './general-item.component.html',
  styleUrls: ['./general-item.component.css']
})
export class GeneralItemComponent implements OnInit, OnDestroy {

  view: [number, number] = [800, 400];
  colorScheme = {
    domain: ['#E44D25', '#112E96']
  };
  colorSchemeTwo = {
    domain: ['#E44D25', '#112E96']
  };
  single: any[];
  multi: any[];

  smallSubs: Subscription;

  downloadJsonHref: any;

  displayedColumns: string[] = ['codigo', 'name', 'cantidad', 'costoPropio', 'priceIGV', 'valueGasto', 'valueIngreso'];
  dataSource: MatTableDataSource<TablaReporteItem>;
  dataJSON = new BehaviorSubject<TablaReporteItem[]>(null);
  // dataSource$ = new Subject<MatTableDataSource<TablaReporteItem>>();

  @ViewChild(MatPaginator, {static: false})  set content(paginator: MatPaginator) {
    if (paginator && this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }

  @ViewChild(MatSort, {static: false}) set contentII(sort: MatSort) {
    if (sort && this.dataSource) {
      this.dataSource.sort = sort;
    }
  }


  constructor(private router: Router, private sanitizer: DomSanitizer, public auth: AuthService,
              breakpointObserver: BreakpointObserver, private inv: InventarioManagerService) {
      const isSmallScreenObs = breakpointObserver.observe(['(max-width: 900px)', '(max-width: 700px)']);
      this.smallSubs = isSmallScreenObs.subscribe(res => {
        if (res.breakpoints['(max-width: 900px)'] === true) {
          this.view = [550, 300];
        }
      });
  }

  ngOnDestroy(): void {
    if (this.smallSubs) {
      this.smallSubs.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.inv.getTablaReporteItemGeneral().subscribe(res => {
      if (res) {
        this.dataJSON.next(res);
        const theJSON = JSON.stringify(res);
        const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
        this.downloadJsonHref = uri;
        this.dataSource = new MatTableDataSource(res);
      }
    });
  }

  goToItem(row: TablaReporteItem) {
    this.router.navigate(['reportes', 'item', row.codigo]);
  }

}
