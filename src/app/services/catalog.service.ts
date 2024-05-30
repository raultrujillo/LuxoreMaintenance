import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Property } from '@app/models/app.models';
import { Catalog, CatalogResponse } from '@app/models/catalog.model';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  public url = environment.url + '/src/assets/data/';
  constructor(public http: HttpClient) {}
  public getCatalog(): Observable<CatalogResponse> {
    return this.http.get<CatalogResponse>(this.url + 'cities.json');
  }
}
