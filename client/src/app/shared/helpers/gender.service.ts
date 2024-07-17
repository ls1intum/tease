import { Injectable } from '@angular/core';
import { Gender } from 'src/app/api/models';

@Injectable({
  providedIn: 'root',
})
export class GenderService {
  constructor() {}

  getIconFromGender(gender: Gender): string {
    switch (gender) {
      case Gender.Female:
        return '♀';
      case Gender.Male:
        return '♂';
      case Gender.Other:
        return '⚥';
      case Gender.PreferNotToSay:
        return '?';
      default:
        return '?';
    }
  }
}
