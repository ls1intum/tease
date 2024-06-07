import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IdMappingService {
  mappingSubject$: BehaviorSubject<UUIDtoNumberMapping> = new BehaviorSubject<UUIDtoNumberMapping>(this.newMapping());

  constructor() {
    try {
      const storedMapping = localStorage.getItem('mapping') || '[]';
      const mapping: UUIDtoNumberMapping = new Map(JSON.parse(storedMapping));
      this.setMapping(mapping);
    } catch (error) {
      this.deleteMapping();
    }
  }

  private setMapping(mapping: UUIDtoNumberMapping): void {
    this.mappingSubject$.next(mapping);
    localStorage.setItem('mapping', JSON.stringify(Array.from(mapping.entries())));
  }

  getNumericalId(id: string): string {
    const mapping = this.getMapping();
    if (mapping.has(id)) {
      return `${mapping.get(id)}`;
    }
    const numericalIds = Array.from(mapping.values());
    let numericalId = 1;
    while (numericalIds.includes(numericalId)) {
      numericalId++;
    }
    mapping.set(id, numericalId);
    this.setMapping(mapping);
    return `${numericalId}`;
  }

  getId(numericalId: string): string {
    const mapping = this.getMapping();
    const id = Array.from(mapping.keys()).find(id => `${mapping.get(id)}` === numericalId);
    return id;
  }

  deleteMapping(): void {
    this.setMapping(this.newMapping());
  }

  private getMapping(): UUIDtoNumberMapping {
    return this.mappingSubject$.getValue();
  }

  private newMapping(): UUIDtoNumberMapping {
    return new Map<string, number>();
  }
}

type UUIDtoNumberMapping = Map<string, number>;
