import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Cities } from '@app/models/cities.model';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CitiesModalComponent } from './modal/cities-modal.componet';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss'],
})
export class CitiesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'city', 'actions'];
  dataSource!: MatTableDataSource<Cities>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getCities();
  }
  getCities() {
    var lstCities = new Array<Cities>();
    let city = new Cities(1, 1, 'CDMX');
    lstCities.push(city);
    city = new Cities(2, 2, 'comita');
    lstCities.push(city);
    city = new Cities(3, 3, 'Ecatepec');
    lstCities.push(city);
    city = new Cities(4, 3, 'Chalco');
    lstCities.push(city);

    this.initDataSource(lstCities);
  }

  public initDataSource(data: any) {
    var lstProperties = new Array<Cities>();
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      lstProperties.push(element);
    }
    this.dataSource = new MatTableDataSource<Cities>(lstProperties);
    this.dataSource.paginator = this.paginator;
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
        this.getCities();
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
        this.getCities();
      },
      (r) => {
        // Cancel :c
      }
    );
  }
}
