import { Injectable } from '@angular/core';
import { MD5 } from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class GravatarService {
  constructor() {}

  private readonly GRAVATAR_URL = 'http://www.gravatar.com/avatar/';

  getGravatarURLFromMail(email: string, size = 200): string {
    if (!email) return this.GRAVATAR_URL;
    const emailHash = MD5(email).toString();
    return this.GRAVATAR_URL + emailHash + '?s=' + size.toString() + '&d=mm';
  }
}
