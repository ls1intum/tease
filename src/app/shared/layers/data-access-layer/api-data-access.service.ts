import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError, forkJoin } from 'rxjs';
import { ajax } from 'rxjs/ajax'
import { catchError, retry } from 'rxjs/operators';

import { Person } from '../../models/person';
import { Team } from '../../models/team';

import { JSONBlobResponse } from '../business-logic-layer/team.service'

@Injectable()
export class APIDataAccessService {
  // TODO: set to actual URL from which PROMPT makes its endpoints available
  private static readonly PROMPT_API_BASE_URL = 'http://localhost:3000/v1';

  private static readonly STUDENTS_ROUTE = "students";
  private static readonly TEAMS_ROUTE = "teams";

  private static readonly BROWSER_STORAGE_KEY = 'TEASE-LOCAL-JSON-BLOB';

  constructor(private http: HttpClient) { }

  public readFromAPI(): Promise<JSONBlobResponse> {
    return forkJoin({
      students: ajax.getJSON(APIDataAccessService.PROMPT_API_BASE_URL + APIDataAccessService.STUDENTS_ROUTE),
      teams: ajax.getJSON(APIDataAccessService.PROMPT_API_BASE_URL + APIDataAccessService.TEAMS_ROUTE)
    }).toPromise();
  }

  public parseBrowserStorageData(): Promise<JSONBlobResponse> {
    return new Promise((resolve, reject) => {
      // TODO: parse the locally stored blob (string)
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
