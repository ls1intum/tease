import { Injectable } from '@angular/core';
import { SelectData } from '../matching/constraints/constraint-functions/constraint-function';

@Injectable({
  providedIn: 'root',
})
export class SelectDataService {
  getSelectedIds(selectData: SelectData[]): string[] {
    return selectData.filter(element => element.selected).map(element => element.id);
  }
}
