import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { LoaderComponent } from './loader/loader.component';
import { MyPropertiesComponent } from '@app/components/my-properties/my-properties.component';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PropertyComponent } from '@app/components/property/property.component';
import { InputFileConfig, InputFileModule } from '@app/components/input-file/input-file.module';
import { FormatNumberDirective } from '@app/components/utils/directives/formart.directive';
import { NgSelectModule } from '@ng-select/ng-select';
const config: InputFileConfig = {
  fileAccept: '*',
};

@NgModule({
  imports: [
    FlexLayoutModule,
    MaterialModule,
    TranslateModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    InputFileModule.forRoot(config),
    NgSelectModule,
  ],
  declarations: [
    LoaderComponent,
    MyPropertiesComponent,
    ConfirmDialogComponent,
    AlertDialogComponent,
    PropertyComponent,
    FormatNumberDirective,
  ],
  exports: [LoaderComponent, FormsModule, ReactiveFormsModule, MaterialModule, RouterModule, CommonModule],
})
export class SharedModule {}
