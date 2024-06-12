export class ImagesModel {
  constructor(
    public id: number = 0,
    public imagePath: string = '',
    public file?: string | ArrayBuffer,
    public main: boolean = true
  ) {}
}

export class ImageDeleteModel {
  constructor(public id: number = 0, public imagePath: string = '') {}
}
