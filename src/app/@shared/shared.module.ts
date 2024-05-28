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

@NgModule({
  imports: [FlexLayoutModule, MaterialModule, TranslateModule, CommonModule, RouterModule],
  declarations: [LoaderComponent, MyPropertiesComponent, ConfirmDialogComponent, AlertDialogComponent],
  exports: [LoaderComponent],
})
export class SharedModule {}
