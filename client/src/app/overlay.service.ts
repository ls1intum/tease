import { Injectable, Type } from '@angular/core';

export interface OverlayComponent {
  data: any;
}

export interface OverlayServiceHost {
  displayComponent(component: Type<OverlayComponent>, data: any);
  closeOverlay();
}

@Injectable()
export class OverlayService {
  host: OverlayServiceHost;
  private displayedComponentData: any = null;

  displayComponent(component: Type<OverlayComponent>, data: any): void {
    if (this.displayedComponentData && this.displayedComponentData.onClose) {
      this.displayedComponentData.onClose();
    }

    if (this.host) {
      this.host.displayComponent(component, data);
      this.displayedComponentData = data;
    }
  }

  closeOverlay(): void {
    if (this.displayedComponentData && this.displayedComponentData.onClose) {
      this.displayedComponentData.onClose();
    }

    if (this.host) {
      this.host.closeOverlay();
      this.displayedComponentData = null;
    }
  }

  switchComponent(component: Type<OverlayComponent>, data: any): void {
    this.closeOverlay();
    setTimeout(() => {
      this.displayComponent(component, data);
    }, 1);
  }
}
