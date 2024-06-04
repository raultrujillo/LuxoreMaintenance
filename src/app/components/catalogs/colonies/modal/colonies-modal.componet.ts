import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Catalog, CityRequest, ColonyRequest } from '@app/models/catalog.model';
import { Cities } from '@app/models/cities.model';
import { States } from '@app/models/states.model';
import { CatalogService } from '@app/services/catalog.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, first } from 'rxjs';

@Component({
  selector: 'app-colonies-modal',
  templateUrl: './colonies-modal.componet.html',
  styleUrls: ['./colonies-modal.componet.scss'],
})
export class ColoniesModalComponent {
  //form
  FormObjet!: FormGroup;
  city: string = '';

  public objCatalog: ColonyRequest = new ColonyRequest();
  isUpadte: boolean = false;
  //states
  lstStates: Catalog[] = new Array<Catalog>();
  idStateSelected: number = 0;

  //City
  //cities
  lstCities: Catalog[] = new Array<Catalog>();
  idCitySelected: number = 0;
  catalogCityRequest: CityRequest = new CityRequest();

  subscriptions = new Subscription();
  constructor(
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    private catalogService: CatalogService
  ) {
    this.getStates();
    this.getCities();
    this.nuevoForm();
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
          },
          error: (e) => {},
        })
    );
  }

  save() {
    if (this.FormObjet.invalid) {
      return;
    }
    if (this.isUpadte) {
      this.update();
    } else {
      this.add();
    }
  }

  onlyDigits(event: any) {
    const code = event.charCode;
    var isValid = code >= 48 && code <= 57;
    return isValid;
  }

  private add() {
    this.subscriptions.add(
      this.catalogService
        .addColony(this.objCatalog)
        .pipe(first())
        .subscribe({
          next: (res) => {
            this.objCatalog;
            this.activeModal.close();
          },
          error: (e) => {},
        })
    );
  }

  private update() {
    this.subscriptions.add(
      this.catalogService
        .updateColony(this.objCatalog)
        .pipe(first())
        .subscribe({
          next: (res) => {
            this.objCatalog;
            this.activeModal.close();
          },
          error: (e) => {},
        })
    );
  }

  private nuevoForm() {
    this.FormObjet = this.formBuilder.group({
      description: [
        '',
        [
          Validators.required,
          //CustomValidators.validaEspacios,
          Validators.maxLength(500),
        ],
      ],
      postalCode: [
        '',
        [
          Validators.required,
          //CustomValidators.validaEspacios,
          Validators.maxLength(10),
        ],
      ],
      idCity: ['', [Validators.required, Validators.min(1)]],
      idState: ['', [Validators.required, Validators.min(1)]],
    });
  }
}
