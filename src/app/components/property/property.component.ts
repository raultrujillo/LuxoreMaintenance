import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Catalog, CityRequest, ColonyRequest } from '@app/models/catalog.model';
import { CatalogService } from '@app/services/catalog.service';
import { Observable, Subscription, first, map } from 'rxjs';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss'],
})
export class PropertyComponent implements OnInit, OnDestroy {
  firstFormGroup = this._formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    price: ['', Validators.required],
    comercialValue: ['', Validators.required],
    credit: ['', Validators.required],
    idPropertyType: ['', Validators.required],
    idCategory: ['', Validators.required],
    sold: ['', Validators.required],
  });

  secondFormGroup = this._formBuilder.group({
    garage: ['', Validators.required],
    carsNumber: ['', Validators.required],

    bedrooms: ['', Validators.required],
    bathrooms: ['', Validators.required],
    floors: ['', Validators.required],

    metersSurface: ['', Validators.required],
    metersBuilded: ['', Validators.required],
  });

  thirdFormGroup = this._formBuilder.group({
    addres: ['', Validators.required],
    pageAddress: ['', Validators.required],
    idState: ['', Validators.required],
    idCity: ['', Validators.required],
    idColony: ['', Validators.required],
    zip: ['', Validators.required],
    latitude: ['', Validators.required],
    longitude: ['', Validators.required],
  });
  isLinear = false;

  subscriptions = new Subscription();

  //catalogs
  lstStates: Catalog[] = new Array<Catalog>();
  lstCities: Catalog[] = new Array<Catalog>();
  lstColonies: Catalog[] = new Array<Catalog>();
  lstPropertyTypes: Catalog[] = new Array<Catalog>();
  lstCategories: Catalog[] = new Array<Catalog>();
  lstAmenities: Catalog[] = new Array<Catalog>();

  idStateSelected: number = 1;
  idCitySelected: number = 1;
  idColonySelected: number = 1;

  stepperOrientation: Observable<StepperOrientation>;
  constructor(
    private _formBuilder: FormBuilder,
    private catalogService: CatalogService,
    breakpointObserver: BreakpointObserver
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    this.getStates();
    this.getCities();
    this.getColonies();
    this.getAmenities();
    this.getCategories();
    this.getPropertyTypes();
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
  getCities() {
    var cityRequest = new CityRequest();
    cityRequest.idState = this.idStateSelected;
    cityRequest.page = 0;
    cityRequest.totalPage = 1000;

    this.subscriptions.add(
      this.catalogService
        .getCities(cityRequest)
        .pipe(first())
        .subscribe({
          next: (res) => {
            this.lstCities = res.list;
          },
          error: (e) => {},
        })
    );
  }
  getColonies() {
    var colonyRequest = new ColonyRequest();
    colonyRequest.idCity = this.idCitySelected;
    colonyRequest.page = 0;
    colonyRequest.totalPage = 1000;

    this.subscriptions.add(
      this.catalogService
        .getColonies(colonyRequest)
        .pipe(first())
        .subscribe({
          next: (res) => {
            this.lstColonies = res.list;
          },
          error: (e) => {},
        })
    );
  }
  getAmenities() {
    this.subscriptions.add(
      this.catalogService
        .getCatalog('amenities')
        .pipe(first())
        .subscribe({
          next: (res) => {
            this.lstAmenities = res;
          },
          error: (e) => {},
        })
    );
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
  getPropertyTypes() {
    this.subscriptions.add(
      this.catalogService
        .getCatalog('property')
        .pipe(first())
        .subscribe({
          next: (res) => {
            this.lstPropertyTypes = res;
          },
          error: (e) => {},
        })
    );
  }

  onChangeState() {
    this.getCities();
  }

  onChangeCity() {
    this.getColonies();
  }
}
