import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EnumService {
  constructor() {}

  getEnumValue<T>(value: string, enumType: T, defaultValue?: T[keyof T]): T[keyof T] {
    const key = Object.keys(enumType).find(
      key => enumType[key as keyof T].toString().toUpperCase() === value.toUpperCase()
    );
    if (key) {
      return enumType[key as keyof T];
    } else if (defaultValue) {
      return defaultValue;
    } else {
      return null;
    }
  }
}
