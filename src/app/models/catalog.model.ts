export class Catalog {
  constructor(
    public id: number = 0,
    public description: string = '',
    public idState: number = 0,
    public idCity: number = 0,
    public postalCode: string = ''
  ) {}
}

export class CatalogResponse {
  constructor(public total: number = 0, public list: Catalog[] = new Array<Catalog>()) {}
}

export class CityRequest {
  constructor(
    public id: number = 0,
    public description: string = '',
    public idState: number = 0,
    public totalPage: number = 0,
    public page: number = 0
  ) {}
}

export class ColonyRequest {
  constructor(
    public id: number = 0,
    public description: string = '',
    public totalPage: number = 0,
    public page: number = 0,
    public idCity: number = 0,
    public postalCode: string = ''
  ) {}
}

export class PropertyTypeRequest {
  constructor(public id: number = 0, public description: string = '') {}
}
