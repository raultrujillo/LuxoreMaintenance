import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AmenitiesRequest, Catalog, CatalogResponse, PropertyTypeRequest } from '@app/models/catalog.model';
import { CatalogService } from '@app/services/catalog.service';
import { ToastService } from '@app/services/toast.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, first } from 'rxjs';
import { PropertyTypeModalComponent } from '../property-types/modal/property-type-modal.componet';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AmenityModalComponent } from './modal/amenity-modal.componet';

@Component({
  selector: 'app-amenities',
  templateUrl: './amenities.component.html',
  styleUrls: ['./amenities.component.scss'],
})
export class AmenitiesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'desc', 'actions'];
  dataSource: MatTableDataSource<Catalog> = new MatTableDataSource<Catalog>(new Array<Catalog>());
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  catalogResponse: CatalogResponse = new CatalogResponse();

  catalogRequest: AmenitiesRequest = new AmenitiesRequest();

  subscriptions = new Subscription();

  total: number = 0;
  page: number = 0;
  totalPage: number = 5;

  constructor(private modalService: NgbModal, private toast: ToastService, private catalogService: CatalogService) {}

  ngOnInit(): void {
    this.GetCatalog();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  GetCatalog() {
    this.catalogRequest.page = this.page;
    this.catalogRequest.totalPage = this.totalPage;

    this.subscriptions.add(
      this.catalogService
        .getAmenities(this.catalogRequest)
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
  onChangePage(data: PageEvent) {
    this.page = data.pageIndex;
    this.totalPage = data.pageSize;
    this.GetCatalog();
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

    const modalRef = this.modalService.open(AmenityModalComponent, ngbModalOptions);
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

  edit(amenity: any) {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'xl',
      centered: false,
      scrollable: true,
      windowClass: 'pgdat-modal pgdat-two modal-container-lvl0',
      backdropClass: 'backdrop-container-lvl0',
    };

    const modalRef = this.modalService.open(AmenityModalComponent, ngbModalOptions);
    modalRef.componentInstance.isUpadte = true;
    modalRef.componentInstance.objCatalog = amenity;
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
}
