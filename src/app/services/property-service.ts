import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Property } from '@app/models/app.models';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  public url = environment.url + '/src/assets/data/';
  constructor(public http: HttpClient) {}
  public getProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(this.url + 'properties.json');
  }
}
