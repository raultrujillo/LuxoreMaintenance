import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Catalog, CityRequest } from '@app/models/catalog.model';
import { Cities } from '@app/models/cities.model';
import { States } from '@app/models/states.model';
import { CatalogService } from '@app/services/catalog.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, elementAt, first } from 'rxjs';

@Component({
  selector: 'app-cities-modal',
  templateUrl: './cities-modal.componet.html',
  styleUrls: ['./cities-modal.componet.scss'],
})
export class CitiesModalComponent {
  //form
  FormObjet!: FormGroup;
  city: string = '';

  public objCatalog: CityRequest = new CityRequest();

  //states
  lstStates: Catalog[] = new Array<Catalog>();
  idStateSelected: number = 1;

  isUpadte: boolean = false;

  subscriptions = new Subscription();
  constructor(
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    private catalogService: CatalogService
  ) {
    this.getStates();
    this.nuevoForm();
  }

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

  private add() {
    this.subscriptions.add(
      this.catalogService
        .addCity(this.objCatalog)
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
        .update(this.objCatalog)
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
      idState: ['', [Validators.required, Validators.min(1)]],
    });
  }
}
