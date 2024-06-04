import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Catalog, CityRequest, PropertyTypeRequest } from '@app/models/catalog.model';
import { Cities } from '@app/models/cities.model';
import { States } from '@app/models/states.model';
import { CatalogService } from '@app/services/catalog.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, elementAt, first } from 'rxjs';

@Component({
  selector: 'app-property-type-modal',
  templateUrl: './property-type-modal.componet.html',
  styleUrls: ['./property-type-modal.componet.scss'],
})
export class PropertyTypeModalComponent {
  //form
  FormObjet!: FormGroup;
  city: string = '';

  public objCatalog: PropertyTypeRequest = new PropertyTypeRequest();

  isUpadte: boolean = false;

  subscriptions = new Subscription();
  constructor(
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    private catalogService: CatalogService
  ) {
    this.nuevoForm();
  }
  save() {
    debugger;
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
        .addPropertyType(this.objCatalog)
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
        .updatePropertyType(this.objCatalog)
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
    });
  }
}
