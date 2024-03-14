import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConstraintMappingService {
  constructor() {
    try {
      const mapping: UUIDtoNumberMapping = new Map(JSON.parse(localStorage.getItem('mapping'))) || this.newMapping();
      this.mappingSubject$.next(mapping);
    } catch (error) {
      this.mappingSubject$.next(this.newMapping());
    }

    this.mappingSubject$.subscribe(mapping => {
      localStorage.setItem('mapping', JSON.stringify(Array.from(mapping.entries())));
    });
  }

  mappingSubject$: BehaviorSubject<UUIDtoNumberMapping> = new BehaviorSubject<UUIDtoNumberMapping>(this.newMapping());

  private setMapping(mapping: UUIDtoNumberMapping): void {
    this.mappingSubject$.next(mapping);
  }

  getNumber(key: string): string {
    const mapping = this.getMapping();
    if (mapping.has(key)) {
      return mapping.get(key).toString();
    }
    const numbers = Array.from(mapping.values());
    let number = 1;
    while (numbers.includes(number)) {
      number++;
    }
    mapping.set(key, number);
    this.setMapping(mapping);
    return number.toString();
  }

  getKey(value: string): string {
    const mapping = this.getMapping();
    const key = Array.from(mapping.keys()).find(key => mapping.get(key).toString() === value);
    return key;
  }

  deleteMapping(): void {
    this.mappingSubject$.next(this.newMapping());
  }

  private getMapping(): UUIDtoNumberMapping {
    return this.mappingSubject$.getValue();
  }

  private newMapping(): UUIDtoNumberMapping {
    return new Map<string, number>();
  }
}

type UUIDtoNumberMapping = Map<string, number>;
