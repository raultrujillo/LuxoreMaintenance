import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cities } from '@app/models/cities.model';
import { States } from '@app/models/states.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cities-modal',
  templateUrl: './cities-modal.componet.html',
  styleUrls: ['./cities-modal.componet.scss'],
})
export class CitiesModalComponent {
  //form
  FormObjet!: FormGroup;

  stateSelected: number = 0;
  city: string = '';

  public objCity: Cities = new Cities();

  lstStates: States[] = new Array<States>();
  constructor(public activeModal: NgbActiveModal, public formBuilder: FormBuilder) {
    this.getStates();
    this.nuevoForm();
  }

  getStates() {
    let x = new States(1, 'CDMX');
    this.lstStates.push(x);
    x = new States(2, 'Chiapas');
    this.lstStates.push(x);
    x = new States(3, 'Estado de mexico');
    this.lstStates.push(x);
  }

  save() {
    if (this.FormObjet.invalid) {
      return;
    }
    this.activeModal.close();
  }

  private nuevoForm() {
    this.FormObjet = this.formBuilder.group({
      city: [
        '',
        [
          Validators.required,
          //CustomValidators.validaEspacios,
          Validators.maxLength(500),
        ],
      ],
      stateId: ['', [Validators.required, Validators.min(1)]],
    });
  }
}
