import { Injectable } from '@angular/core';
import * as countries from 'i18n-iso-countries';
import * as en from 'i18n-iso-countries/langs/en.json';

@Injectable({
  providedIn: 'root',
})
export class NationalityService {
  constructor() {
    countries.registerLocale(en);
  }

  getNameFromCode(nationality: string): string {
    return countries.getName(nationality, 'en');
    return '';
  }

  getEmojiFromCode(alpha2: string): string {
    // Calculate Unicode values
    const unicode_first = alpha2.charCodeAt(0) + 0x1f1a5;
    const unicode_second = alpha2.charCodeAt(1) + 0x1f1a5;

    // Return emoji string
    return String.fromCodePoint(unicode_first, unicode_second);
  }
}
