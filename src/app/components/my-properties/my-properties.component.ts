import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Property } from '@app/models/app.models';
import { PropertyService } from '@app/services/property-service';
import * as jsonData from 'src/assets/data/properties.json';

@Component({
  selector: 'app-my-properties',
  templateUrl: './my-properties.component.html',
  styleUrls: ['./my-properties.component.scss'],
})
export class MyPropertiesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'published', 'actions'];
  dataSource!: MatTableDataSource<Property>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(public propertyService: PropertyService) {}

  ngOnInit() {
    // this.propertyService.getProperties().subscribe((res: any) => {
    //   this.initDataSource(res);
    // });

    this.initDataSource(jsonData);
  }

  public initDataSource(data: any) {
    var lstProperties = new Array<Property>();
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      lstProperties.push(element);
    }
    this.dataSource = new MatTableDataSource<Property>(lstProperties);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
    this.dataSource.filter = filterValue?.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
