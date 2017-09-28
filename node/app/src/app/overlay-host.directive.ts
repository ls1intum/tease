import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appOverlayHost]',
})
export class OverlayHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
