import { Subscription, BehaviorSubject } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { InventarioManagerService, TablaReporteItem } from 'src/app/inventario-manager.service';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DomSanitizer } from '@angular/platform-browser';

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

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;


  constructor(private router: Router, private sanitizer: DomSanitizer,
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
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  goToItem(row: TablaReporteItem) {
    this.router.navigate(['reportes', 'item', row.codigo]);
  }

}
