import {Component, OnInit} from '@angular/core';
import {OverlayComponent} from '../../overlay.service';

@Component({
  selector: 'app-confirmation-overlay',
  templateUrl: './confirmation-overlay.component.html',
  styleUrls: ['./confirmation-overlay.component.scss']
})
export class ConfirmationOverlayComponent implements OnInit, OverlayComponent {
  public data: {
    action: String,
    actionDescription: String,
    onConfirmed: (() => void),
    onCancelled: (() => void)};

  constructor() { }

  ngOnInit() {

  }
}
