import { Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { defaultSettings } from '../../settings/default.settings';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InputFile } from '../../interfaces/input-file';
import { InputFileRejected } from '../../interfaces/input-file-rejected';
import { InputFileRejectedReason } from '../../enums/input-file-rejected-reason';
import { InputFileService } from '../../services/input-file.service';
import { MatButton } from '@angular/material/button';
import { urlValidator } from '../../validators/url.validator';
import { ImageDeleteModel, ImagesModel } from '@app/models/images.model';
import { PropertyService } from '@app/services/property-service';
import { first, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@app/@shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFileComponent),
      multi: true,
    },
  ],
})
export class InputFileComponent implements ControlValueAccessor, OnInit {
  static nextId = 0;
  private _classAnimation: string = '';
  private _fileAccept: string = '';
  private _fileLimit: number = 0;
  private _iconAdd: string = '';
  private _iconDelete: string = '';
  private _iconFile: string = '';
  private _iconLink: string = '';
  private _linkEnabled: boolean = false;
  private _placeholderLink: string = '';
  private _sizeLimit: number = 0;
  private _propertyId: number = 0;
  private _isMainImage: boolean = false;

  @Input() disabled: boolean = false;
  @Input() placeholder: string = '';

  @Input() set classAnimation(classAnimation: string) {
    this._classAnimation = classAnimation;
  }

  get classAnimation() {
    return this._classAnimation || this.inputFileService.config.classAnimation || defaultSettings.classAnimation;
  }

  @Input() set fileAccept(fileAccept: string) {
    this._fileAccept = fileAccept;
  }

  get fileAccept() {
    return this._fileAccept || this.inputFileService.config.fileAccept || defaultSettings.fileAccept;
  }

  @Input() set fileLimit(fileLimit: number) {
    this._fileLimit = fileLimit;
  }

  get fileLimit() {
    return this._fileLimit || this.inputFileService.config.fileLimit || defaultSettings.fileLimit;
  }

  @Input() set iconAdd(iconAdd: string) {
    this._iconAdd = iconAdd;
  }

  get iconAdd() {
    return this._iconAdd || this.inputFileService.config.iconAdd || defaultSettings.iconAdd;
  }

  @Input() set iconDelete(iconDelete: string) {
    this._iconDelete = iconDelete;
  }

  get iconDelete() {
    return this._iconDelete || this.inputFileService.config.iconDelete || defaultSettings.iconDelete;
  }

  @Input() set iconFile(iconFile: string) {
    this._iconFile = iconFile;
  }

  get iconFile() {
    return this._iconFile || this.inputFileService.config.iconFile || defaultSettings.iconFile;
  }

  @Input() set iconLink(iconLink: string) {
    this._iconLink = iconLink;
  }

  get iconLink() {
    return this._iconLink || this.inputFileService.config.iconLink || defaultSettings.iconLink;
  }

  @Input() set linkEnabled(linkEnabled: boolean) {
    this._linkEnabled = linkEnabled;
  }

  get linkEnabled() {
    return this._linkEnabled || this.inputFileService.config.linkEnabled || defaultSettings.linkEnabled;
  }

  @Input() set placeholderLink(placeholderLink: string) {
    this._placeholderLink = placeholderLink;
  }

  get placeholderLink() {
    return this._placeholderLink || this.inputFileService.config.placeholderLink || defaultSettings.placeholderLink;
  }

  @Input() set sizeLimit(sizeLimit: number) {
    this._sizeLimit = sizeLimit;
  }
  @Input() set propertyId(propertyId: number) {
    this._propertyId = propertyId;
  }

  @Input() set isMainImage(isMainImage: boolean) {
    this._isMainImage = isMainImage;
  }

  get sizeLimit() {
    return this._sizeLimit || this.inputFileService.config.sizeLimit || defaultSettings.sizeLimit || 0;
  }

  @Output() acceptedFile = new EventEmitter<InputFile>();
  @Output() deletedFile = new EventEmitter<InputFile>();
  @Output() rejectedFile = new EventEmitter<InputFileRejected>();
  @ViewChild('fileInput', { static: false }) fileInput?: ElementRef;

