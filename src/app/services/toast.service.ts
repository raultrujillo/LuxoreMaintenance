import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastService: ToastrService) {}

  succes(mensaje: string) {
    this.toastService.success('', mensaje, {
      timeOut: 5000,
    });
  }

  error(mensaje: string) {
    this.toastService.error('', mensaje, {
      timeOut: 5000,
    });
  }

  errorReaload(mensaje: string) {
    this.toastService
      .error('', mensaje, {
        timeOut: 2500,
      })
      .onHidden.pipe(take(1))
      .subscribe(() => window.location.reload());
  }

  succesReload(mensaje: string) {
    this.toastService
      .success('', mensaje, {
        timeOut: 2500,
      })
      .onHidden.pipe(take(1))
      .subscribe(() => window.location.reload());
  }
}
