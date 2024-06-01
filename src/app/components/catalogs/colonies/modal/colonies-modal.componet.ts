import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Catalog } from '@app/models/catalog.model';
import { Cities } from '@app/models/cities.model';
import { States } from '@app/models/states.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-colonies-modal',
  templateUrl: './colonies-modal.componet.html',
  styleUrls: ['./colonies-modal.componet.scss'],
})
export class ColoniesModalComponent {
  //form
  FormObjet!: FormGroup;
  city: string = '';

  public objCatalog: Catalog = new Catalog();

  //states
  lstStates: Catalog[] = new Array<Catalog>();
  idStateSelected: number = 0;

  //City
  lstCities: Catalog[] = new Array<Catalog>();

  constructor(public activeModal: NgbActiveModal, public formBuilder: FormBuilder) {
    this.getStates();
    this.getCities();
    this.nuevoForm();
  }

  getCities() {}

  //catlaogs
  getStates() {}

  save() {
    if (this.FormObjet.invalid) {
      return;
    }
    this.objCatalog;
    this.activeModal.close();
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
      idCity: ['', [Validators.required, Validators.min(1)]],
    });
  }
}
