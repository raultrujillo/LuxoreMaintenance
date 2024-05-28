import { NgModule } from '@angular/core';
import { CitiesComponent } from './cities/cities.component';
import { ColoniesComponent } from './colonies/colonies.component';
import { PropertyTypesComponent } from './property-types/property-types.component';
import { AmenitiesComponent } from './amenities/amenities.component';

@NgModule({
  imports: [],
  declarations: [CitiesComponent, ColoniesComponent, PropertyTypesComponent, AmenitiesComponent],
  exports: [CitiesComponent, ColoniesComponent, PropertyTypesComponent, AmenitiesComponent],
})
export class CatalogModule {}
