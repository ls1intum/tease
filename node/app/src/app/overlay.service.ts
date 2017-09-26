import {Injectable, Type} from '@angular/core';

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

  constructor() { }

  public displayComponent(component: Type<OverlayComponent>, data: any) {
    if (this.host) {
      this.host.displayComponent(component, data);
    }
  }

  public closeOverlay() {
    if (this.host) {
      this.host.closeOverlay();
    }
  }
}
