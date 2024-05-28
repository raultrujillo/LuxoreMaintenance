import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cities-modal',
  templateUrl: './cities-modal.componet.html',
  styleUrls: ['./cities-modal.componet.scss'],
})
export class CitiesModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
