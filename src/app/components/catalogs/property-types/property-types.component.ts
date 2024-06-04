import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Catalog, CatalogResponse, CityRequest, ColonyRequest, PropertyTypeRequest } from '@app/models/catalog.model';
import { CatalogService } from '@app/services/catalog.service';
import { ToastService } from '@app/services/toast.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, first } from 'rxjs';
import { ColoniesModalComponent } from '../colonies/modal/colonies-modal.componet';
import { PropertyTypeModalComponent } from './modal/property-type-modal.componet';

@Component({
  selector: 'app-property-types',
  templateUrl: './property-types.component.html',
  styleUrls: ['./property-types.component.scss'],
})
export class PropertyTypesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'desc', 'actions'];
  dataSource: MatTableDataSource<Catalog> = new MatTableDataSource<Catalog>(new Array<Catalog>());

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  public listCatalog: Catalog[] = new Array<Catalog>();

  catalogRequest: PropertyTypeRequest = new PropertyTypeRequest();

  subscriptions = new Subscription();

  constructor(private modalService: NgbModal, private toast: ToastService, private catalogService: CatalogService) {}

  ngOnInit(): void {
    this.GetCatalog();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  GetCatalog() {
    this.subscriptions.add(
      this.catalogService
        .getCatalog('property')
        .pipe(first())
        .subscribe({
          next: (res) => {
            this.listCatalog = res;
            this.initDataSource();
          },
          error: (e) => {},
        })
    );
  }

  public initDataSource() {
    var lstProperties = new Array<Catalog>();
    for (let index = 0; index < this.listCatalog.length; index++) {
      const element = this.listCatalog[index];
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

    const modalRef = this.modalService.open(PropertyTypeModalComponent, ngbModalOptions);
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

    const modalRef = this.modalService.open(PropertyTypeModalComponent, ngbModalOptions);
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
}
