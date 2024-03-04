import { Injectable } from '@angular/core';
import { GlobalConfig, IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastsService {
  constructor(private toastr: ToastrService) {}

  showToast(message: string, title: string, isSuccess: boolean): void {
    const options: Partial<IndividualConfig<GlobalConfig>> = {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
    };
    if (isSuccess) {
      this.toastr.success(message, title, options);
    } else {
      this.toastr.error(message, title, options);
    }
  }
}
