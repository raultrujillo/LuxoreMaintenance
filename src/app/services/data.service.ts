import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class DataService {
  private selectedValues: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(['Extra cheese', 'Mushroom']);
  selectedValues$: Observable<string[]> = this.selectedValues.asObservable();

  constructor() {}

  updateSelectedValue(updatedValues: string[]) {
    this.selectedValues.next(updatedValues);
  }
}
