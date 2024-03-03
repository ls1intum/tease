import { Injectable } from '@angular/core';
import * as countries from 'i18n-iso-countries';
declare const require;

@Injectable({
  providedIn: 'root',
})
export class NationalityService {
  constructor() {
    countries.registerLocale(require('i18n-iso-countries/langs/en.json'));
  }

  getNameFromCode(nationality: string): string {
    return countries.getName(nationality, 'en');
  }

  getEmojiFromCode(alpha2: string): string {
    // Calculate Unicode values
    const unicode_first = alpha2.charCodeAt(0) + 0x1f1a5;
    const unicode_second = alpha2.charCodeAt(1) + 0x1f1a5;

    // Return emoji string
    return String.fromCodePoint(unicode_first, unicode_second);
  }
}
