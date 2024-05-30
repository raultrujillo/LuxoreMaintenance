import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Cities } from '@app/models/cities.model';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CitiesModalComponent } from './modal/cities-modal.componet';
import { ToastService } from '@app/services/toast.service';
import { Catalog, CatalogResponse } from '@app/models/catalog.model';
import { CatalogService } from '@app/services/catalog.service';
import { first } from 'rxjs';
import * as jsonData from 'src/assets/data/cities.json';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss'],
})
export class CitiesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'desc', 'actions'];
  dataSource: MatTableDataSource<Catalog> = new MatTableDataSource<Catalog>(new Array<Catalog>());
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  total: number = 0;

  catalogResponse: CatalogResponse = new CatalogResponse();
  page: number = 0;
  totalPage: number = 0;

  constructor(private modalService: NgbModal, private toast: ToastService, private catalogService: CatalogService) {}

  ngOnInit(): void {
    this.GetCatalog();
  }

  GetCatalog() {
    // this.catalogService.getCatalog().pipe(first()).subscribe(
    //   res =>{
    //     debugger
    //     this.catalogResponse =  res;
    //     this.paginator.length =  this.catalogResponse.total;
    //     this.initDataSource(this.catalogResponse.listCatalogs);
    //   });

    this.catalogResponse = jsonData as CatalogResponse;

    this.initDataSource(this.catalogResponse.listCatalogs);
  }

  public initDataSource(data: any) {
    var lstProperties = new Array<Catalog>();
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      lstProperties.push(element);
    }
    this.dataSource = new MatTableDataSource<Catalog>(lstProperties);
    // this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  remove(obj: any) {}

  add() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'xl',
      centered: false,
      scrollable: true,
      windowClass: 'pgdat-modal pgdat-two modal-container-lvl0',
      backdropClass: 'backdrop-container-lvl0',
    };

    const modalRef = this.modalService.open(CitiesModalComponent, ngbModalOptions);

    modalRef.result.then(
      (v) => {
        this.toast.succes('Se ha agregado la ciudad');
        this.GetCatalog();
      },
      (r) => {
        // Cancel :c
      }
    );
  }

  edit(city: any) {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'xl',
      centered: false,
      scrollable: true,
      windowClass: 'pgdat-modal pgdat-two modal-container-lvl0',
      backdropClass: 'backdrop-container-lvl0',
    };

    const modalRef = this.modalService.open(CitiesModalComponent, ngbModalOptions);
    modalRef.componentInstance.objCity = city;

    modalRef.result.then(
      (v) => {
        this.toast.succes('Se ha actualizado la ciudad');
        this.GetCatalog();
      },
      (r) => {
        // Cancel :c
      }
    );
  }

  onChangePage(data: PageEvent) {
    debugger;
    this.page = this.paginator.pageIndex;
    this.totalPage = this.paginator.pageSize;
    this.GetCatalog();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
