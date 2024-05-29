import { NgModule } from '@angular/core';
import { CitiesComponent } from './cities/cities.component';
import { ColoniesComponent } from './colonies/colonies.component';
import { PropertyTypesComponent } from './property-types/property-types.component';
import { AmenitiesComponent } from './amenities/amenities.component';
import { MaterialModule } from '@app/material.module';
import { RouterModule } from '@angular/router';
import { CitiesModalComponent } from './cities/modal/cities-modal.componet';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [SharedModule, NgSelectModule],
  declarations: [CitiesComponent, ColoniesComponent, PropertyTypesComponent, AmenitiesComponent, CitiesModalComponent],
  exports: [CitiesComponent, ColoniesComponent, PropertyTypesComponent, AmenitiesComponent, CitiesModalComponent],
})
export class CatalogModule {}
