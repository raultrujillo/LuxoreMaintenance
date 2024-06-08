import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { MyPropertiesComponent } from './components/my-properties/my-properties.component';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { ColoniesComponent } from './components/catalogs/colonies/colonies.component';
import { CitiesComponent } from './components/catalogs/cities/cities.component';
import { PropertyTypesComponent } from './components/catalogs/property-types/property-types.component';
import { AmenitiesComponent } from './components/catalogs/amenities/amenities.component';
import { PropertyComponent } from './components/property/property.component';

const routes: Routes = [
  Shell.childRoutes([{ path: 'about', loadChildren: () => import('./about/about.module').then((m) => m.AboutModule) }]),

  Shell.childRoutes([
    {
      path: 'MyProperties',
      component: MyPropertiesComponent,
      data: { title: marker('Lista de propiedades') },
    },
  ]),

  Shell.childRoutes([
    {
      path: 'add',
      component: PropertyComponent,
      data: { title: marker('Nueva propiedad') },
    },
  ]),

  Shell.childRoutes([
    {
      path: 'ciudades',
      component: CitiesComponent,
      data: { title: marker('Catalogo de ciudades') },
    },
  ]),
  Shell.childRoutes([
    {
      path: 'tipo-propiedad',
      component: PropertyTypesComponent,
      data: { title: marker('Catalogo de tipo de propiedad') },
    },
  ]),
  Shell.childRoutes([
    {
      path: 'amenidades',
      component: AmenitiesComponent,
      data: { title: marker('Catalogo de amenidades') },
    },
  ]),

  Shell.childRoutes([
    {
      path: 'colonias',
      component: ColoniesComponent,
      data: { title: marker('Catalogo de ciudades') },
    },
  ]),
  // Fallback when no prior route is matched
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
