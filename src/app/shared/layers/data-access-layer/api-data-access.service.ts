import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { Person } from '../../models/person';
import { Team } from '../../models/team';

@Injectable()
export class APIDataAccessService {
  private static readonly PROMPT_API_BASE_URL = 'http://localhost:3000';

  private static readonly STUDENTS_ROUTE = "students";
  private static readonly TEAMS_ROUTE = "teams";

  private static readonly BROWSER_STORAGE_KEY = 'TEASE-LOCAL-JSON-BLOB';

  constructor(private http: HttpClient) { }

  public readFromAPI(): Promise<any> {
    return new Promise((resolve, reject) => {
      // TODO: make http get requests to the API and turn them into a JSON blob
    });
  }

  public parseBrowserStorageData(): Promise<any> {
    return new Promise((resolve, reject) => {
      // TOOD: parse the locally stored blob (string)
    });
  }

  public saveToBrowserStorage(blob: any): Promise<boolean> {
    const result = JSON.stringify(blob);
    localStorage.setItem(APIDataAccessService.BROWSER_STORAGE_KEY, result);
    return Promise.resolve(true);
  }

  public getStoredDataFromBrowserStorage(): string {
    return localStorage.getItem(APIDataAccessService.BROWSER_STORAGE_KEY);
  }

  public clearStoredData() {
    localStorage.removeItem(APIDataAccessService.BROWSER_STORAGE_KEY);
  }
}