  public addLink?: boolean;
  public files = new Array<InputFile>();
  public form!: FormGroup;
  public id = `ngx-input-file-${InputFileComponent.nextId++}`;
  public onChange = (files: Array<InputFile>) => {};
  public onTouched = () => {};

  get canAddFile(): boolean {
    return this.files && this.files.length < this.fileLimit;
  }

  subscriptions = new Subscription();
  constructor(
    private formBuilder: FormBuilder,
    private inputFileService: InputFileService,
    private _PropertyService: PropertyService,
    private dialog: MatDialog
  ) {}

  /**
   * Angular lifecyle OnInit implementation.
   */
  public ngOnInit(): void {
    this.setForm();
  }

  //luxore
  public setImages(lstimagesLuxore: InputFile[]) {
    this.files = lstimagesLuxore;
  }

  public saveNewImage(image: InputFile) {
    var imageluxore = new ImagesModel(image.id, '', image.preview, this._isMainImage);
    this.subscriptions.add(
      this._PropertyService
        .updatImages(this._propertyId, imageluxore)
        .pipe(first())
        .subscribe({
          next: (res) => {
            console.log(res);
            this.files[this.files.length - 1].id = res.status;
            this.files[this.files.length - 1].imagePath = res.defaultMessage;
            this.files[this.files.length - 1].main = this._isMainImage;
          },
          error: (e) => {},
        })
    );
  }

  public updateImage(image: InputFile) {
    var imageluxore = new ImagesModel(image.id, image.imagePath, image.preview, this._isMainImage);
    this.subscriptions.add(
      this._PropertyService
        .updatImages(this._propertyId, imageluxore)
        .pipe(first())
        .subscribe({
          next: (res) => {
            console.log(res);
            this.files[this.files.length - 1].id = res.status;
            this.files[this.files.length - 1].imagePath = res.defaultMessage;
          },
          error: (e) => {},
        })
    );
  }

