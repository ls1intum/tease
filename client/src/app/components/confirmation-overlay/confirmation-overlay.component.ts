import { Component, OnInit } from '@angular/core';
import { OverlayComponent, OverlayService } from '../../overlay.service';

@Component({
  selector: 'app-confirmation-overlay',
  templateUrl: './confirmation-overlay.component.html',
  styleUrls: ['./confirmation-overlay.component.scss'],
})
export class ConfirmationOverlayComponent implements OverlayComponent, OnInit {
  data: {
    action: string;
    actionDescription: string;
    onConfirmed: () => void;
    onCancelled: () => void;

    title: string;
    description: string;

    primaryAction: () => void;
    primaryText: string;
    primaryButtonClass: string;
    secondaryAction: () => void;
    secondaryText: string;
    secondaryButtonStyle: string;

    isDismisable: boolean;
  };

  private defaultData = {
    title: 'Confirm action',
    description: 'This is a confirmation dialog. Are you sure you want to proceed?',

    primaryAction: () => {},
    primaryText: 'Submit',
    primaryButtonClass: 'btn-primary',

    secondaryAction: () => {
      this.overlayService.closeOverlay();
    },
    secondaryText: 'Cancel',
    secondaryButtonStyle: 'btn-secondary',

    isDismisable: true,
  };

  constructor(private overlayService: OverlayService) {}

  ngOnInit(): void {
    this.data = { ...this.defaultData, ...this.data };

    console.log(this.data);
  }
}
