import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Catalog, CatalogResponse, CityRequest, ColonyRequest } from '@app/models/catalog.model';
import { CatalogService } from '@app/services/catalog.service';
import { ToastService } from '@app/services/toast.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CitiesModalComponent } from '../cities/modal/cities-modal.componet';
import * as jsonData from 'src/assets/data/colonies.json';
import { ColoniesModalComponent } from './modal/colonies-modal.componet';
import { Subscription, first } from 'rxjs';
@Component({
  selector: 'app-colonies',
  templateUrl: './colonies.component.html',
  styleUrls: ['./colonies.component.scss'],
})
export class ColoniesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'desc', 'actions'];
  dataSource: MatTableDataSource<Catalog> = new MatTableDataSource<Catalog>(new Array<Catalog>());
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  total: number = 0;

  catalogResponse: CatalogResponse = new CatalogResponse();
  page: number = 0;
  totalPage: number = 0;

  //states
  lstStates: Catalog[] = new Array<Catalog>();
  idStateSelected: number = 1;

  //cities
  lstCities: Catalog[] = new Array<Catalog>();
  idCitySelected: number = 1;
  catalogCityRequest: CityRequest = new CityRequest();

  // Colonies

  catalogRequest: ColonyRequest = new ColonyRequest();
  subscriptions = new Subscription();

  constructor(private modalService: NgbModal, private toast: ToastService, private catalogService: CatalogService) {}

  ngOnInit(): void {
    this.getStates();
    this.getCities();
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

  onChangeState() {
    this.getCities();
  }

  getCities() {
    this.page = 0;
    this.totalPage = 5;
    this.paginator.pageIndex = 0;

    this.catalogCityRequest.idState = this.idStateSelected;
    this.catalogCityRequest.page = 0;
    this.catalogCityRequest.totalPage = 1000;
    this.subscriptions.add(
      this.catalogService
        .getCities(this.catalogCityRequest)
        .pipe(first())
        .subscribe({
          next: (res) => {
            this.lstCities = res.list;
            this.idCitySelected = res.list[0].id;
            this.GetCatalog();
          },
          error: (e) => {},
        })
    );
  }

  onChangeCity() {
    this.GetCatalog();
  }

  GetCatalog() {
    this.catalogRequest.idCity = this.idCitySelected;
    this.catalogRequest.page = this.page;
    this.catalogRequest.totalPage = this.totalPage;

    this.subscriptions.add(
      this.catalogService
        .getColonies(this.catalogRequest)
        .pipe(first())
        .subscribe({
          next: (res) => {
            this.catalogResponse = res;
            this.paginator.length = this.catalogResponse.total;
            this.initDataSource();
          },
          error: (e) => {},
        })
    );
  }

  public initDataSource() {
    var lstProperties = new Array<Catalog>();
    for (let index = 0; index < this.catalogResponse.list.length; index++) {
      const element = this.catalogResponse.list[index];
      lstProperties.push(element);
    }
    this.dataSource = new MatTableDataSource<Catalog>(lstProperties);
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

    const modalRef = this.modalService.open(ColoniesModalComponent, ngbModalOptions);
    modalRef.componentInstance.isUpadte = false;
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

  edit(colony: any) {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'xl',
      centered: false,
      scrollable: true,
      windowClass: 'pgdat-modal pgdat-two modal-container-lvl0',
      backdropClass: 'backdrop-container-lvl0',
    };

    const modalRef = this.modalService.open(ColoniesModalComponent, ngbModalOptions);
    modalRef.componentInstance.idStateSelected = this.idStateSelected;
    colony.idCity = this.idCitySelected;
    modalRef.componentInstance.isUpadte = true;
    modalRef.componentInstance.objCatalog = colony;
    modalRef.componentInstance.getCities();

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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
