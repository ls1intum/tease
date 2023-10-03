import { Component, OnInit } from '@angular/core';
import { OverlayComponent } from '../../overlay.service';

@Component({
  selector: 'app-confirmation-overlay',
  templateUrl: './confirmation-overlay.component.html',
  styleUrls: ['./confirmation-overlay.component.scss'],
})
export class ConfirmationOverlayComponent implements OverlayComponent {
  public data: {
    action: string;
    actionDescription: string;
    onConfirmed: () => void;
    onCancelled: () => void;
  };
}
