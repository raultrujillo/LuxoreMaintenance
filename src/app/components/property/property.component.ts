import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Catalog, CityRequest, ColonyRequest } from '@app/models/catalog.model';
import { Property } from '@app/models/property.model';
import { CatalogService } from '@app/services/catalog.service';
import { PropertyService } from '@app/services/property-service';
import { ToastService } from '@app/services/toast.service';
import { Observable, Subscription, first, map } from 'rxjs';
import { InputFileComponent } from '../input-file/components/input-file/input-file.component';
import { InputFile } from '../input-file/interfaces/input-file';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss'],
})
export class PropertyComponent implements OnInit, OnDestroy {
  firstFormGroup = this._formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    notes: ['', Validators.required],
    price: ['', [Validators.required, Validators.min(1)]],
    comercialValue: ['', [Validators.required, Validators.min(1)]],
    credit: [''],
    idPropertyType: ['', [Validators.required, Validators.min(1)]],
    idCategory: ['', [Validators.required, Validators.min(1)]],
    sold: ['', []],
    enable: ['', []],
  });

  secondFormGroup = this._formBuilder.group({
    garage: [''],
    carsNumber: ['', Validators.required],

    bedrooms: ['', Validators.required],
    bathrooms: ['', Validators.required],
    floors: ['', Validators.required],

    metersSurface: ['', Validators.required],
    metersBuilded: ['', Validators.required],

    amenities: [''],
  });

  thirdFormGroup = this._formBuilder.group({
    addres: ['', Validators.required],
    pageAddress: ['', Validators.required],
    idState: ['', [Validators.required, Validators.min(1)]],
    idCity: ['', [Validators.required, Validators.min(1)]],
    idColony: ['', [Validators.required, Validators.min(1)]],
    zip: ['', Validators.required],
    latitude: ['', Validators.required],
    longitude: ['', Validators.required],
  });
  isLinear = true;
  isUpdate = false;

  subscriptions = new Subscription();

  //catalogs
  lstStates: Catalog[] = new Array<Catalog>();
  lstCities: Catalog[] = new Array<Catalog>();
  lstColonies: Catalog[] = new Array<Catalog>();
  lstPropertyTypes: Catalog[] = new Array<Catalog>();
  lstCategories: Catalog[] = new Array<Catalog>();
  lstAmenities: Catalog[] = new Array<Catalog>();
  lstAmenitiesSelected: Catalog[] = new Array<Catalog>();

  idStateSelected: number = 0;
  idCitySelected: number = 0;
  idColonySelected: number = 0;
  credit: boolean = false;

  //prperty
  property: Property = new Property();

  propertyId: number = 0;
  private sub: any;

  //images
  images: InputFile[] = new Array<InputFile>();
  mainImages: InputFile[] = new Array<InputFile>();

  @ViewChild('imageComp') imageComponent: InputFileComponent | undefined;
  @ViewChild('imageMainComp') imageMainComponent: InputFileComponent | undefined;

  stepperOrientation: Observable<StepperOrientation>;
  constructor(
    private _formBuilder: FormBuilder,
    private catalogService: CatalogService,
    breakpointObserver: BreakpointObserver,
    private _PropertyService: PropertyService,
    private toast: ToastService,
    private route: ActivatedRoute
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    this.getStates();

    this.getAmenities();
    this.getCategories();
    this.getPropertyTypes();

    this.sub = this.route.params.subscribe((params) => {
      this.propertyId = params['id'];
      if (this.propertyId !== undefined) {
        this.getPropertyById();
      } else {
        this.property = new Property();
        this.isLinear = true;
        this.isUpdate = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.sub.unsubscribe();
  }

  updateCatalog() {
    this.getStates();
    this.getCities();
    this.getColonies();
    this.getAmenities();
    this.getCategories();
    this.getPropertyTypes();
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

  getValues(event: { isUserInput: any; source: { value: any; selected: any } }) {
    if (event.isUserInput) {
      if (event.source.selected === true) {
        this.lstAmenitiesSelected.push(event.source.value);
      } else {
        this.lstAmenitiesSelected = this.lstAmenitiesSelected.filter((x) => x.id !== event.source.value.id);
      }
    }
  }

  onlyDigits(event: any) {
    const code = event.charCode;
    var isValid = code >= 48 && code <= 57;
    return isValid;
  }

  onlyDigitsDecimal(event: any) {
    const code = event.charCode;
    console.log(code);
    var isValid = (code >= 48 && code <= 57) || code == 46;
    return isValid;
  }

  addProperty() {
    if (this.thirdFormGroup.invalid) {
      return;
    }
    this.property.idCity.id = this.idCitySelected;
    this.property.idState.id = this.idStateSelected;
    this.property.idColony.id = this.idCitySelected;
    this.property.amenities = this.lstAmenitiesSelected;
    this.property.postedYear = undefined;
    this.property.updateOn = undefined;

    this.subscriptions.add(
      this._PropertyService
        .addProperty(this.property)
        .pipe(first())
        .subscribe({
          next: (res) => {
            this.property.id = +res.defaultMessage;
            this.toast.succes('Se ha guardado la informació. Favor de subir las imagenes correspondientes.');
          },
          error: (e) => {},
        })
    );
  }
  updateProperty() {
    if (this.thirdFormGroup.invalid) {
      return;
    }
    this.property.idCity.id = this.idCitySelected;
    this.property.idState.id = this.idStateSelected;
    this.property.idColony.id = this.idCitySelected;
    this.property.amenities = this.lstAmenitiesSelected;
    this.property.updateOn = undefined;

    this.subscriptions.add(
      this._PropertyService
        .updateProperty(this.property)
        .pipe(first())
        .subscribe({
          next: (res) => {
            this.property.id = +res.defaultMessage;
            this.toast.succes('Se ha guardado la informació. Favor de subir las imagenes correspondientes.');
          },
          error: (e) => {},
        })
    );
  }

  getPropertyById() {
    this.subscriptions.add(
      this._PropertyService
        .getPropertyById(this.propertyId)
        .pipe(first())
        .subscribe({
          next: (res) => {
            this.property = res;
            this.idStateSelected = res.idState.id;
            this.getCities();
            this.idCitySelected = res.idState.id;
            this.getColonies();
            this.idColonySelected = res.idState.id;
            this.isLinear = false;
            this.isUpdate = true;

            //set all imges detail
            if (res.images.length > 0) {
              res.images.forEach((x) => {
                this.images.push({ id: x.id, imagePath: x.imagePath, preview: x.imagePath, main: false });
              });

              this.imageComponent?.setImages(this.images);
            }
            //set main image
            if (res.mainImage !== '')
              this.mainImages.push({ id: 0, imagePath: res.mainImage, preview: res.mainImage, main: true });
            this.imageMainComponent?.setImages(this.mainImages);
          },
          error: (e) => {},
        })
    );
  }
  //images

  saveImages() {
    // this.images =  new Array<ImagesModel>();
    // var img =  new ImagesModel()
    // if(this.childFRList?.files !== undefined && this.childFRList?.files.length > 0){
    //   this.childFRList?.files.forEach( x=> {
    //     debugger
    //      if(x.preview !== ''){
    //       img.file = x.preview;
    //       img.main =  false
    //      }
    //    })
    //  this.subscriptions.add( this._PropertyService
    //   .updatImages(this.property.id,img)
    //   .pipe(first())
    //   .subscribe({
    //     next: (res) => {
    //       this.property.id = +res.defaultMessage;
    //       this.toast.succes('Se ha guardado la informació. Favor de subir las imagenes correspondientes.');
    //     },
    //     error: (e) => {},
    //   }))
    // }
  }
}
