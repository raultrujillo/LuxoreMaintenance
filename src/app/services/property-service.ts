import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CatalogResponse } from '@app/models/catalog.model';
import { Property, PropertyResponse } from '@app/models/property.model';
import { ResponseModel } from '@app/models/response.model';
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

  addProperty(obj: Property): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.baseUrl}/properties/add`, obj).pipe(
      map((response: ResponseModel) => {
        return response != null ? response : new ResponseModel();
      })
    );
  }
  updateProperty(obj: Property): Observable<ResponseModel> {
    return this.http.put<ResponseModel>(`${this.baseUrl}/properties/update`, obj).pipe(
      map((response: ResponseModel) => {
        return response != null ? response : new ResponseModel();
      })
    );
  }

  getPropertyById(id: number): Observable<Property> {
    return this.http.get<Property>(`${this.baseUrl}/properties/${id}`).pipe(
      map((response: Property) => {
        return response != null ? response : new Property();
      })
    );
  }
}
