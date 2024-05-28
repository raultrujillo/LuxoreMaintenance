import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { MyPropertiesComponent } from './components/my-properties/my-properties.component';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

const routes: Routes = [
  Shell.childRoutes([{ path: 'about', loadChildren: () => import('./about/about.module').then((m) => m.AboutModule) }]),
  // Shell.childRoutes([{ path: 'MyProperties', loadComponent: () => import('./components/my-properties/my-properties.component').then((m) => m.MyPropertiesComponent) }]),
  Shell.childRoutes([
    {
      path: 'MyProperties',
      component: MyPropertiesComponent,
      data: { title: marker('Lista de propiedades') },
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
