/**
 * Created by Malte Bucksch on 16/12/2016.
 */
import {Injectable, ViewContainerRef} from '@angular/core';
import {Subject} from "rxjs";
import {LangDefaults} from "../constants/language.constants";

@Injectable()
export class ToolbarService {
  private buttonNameSource = new Subject<string>();
  private buttonVisibilitySource = new Subject<boolean>();
  private buttonClickSource = new Subject<void>();
  private toolbarVisibilitySource = new Subject<boolean>();
  private scoreVisibilitySource = new Subject<boolean>();
  private totalScoreSource = new Subject<number>();

  buttonNameChanged = this.buttonNameSource.asObservable();
  buttonClicked = this.buttonClickSource.asObservable();
  buttonVisibilityChanged = this.buttonVisibilitySource.asObservable();
  toolbarVisibilityChanged = this.toolbarVisibilitySource.asObservable();
  scoreVisibilityChanged = this.scoreVisibilitySource.asObservable();
  totalScoreChanged = this.totalScoreSource.asObservable();

  constructor() {
  }

  resetToDefaultValues() {
    this.buttonNameSource.next(LangDefaults.ToolbarButtonName);
    this.buttonVisibilitySource.next(LangDefaults.ToolbarButtonIsVisible);
    this.setToolbarVisible(true);
    this.setScoreVisible(false);
  }

  setButtonVisibility(isVisible: boolean) {
    this.buttonVisibilitySource.next(isVisible);
  }

  changeButtonName(newName: string) {
    this.buttonNameSource.next(newName);
  }

  onButtonClicked() {
    this.buttonClickSource.next();
  }

  setToolbarVisible(isVisible: boolean) {
    this.toolbarVisibilitySource.next(isVisible);
  }

  setScoreVisible(isVisible: boolean) {
    this.scoreVisibilitySource.next(isVisible);
  }

  setTotalScore(value: number) {
    this.totalScoreSource.next(value);
  }
}
