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
    public title: string = '',
    public enabled: boolean = true,
    public sold: boolean = false,
    public postedYear: Date = new Date(),
    price: number = 0
  ) {}
}
