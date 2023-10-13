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
  public host: OverlayServiceHost;
  private displayedComponentData: any = null;

  public displayComponent(component: Type<OverlayComponent>, data: any) {
    if (this.displayedComponentData && this.displayedComponentData.onClose) {
      this.displayedComponentData.onClose();
    }
    if (this.host) {
      this.host.displayComponent(component, data);
      this.displayedComponentData = data;
    }
  }

  public closeOverlay() {
    if (this.displayedComponentData && this.displayedComponentData.onClose) {
      this.displayedComponentData.onClose();
    }
    if (this.host) {
      this.host.closeOverlay();
      this.displayedComponentData = null;
    }
  }
}
