import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Property } from '@app/models/app.models';
import { Catalog, CatalogResponse, CityRequest, ColonyRequest } from '@app/models/catalog.model';
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

  getCities(obj: any): Observable<CatalogResponse> {
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

  updateCity(obj: CityRequest): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/catalogs/updateCity`, obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  //colonies
  getColonies(obj: any): Observable<CatalogResponse> {
    return this.http.post<CatalogResponse>(`${this.baseUrl}/catalogs/colonies`, obj).pipe(
      map((response: CatalogResponse) => {
        return response != null ? response : new CatalogResponse();
      })
    );
  }

  addColony(obj: ColonyRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/catalogs/addColony`, obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateColony(obj: ColonyRequest): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/catalogs/updateColony`, obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
