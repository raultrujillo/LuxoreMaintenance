import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Property } from '@app/models/app.models';
import { Catalog, CatalogResponse, CityRequest } from '@app/models/catalog.model';
import { environment } from '@env/environment';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private baseUrl = environment.serverUrl;

  constructor(public http: HttpClient) {}

  getCatalog(calogType: string): Observable<Catalog[]> {
    return this.http.get<Catalog[]>(`${this.baseUrl}/catalogs/${calogType}`).pipe(
      map((response: Catalog[]) => {
        return response != null ? response : new Array<Catalog>();
      })
    );
  }

  GetCities(obj: any): Observable<CatalogResponse> {
    return this.http.post<CatalogResponse>(`${this.baseUrl}/catalogs/cities`, obj).pipe(
      map((response: CatalogResponse) => {
        return response != null ? response : new CatalogResponse();
      })
    );
  }

  addCity(obj: CityRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/catalogs/addCity`, obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  update(obj: CityRequest): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/catalogs/updateCity`, obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
