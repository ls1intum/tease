import { Component, EventEmitter, Output } from '@angular/core';
import { OverlayService } from 'src/app/overlay.service';
import { ImportOverlayComponent } from '../import-overlay/import-overlay.component';
import { facImportIcon } from 'src/assets/icons/icons';

@Component({
  selector: 'app-intro-card',
  templateUrl: './intro-card.component.html',
  styleUrls: ['./intro-card.component.scss'],
})
export class IntroCardComponent {
  facImportIcon = facImportIcon;

  constructor(private overlayService: OverlayService) {}

  showImportOverlay() {
    const overlayData = {
      onTeamsImported: () => {
        this.overlayService.closeOverlay();
      },
      overwriteWarning: false,
    };

    this.overlayService.displayComponent(ImportOverlayComponent, overlayData);
  }
}
