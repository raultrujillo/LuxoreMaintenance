import { Catalog } from './catalog.model';
import { Cities } from './cities.model';
import { States } from './states.model';

export class PropertyRequest {
  constructor(
    public idCategory: number = 0,
    public wildCard: string = '',
    public totalPage: number = 0,
    public page: number = 0
  ) {}
}

export class PropertyResponse {
  constructor(public total: number = 0, public list: Property[] = new Array<Property>()) {}
}

export class Property {
  constructor(
    public id: number = 0,
    public price: number = 0,
    public title: string = '',
    public description: string = '',
    public addres: string = '',
    public garage: boolean = false,
    public carsNumber: number = 0,
    public rooms: number = 0,
    public bedrooms: number = 0,
    public bathrooms: string = '0',
    public postedYear?: Date,
    public metersSurface: string = '0',
    public metersBuilded: string = '0',
    public featuredProperty: boolean = false,
    public updateOn?: Date,
    public zip: string = '',
    public floors: number = 0,
    public features: string = '',
    public enable: boolean = false,
    public latitude: string = '',
    public longitude: string = '',
    public pageAddress: string = '',
    public comercialValue: number = 0,
    public notes: string = '',
    public credit: string = '',
    public sold: boolean = false,
    public slugTitle: string = '',
    public idPropertyType: Catalog = new Catalog(),
    public idCity: Cities = new Cities(),
    public idState: States = new States(),
    public idColony: Catalog = new Catalog(),
    public idCategory: Catalog = new Catalog(),
    public amenities: Catalog[] = new Array<Catalog>()
  ) {}
}
