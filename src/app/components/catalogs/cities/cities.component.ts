import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Cities } from '@app/models/cities.model';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CitiesModalComponent } from './modal/cities-modal.componet';
import { ToastService } from '@app/services/toast.service';
import { Catalog, CatalogResponse, CityRequest } from '@app/models/catalog.model';
import { CatalogService } from '@app/services/catalog.service';
import { Subscription, first } from 'rxjs';
import * as jsonData from 'src/assets/data/cities.json';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss'],
})
export class CitiesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'desc', 'actions'];
  dataSource: MatTableDataSource<Catalog> = new MatTableDataSource<Catalog>(new Array<Catalog>());
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  total: number = 0;

  catalogResponse: CatalogResponse = new CatalogResponse();
  page: number = 0;
  totalPage: number = 5;

  //states
  lstStates: Catalog[] = new Array<Catalog>();
  idStateSelected: number = 1;

  subscriptions = new Subscription();

  //request
  catalogRequest: CityRequest = new CityRequest();

  constructor(private modalService: NgbModal, private toast: ToastService, private catalogService: CatalogService) {}

  ngOnInit(): void {
    this.getStates();
    this.GetCatalog();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  //catlaogs
  getStates() {
    this.subscriptions.add(
      this.catalogService
        .getCatalog('states')
        .pipe(first())
        .subscribe({
          next: (res) => {
            this.lstStates = res;
          },
          error: (e) => {},
        })
    );
  }

  GetCatalog() {
    this.catalogRequest.idState = this.idStateSelected;
    this.catalogRequest.page = this.page;
    this.catalogRequest.totalPage = this.totalPage;

    this.subscriptions.add(
      this.catalogService
        .GetCities(this.catalogRequest)
        .pipe(first())
        .subscribe({
          next: (res) => {
            debugger;
            this.catalogResponse = res;
            this.paginator.length = this.catalogResponse.total;
            this.initDataSource();
          },
          error: (e) => {},
        })
    );

    //this.catalogResponse = jsonData as CatalogResponse;
  }

  public initDataSource() {
    var lstProperties = new Array<Catalog>();
    for (let index = 0; index < this.catalogResponse.list.length; index++) {
      const element = this.catalogResponse.list[index];
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

    city.idState = this.idStateSelected;
    modalRef.componentInstance.isUpadte = true;
    modalRef.componentInstance.objCatalog = city;

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
    this.page = data.pageIndex;
    this.totalPage = data.pageSize;
    this.GetCatalog();
  }

  onChangeState() {
    this.page = 0;
    this.totalPage = 5;
    this.paginator.pageIndex = 0;

    this.GetCatalog();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
