import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CatalogResponse } from '@app/models/catalog.model';
import { PropertyResponse } from '@app/models/property.model';
import { environment } from '@env/environment';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private baseUrl = environment.serverUrl;

  constructor(public http: HttpClient) {}

  getProperties(obj: any): Observable<PropertyResponse> {
    return this.http.post<PropertyResponse>(`${this.baseUrl}/properties/`, obj).pipe(
      map((response: PropertyResponse) => {
        return response != null ? response : new PropertyResponse();
      })
    );
  }
}
