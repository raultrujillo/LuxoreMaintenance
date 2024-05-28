import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';

import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';

import { TranslateService } from '@ngx-translate/core';

import { Property } from '@app/models/app.models';
import { ComponentType } from '@angular/cdk/portal';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/@shared/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '@app/@shared/alert-dialog/alert-dialog.component';
import { DomHandlerService } from './dom-handler.service';

export class Data {
  constructor(
    public properties: Property[],
    public compareList: Property[],
    public favorites: Property[],
    public locations: Location[]
  ) {}
}

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public Data = new Data(
    [], // properties
    [], // compareList
    [], // favorites
    [] // locations
  );

  public url = environment.url + '/assets/data/';
  public apiKey = 'AIzaSyAO7Mg2Cs1qzo_3jkKkZAKY6jtwIlm41-I';

  constructor(
    public http: HttpClient,
    private bottomSheet: MatBottomSheet,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public translateService: TranslateService,
    private domHandlerService: DomHandlerService
  ) {}

  public getProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(this.url + 'properties.json');
  }

  public getPropertyById(id: string): Observable<Property> {
    return this.http.get<Property>(this.url + 'property-' + id + '.json');
  }

  public getFeaturedProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(this.url + 'featured-properties.json');
  }

  public getRelatedProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(this.url + 'related-properties.json');
  }

  public getPropertiesByAgentId(agentId: string): Observable<Property[]> {
    return this.http.get<Property[]>(this.url + 'properties-agentid-' + agentId + '.json');
  }

  public getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.url + 'locations.json');
  }

  public getAddress(lat = 40.714224, lng = -73.961452) {
    return this.http.get(
      'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=' + this.apiKey
    );
  }

  public getLatLng(address: string) {
    return this.http.get(
      'https://maps.googleapis.com/maps/api/geocode/json?key=' + this.apiKey + '&address=' + address
    );
  }

  public getFullAddress(lat = 40.714224, lng = -73.961452) {
    return this.http
      .get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=' + this.apiKey)
      .subscribe((data) => {
        return data['results'][0]['formatted_address'];
      });
  }

  public addToCompare(property: Property, component: ComponentType<unknown>, direction: any) {
    if (!this.Data.compareList.filter((item) => item.id == property.id)[0]) {
      this.Data.compareList.push(property);
      this.bottomSheet
        .open(component, {
          direction: direction,
        })
        .afterDismissed()
        .subscribe((isRedirect) => {
          if (isRedirect) {
            this.domHandlerService.winScroll(0, 0);
          }
        });
    }
  }

  public addToFavorites(property: Property, direction: any) {
    if (!this.Data.favorites.filter((item) => item.id == property.id)[0]) {
      this.Data.favorites.push(property);
      this.snackBar.open('The property "' + property.title + '" has been added to favorites.', '×', {
        verticalPosition: 'top',
        duration: 3000,
        direction: direction,
      });
    }
  }

  public openConfirmDialog(title: string, message: string) {
    const dialogData = new ConfirmDialogModel(title, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData,
    });
    return dialogRef;
  }

  public openAlertDialog(message: string) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      maxWidth: '400px',
      data: message,
    });
    return dialogRef;
  }

  public getTranslateValue(key: string, param: string | null = null) {
    let value: string | null = null;
    this.translateService.get(key, { param: param }).subscribe((res: string) => {
      value = res;
    });
    return value;
  }

  public getPropertyTypes() {
    return [
      { id: 1, name: 'Office' },
      { id: 2, name: 'House' },
      { id: 3, name: 'Apartment' },
    ];
  }

  public getPropertyStatuses() {
    return [
      { id: 1, name: 'For Sale' },
      { id: 2, name: 'For Rent' },
      { id: 3, name: 'Open House' },
      { id: 4, name: 'No Fees' },
      { id: 5, name: 'Hot Offer' },
      { id: 6, name: 'Sold' },
    ];
  }

  public getCities() {
    return [
      { id: 1, name: 'New York' },
      { id: 2, name: 'Chicago' },
      { id: 3, name: 'Los Angeles' },
      { id: 4, name: 'Seattle' },
    ];
  }

  public getNeighborhoods() {
    return [
      { id: 1, name: 'Astoria', cityId: 1 },
      { id: 2, name: 'Midtown', cityId: 1 },
      { id: 3, name: 'Chinatown', cityId: 1 },
      { id: 4, name: 'Austin', cityId: 2 },
      { id: 5, name: 'Englewood', cityId: 2 },
      { id: 6, name: 'Riverdale', cityId: 2 },
      { id: 7, name: 'Hollywood', cityId: 3 },
      { id: 8, name: 'Sherman Oaks', cityId: 3 },
      { id: 9, name: 'Highland Park', cityId: 3 },
      { id: 10, name: 'Belltown', cityId: 4 },
      { id: 11, name: 'Queen Anne', cityId: 4 },
      { id: 12, name: 'Green Lake', cityId: 4 },
    ];
  }

  public getStreets() {
    return [
      { id: 1, name: 'Astoria Street #1', cityId: 1, neighborhoodId: 1 },
      { id: 2, name: 'Astoria Street #2', cityId: 1, neighborhoodId: 1 },
      { id: 3, name: 'Midtown Street #1', cityId: 1, neighborhoodId: 2 },
      { id: 4, name: 'Midtown Street #2', cityId: 1, neighborhoodId: 2 },
      { id: 5, name: 'Chinatown Street #1', cityId: 1, neighborhoodId: 3 },
      { id: 6, name: 'Chinatown Street #2', cityId: 1, neighborhoodId: 3 },
      { id: 7, name: 'Austin Street #1', cityId: 2, neighborhoodId: 4 },
      { id: 8, name: 'Austin Street #2', cityId: 2, neighborhoodId: 4 },
      { id: 9, name: 'Englewood Street #1', cityId: 2, neighborhoodId: 5 },
      { id: 10, name: 'Englewood Street #2', cityId: 2, neighborhoodId: 5 },
      { id: 11, name: 'Riverdale Street #1', cityId: 2, neighborhoodId: 6 },
      { id: 12, name: 'Riverdale Street #2', cityId: 2, neighborhoodId: 6 },
      { id: 13, name: 'Hollywood Street #1', cityId: 3, neighborhoodId: 7 },
      { id: 14, name: 'Hollywood Street #2', cityId: 3, neighborhoodId: 7 },
      { id: 15, name: 'Sherman Oaks Street #1', cityId: 3, neighborhoodId: 8 },
      { id: 16, name: 'Sherman Oaks Street #2', cityId: 3, neighborhoodId: 8 },
      { id: 17, name: 'Highland Park Street #1', cityId: 3, neighborhoodId: 9 },
      { id: 18, name: 'Highland Park Street #2', cityId: 3, neighborhoodId: 9 },
      { id: 19, name: 'Belltown Street #1', cityId: 4, neighborhoodId: 10 },
      { id: 20, name: 'Belltown Street #2', cityId: 4, neighborhoodId: 10 },
      { id: 21, name: 'Queen Anne Street #1', cityId: 4, neighborhoodId: 11 },
      { id: 22, name: 'Queen Anne Street #2', cityId: 4, neighborhoodId: 11 },
      { id: 23, name: 'Green Lake Street #1', cityId: 4, neighborhoodId: 12 },
      { id: 24, name: 'Green Lake Street #2', cityId: 4, neighborhoodId: 12 },
    ];
  }

  public getFeatures() {
    return [
      { id: 1, name: 'Air Conditioning', selected: false },
      { id: 2, name: 'Barbeque', selected: false },
      { id: 3, name: 'Dryer', selected: false },
      { id: 4, name: 'Microwave', selected: false },
      { id: 5, name: 'Refrigerator', selected: false },
      { id: 6, name: 'TV Cable', selected: false },
      { id: 7, name: 'Sauna', selected: false },
      { id: 8, name: 'WiFi', selected: false },
      { id: 9, name: 'Fireplace', selected: false },
      { id: 10, name: 'Swimming Pool', selected: false },
      { id: 11, name: 'Gym', selected: false },
    ];
  }

  public getHomeCarouselSlides() {
    return this.http.get<any[]>(this.url + 'slides.json');
  }

  public filterData(data: any, params: any, sort?: any, page?: any, perPage?: any) {
    if (params) {
      if (params.propertyType) {
        data = data.filter((property: { propertyType: any }) => property.propertyType == params.propertyType.name);
      }

      if (params.propertyStatus && params.propertyStatus.length) {
        let statuses: any[] = [];
        params.propertyStatus.forEach((status: any) => {
          statuses.push(status.name);
        });
        let properties: any[] = [];
        data.filter((property: any) =>
          property.propertyStatus.forEach((status: any) => {
            if (statuses.indexOf(status) > -1) {
              if (!properties.includes(property)) {
                properties.push(property);
              }
            }
          })
        );
        data = properties;
      }

      if (params.city) {
        data = data.filter((property: { city: any }) => property.city == params.city.name);
      }

      if (params.zipCode) {
        data = data.filter((property: { zipCode: any }) => property.zipCode == params.zipCode);
      }

      if (params.neighborhood && params.neighborhood.length) {
        let neighborhoods: any[] = [];
        params.neighborhood.forEach((item: { name: any }) => {
          neighborhoods.push(item.name);
        });
        let properties: any[] = [];
        data.filter((property: any) =>
          property.neighborhood.forEach((item: any) => {
            if (neighborhoods.indexOf(item) > -1) {
              if (!properties.includes(property)) {
                properties.push(property);
              }
            }
          })
        );
        data = properties;
      }

      if (params.street && params.street.length) {
        let streets: any[] = [];
        params.street.forEach((item: { name: any }) => {
          streets.push(item.name);
        });
        let properties: any[] = [];
        data.filter((property: { street: any[] }) =>
          property.street.forEach((item: any) => {
            if (streets.indexOf(item) > -1) {
              if (!properties.includes(property)) {
                properties.push(property);
              }
            }
          })
        );
        data = properties;
      }

      if (params.bedrooms) {
        if (params.bedrooms.from) {
          data = data.filter((property: { bedrooms: number }) => property.bedrooms >= params.bedrooms.from);
        }
        if (params.bedrooms.to) {
          data = data.filter((property: { bedrooms: number }) => property.bedrooms <= params.bedrooms.to);
        }
      }

      if (params.bathrooms) {
        if (params.bathrooms.from) {
          data = data.filter((property: { bathrooms: number }) => property.bathrooms >= params.bathrooms.from);
        }
        if (params.bathrooms.to) {
          data = data.filter((property: { bathrooms: number }) => property.bathrooms <= params.bathrooms.to);
        }
      }

      if (params.garages) {
        if (params.garages.from) {
          data = data.filter((property: { garages: number }) => property.garages >= params.garages.from);
        }
        if (params.garages.to) {
          data = data.filter((property: { garages: number }) => property.garages <= params.garages.to);
        }
      }

      if (params.area) {
        if (params.area.from) {
          data = data.filter((property: { area: { value: number } }) => property.area.value >= params.area.from);
        }
        if (params.area.to) {
          data = data.filter((property: { area: { value: number } }) => property.area.value <= params.area.to);
        }
      }

      if (params.yearBuilt) {
        if (params.yearBuilt.from) {
          data = data.filter((property: { yearBuilt: number }) => property.yearBuilt >= params.yearBuilt.from);
        }
        if (params.yearBuilt.to) {
          data = data.filter((property: { yearBuilt: number }) => property.yearBuilt <= params.yearBuilt.to);
        }
      }

      if (params.features) {
        let arr: any[] = [];
        params.features.forEach((feature: { selected: any; name: any }) => {
          if (feature.selected) arr.push(feature.name);
        });
        if (arr.length > 0) {
          let properties: any[] = [];
          data.filter((property: { features: any[] }) =>
            property.features.forEach((feature: any) => {
              if (arr.indexOf(feature) > -1) {
                if (!properties.includes(property)) {
                  properties.push(property);
                }
              }
            })
          );
          data = properties;
        }
      }
    }

    // console.log(data)

    //for show more properties mock data
    for (var index = 0; index < 2; index++) {
      data = data.concat(data);
    }

    this.sortData(sort, data);
    return this.paginator(data, page, perPage);
  }

  public sortData(sort: any, data: any[]) {
    if (sort) {
      switch (sort) {
        case 'Newest':
          data = data.sort((a: { published: string | number | Date }, b: { published: string | number | Date }) => {
            return <any>new Date(b.published) - <any>new Date(a.published);
          });
          break;
        case 'Oldest':
          data = data.sort((a: { published: string | number | Date }, b: { published: string | number | Date }) => {
            return <any>new Date(a.published) - <any>new Date(b.published);
          });
          break;
        case 'Popular':
          data = data.sort(
            (a: { ratingsValue: number; ratingsCount: number }, b: { ratingsValue: number; ratingsCount: number }) => {
              if (a.ratingsValue / a.ratingsCount < b.ratingsValue / b.ratingsCount) {
                return 1;
              }
              if (a.ratingsValue / a.ratingsCount > b.ratingsValue / b.ratingsCount) {
                return -1;
              }
              return 0;
            }
          );
          break;
        case 'Price (Low to High)':

        case 'Price (High to Low)':
          break;
        default:
          break;
      }
    }
    return data;
  }

  public paginator(items: string | any[], page: number, perPage: number) {
    var page = page || 1,
      perPage = perPage || 4,
      offset = (page - 1) * perPage,
      paginatedItems = items.slice(offset).slice(0, perPage),
      totalPages = Math.ceil(items.length / perPage);
    return {
      data: paginatedItems,
      pagination: {
        page: page,
        perPage: perPage,
        prePage: page - 1 ? page - 1 : null,
        nextPage: totalPages > page ? page + 1 : null,
        total: items.length,
        totalPages: totalPages,
      },
    };
  }

  public getTestimonials() {
    return [
      {
        text: 'Donec molestie turpis ut mollis efficitur. Nam fringilla libero vel dictum vulputate. In malesuada, ligula non ornare consequat, augue nibh luctus nisl, et lobortis justo ipsum nec velit. Praesent lacinia quam ut nulla gravida, at viverra libero euismod. Sed tincidunt tempus augue vitae malesuada. Vestibulum eu lectus nisi. Aliquam erat volutpat.',
        author: 'Mr. Adam Sandler',
        position: 'General Director',
        image: 'assets/images/profile/adam.jpg',
      },
      {
        text: 'Donec molestie turpis ut mollis efficitur. Nam fringilla libero vel dictum vulputate. In malesuada, ligula non ornare consequat, augue nibh luctus nisl, et lobortis justo ipsum nec velit. Praesent lacinia quam ut nulla gravida, at viverra libero euismod. Sed tincidunt tempus augue vitae malesuada. Vestibulum eu lectus nisi. Aliquam erat volutpat.',
        author: 'Ashley Ahlberg',
        position: 'Housewife',
        image: 'assets/images/profile/ashley.jpg',
      },
      {
        text: 'Donec molestie turpis ut mollis efficitur. Nam fringilla libero vel dictum vulputate. In malesuada, ligula non ornare consequat, augue nibh luctus nisl, et lobortis justo ipsum nec velit. Praesent lacinia quam ut nulla gravida, at viverra libero euismod. Sed tincidunt tempus augue vitae malesuada. Vestibulum eu lectus nisi. Aliquam erat volutpat.',
        author: 'Bruno Vespa',
        position: 'Blogger',
        image: 'assets/images/profile/bruno.jpg',
      },
      {
        text: 'Donec molestie turpis ut mollis efficitur. Nam fringilla libero vel dictum vulputate. In malesuada, ligula non ornare consequat, augue nibh luctus nisl, et lobortis justo ipsum nec velit. Praesent lacinia quam ut nulla gravida, at viverra libero euismod. Sed tincidunt tempus augue vitae malesuada. Vestibulum eu lectus nisi. Aliquam erat volutpat.',
        author: 'Mrs. Julia Aniston',
        position: 'Marketing Manager',
        image: 'assets/images/profile/julia.jpg',
      },
    ];
  }

  public getAgents() {
    return [
      {
        id: 1,
        fullName: 'Lusia Manuel',
        desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',
        organization: 'HouseKey',
        email: 'lusia.m@housekey.com',
        phone: '(224) 267-1346',
        social: {
          facebook: 'lusia',
          twitter: 'lusia',
          linkedin: 'lusia',
          instagram: 'lusia',
          website: 'https://lusia.manuel.com',
        },
        ratingsCount: 6,
        ratingsValue: 480,
        image: 'assets/images/agents/a-1.jpg',
      },
      {
        id: 2,
        fullName: 'Andy Warhol',
        desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',
        organization: 'HouseKey',
        email: 'andy.w@housekey.com',
        phone: '(212) 457-2308',
        social: {
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: '',
          website: 'https://andy.warhol.com',
        },
        ratingsCount: 4,
        ratingsValue: 400,
        image: 'assets/images/agents/a-2.jpg',
      },
      {
        id: 3,
        fullName: 'Tereza Stiles',
        desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',
        organization: 'HouseKey',
        email: 'tereza.s@housekey.com',
        phone: '(214) 617-2614',
        social: {
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: '',
          website: 'https://tereza.stiles.com',
        },
        ratingsCount: 4,
        ratingsValue: 380,
        image: 'assets/images/agents/a-3.jpg',
      },
      {
        id: 4,
        fullName: 'Michael Blair',
        desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',
        organization: 'HouseKey',
        email: 'michael.b@housekey.com',
        phone: '(267) 388-1637',
        social: {
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: '',
          website: 'https://michael.blair.com',
        },
        ratingsCount: 6,
        ratingsValue: 480,
        image: 'assets/images/agents/a-4.jpg',
      },
      {
        id: 5,
        fullName: 'Michelle Ormond',
        desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',
        organization: 'HouseKey',
        email: 'michelle.o@housekey.com',
        phone: '(267) 388-1637',
        social: {
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: '',
          website: 'https://michelle.ormond.com',
        },
        ratingsCount: 6,
        ratingsValue: 480,
        image: 'assets/images/agents/a-5.jpg',
      },
    ];
  }

  public getClients() {
    return [
      { name: 'aloha', image: 'assets/images/clients/aloha.png' },
      { name: 'dream', image: 'assets/images/clients/dream.png' },
      { name: 'congrats', image: 'assets/images/clients/congrats.png' },
      { name: 'best', image: 'assets/images/clients/best.png' },
      { name: 'original', image: 'assets/images/clients/original.png' },
      { name: 'retro', image: 'assets/images/clients/retro.png' },
      { name: 'king', image: 'assets/images/clients/king.png' },
      { name: 'love', image: 'assets/images/clients/love.png' },
      { name: 'the', image: 'assets/images/clients/the.png' },
      { name: 'easter', image: 'assets/images/clients/easter.png' },
      { name: 'with', image: 'assets/images/clients/with.png' },
      { name: 'special', image: 'assets/images/clients/special.png' },
      { name: 'bravo', image: 'assets/images/clients/bravo.png' },
    ];
  }
}
