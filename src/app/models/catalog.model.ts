export class Catalog {
  constructor(public id: number = 0, public idFather: number = 0, public description: string = '') {}
}

export class CatalogResponse {
  constructor(public total: number = 0, public listCatalogs: Catalog[] = new Array<Catalog>()) {}
}
