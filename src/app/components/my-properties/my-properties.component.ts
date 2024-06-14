import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Catalog } from '@app/models/catalog.model';
import { Property, PropertyRequest, PropertyResponse } from '@app/models/property.model';
import { CatalogService } from '@app/services/catalog.service';
import { PropertyService } from '@app/services/property-service';
import { Subscription, first } from 'rxjs';

@Component({
  selector: 'app-my-properties',
  templateUrl: './my-properties.component.html',
  styleUrls: ['./my-properties.component.scss'],
})
export class MyPropertiesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'title', 'postedYear', 'price', 'actions'];
  dataSource: MatTableDataSource<Property> = new MatTableDataSource<Property>(new Array<Property>());
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  subscriptions = new Subscription();
  //categories
  lstCategories: Catalog[] = new Array<Catalog>();
  idCategorySelected: number = 1;

  //paginador
  page: number = 0;
  totalPage: number = 5;

  //property
  propertyRequest: PropertyRequest = new PropertyRequest();
  propertyResponse: PropertyResponse = new PropertyResponse();

  //filtros
  wildcard: string = '';
  constructor(public propertyService: PropertyService, private catalogService: CatalogService) {}

  ngOnInit() {
    this.getCategories();
    this.getProperties();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getCategories() {
    this.subscriptions.add(
      this.catalogService
        .getCatalog('categories')
        .pipe(first())
        .subscribe({
          next: (res) => {
            this.lstCategories = res;
          },
          error: (e) => {},
        })
    );
  }

  getProperties() {
    this.propertyRequest.idCategory = this.idCategorySelected;
    this.propertyRequest.page = this.page;
    this.propertyRequest.totalPage = this.totalPage;
    this.propertyRequest.wildCard = this.wildcard;

    this.subscriptions.add(
      this.propertyService
        .getProperties(this.propertyRequest)
        .pipe(first())
        .subscribe({
          next: (res) => {
            this.propertyResponse = res;
            this.paginator.length = this.propertyResponse.total;
            this.initDataSource();
          },
          error: (e) => {},
        })
    );
  }

  public initDataSource() {
    this.dataSource = new MatTableDataSource<Property>(this.propertyResponse.list);
    this.dataSource.sort = this.sort;
  }

  onChangePage(data: PageEvent) {
    this.page = data.pageIndex;
    this.totalPage = data.pageSize;
    this.getProperties();
  }

  onChangeCategory() {
    this.page = 0;
    this.totalPage = 5;
    this.paginator.pageIndex = 0;
    this.getProperties();
  }
  public remove(property: Property) {
    // const index: number = this.dataSource.data.indexOf(property);
    // if (index !== -1) {
    //   const message = this.appService.getTranslateValue('MESSAGE.SURE_DELETE') ?? '';
    //   let dialogRef = this.appService.openConfirmDialog('', message);
    // 	dialogRef.afterClosed().subscribe(dialogResult => {
    // 		if(dialogResult){
    //       this.dataSource.data.splice(index,1);
    //       this.initDataSource(this.dataSource.data);
    // 		}
    // 	});
    // }
  }

  public applyFilter(ev: any) {
    let filterValue = (ev as HTMLInputElement).value;
    this.wildcard = filterValue?.trim().toLowerCase();

    this.getProperties();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