  public deleteImage(image: InputFile, index: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '30%',
      data: { title: 'Eliminar', message: '¿Está Seguro de eliminar la imagen?' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this._isMainImage) {
          this.subscriptions.add(
            this._PropertyService
              .deleteMainImage(this._propertyId)
              .pipe(first())
              .subscribe({
                next: (res) => {
                  console.log(res);
                  const files = this.files.slice();
                  files.splice(index, 1);
                  this.writeValue(files);
                },
                error: (e) => {},
              })
          );
        } else {
          var imageluxore = new ImageDeleteModel(image.id, image.imagePath);
          this.subscriptions.add(
            this._PropertyService
              .deleteImage(this._propertyId, imageluxore)
              .pipe(first())
              .subscribe({
                next: (res) => {
                  console.log(res);
                  const files = this.files.slice();
                  files.splice(index, 1);
                  this.writeValue(files);
                },
                error: (e) => {},
              })
          );
        }
      }
    });
  }

  //end luxore

  /**
   * On delete a file event handler.
   * @param index
   */
  public onDeleteFile(index: number): void {
    if (!this.disabled) {
      const files = this.files.slice();
      const file = files[index];
      this.deletedFile.emit(file);
      this.deleteImage(file, index);
    }
  }

  /**
   * On drag over event handler.
   * Adds a ripple effect on the button.
   */
  public onDragOver(button: MatButton): void {
    button.ripple.launch({ centered: true, persistent: true });
  }

  /**
   * On drag leave event handler.
   * Fades the ripple effect of the button.
   */
  public onDragLeave(button: MatButton): void {
    button.ripple.fadeOutAll();
  }

  /**
   * On adds a link.
   */
  public onLink(): void {
    this.addLink = !this.addLink;
  }

  /**
   * On replace one file event handler.
   * Writes the value.
   * @param fileList
   * @param index
   * @param fileInput
   */
  public onReplaceFile(fileList: any, index: number, button: MatButton, fileInput?: HTMLInputElement): void {
    if (!this.disabled) {
      // Copies the array without reference.
      const files = this.files.slice();
      // Assumes that a single file can be replaced by a single file.
      const inputFile: InputFile = { file: fileList.item(0)! };
      button.ripple.fadeOutAll();
      var oldImg = files[index];
      if (this.fileGuard(files, inputFile, true)) {
        files[index] = inputFile;
        this.acceptedFile.emit(inputFile);
        debugger;
        inputFile.imagePath = oldImg.imagePath;
        inputFile.id = oldImg.id;
        this.getPreview(inputFile, 2);
      }
      this.writeValue(files);
      if (fileInput) {
        fileInput.value = '';
      }
    }
  }

  /**
   * On select one or more files event handler.
   * Writes the value.
   * @param fileList
   */
  public onSelectFile(fileList: FileList, button: MatButton): void {
    if (!this.disabled) {
      button.ripple.fadeOutAll();
      // Copies the array without reference.
      const files = this.files.slice();
      debugger;
      Array.from(fileList).forEach((file) => {
        const inputFile: InputFile = { file };
        if (this.fileGuard(files, inputFile)) {
          files.push(inputFile);
          this.acceptedFile.emit(inputFile);
          this.getPreview(inputFile, 1);
        }
      });
      this.writeValue(files);
      this.fileInput!.nativeElement!.value = '';
    }
  }

  /**
   * On submit the link form event handler.
   */
  public onSubmitLink(): void {
    if (!this.disabled && this.form?.valid) {
      const files = this.files.slice();
      const inputFile: InputFile = { link: this.form.value.link, preview: this.form.value.link };
      files.push(inputFile);
      this.acceptedFile.emit(inputFile);
      this.onLink();
      this.form.reset();
      this.writeValue(files);
    }
  }

  /**
   * Implementation of ControlValueAccessor.
   * @param fn
   */
  public registerOnChange(fn: (files: Array<InputFile>) => void): void {
    this.onChange = fn;
  }

  /**
   * Implementation of ControlValueAccessor.
   * @param fn
   */
  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Implementation of ControlValueAccessor.
   * @param isDisabled
   */
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Implementation of ControlValueAccessor.
   * @param files
   */
  public writeValue(files: Array<InputFile>): void {
    if (!files) {
      files = new Array<InputFile>();
    }
    this.files = files;
    this.setFilePreview();
    this.onChange(this.files);
  }

  /**
   * Implementation of ControlValueAccessor.
   * @param files
   */
  public getPreview(file: InputFile, action: number) {
    const fr = new FileReader();
    fr.onload = () => {
      file.preview = fr.result!;
      if (action == 1)
        //insert
        this.saveNewImage(file);
      //
      else this.updateImage(file);
    };
    fr.readAsDataURL(file.file!);
  }

  /**
   * Whether the file can be added to the model.
   * @param files
   * @param file,
   * @param bypassLimit
   */
  private fileGuard(files: Array<InputFile>, file: InputFile, bypassLimit?: boolean): boolean {
    if (!bypassLimit && !this.inputFileService.limitGuard(files, this.fileLimit)) {
      this.rejectedFile.emit({ reason: InputFileRejectedReason.limitReached, file });
      return false;
    }

    if (!this.inputFileService.sizeGuard(file.file!, this.sizeLimit)) {
      this.rejectedFile.emit({ reason: InputFileRejectedReason.sizeReached, file });
      return false;
    }

    if (!this.inputFileService.typeGuard(file.file!, this.fileAccept)) {
      this.rejectedFile.emit({ reason: InputFileRejectedReason.badFile, file });
      return false;
    }

    return true;
  }

  /**
   * Sets the file preview with FileReader.
   */
  private setFilePreview(): void {
    for (const index in this.files) {
      if (this.files[index].file != null && this.inputFileService.typeGuard(this.files[index].file!, 'image/*')) {
        const fr = new FileReader();
        fr.onload = () => {
          this.files[index].preview = fr.result!;
        };
        fr.readAsDataURL(this.files[index].file!);
      }
    }
  }

  /**
   * Sets the reactive form to insert a link.
   */
  private setForm(): void {
    this.form = this.formBuilder.group({
      link: ['', [Validators.required, urlValidator]],
    });
  }
}
