import { Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastsService {
  constructor(private toastr: ToastrService) {}

  showToast(message: string, title: string, isSuccess: boolean): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: Partial<IndividualConfig<any>> = {
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
