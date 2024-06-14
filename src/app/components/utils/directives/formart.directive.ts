import { formatNumber } from '@angular/common';
import {
  Directive,
  AfterViewInit,
  Input,
  HostBinding,
  HostListener,
  Inject,
  LOCALE_ID,
  ElementRef,
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[formatNumber]',
})
export class FormatNumberDirective implements AfterViewInit {
  mask: string = '.2-2';
  @Input('formatNumber') set _(value: string) {
    this.mask = value || '.2-2';
  }
  //this is to align to right
  @HostBinding('style.text-align') style = 'right';

  //listen when (blur)
  @HostListener('blur')
  onBlur() {
    this.parse();
  }

  //listen when focus
  @HostListener('focus', ['$event.target'])
  onFocus(target: any) {
    target.value = this.control?.control?.value || '';
  }

  //the "el.nativeElement" is the "input"
  //the control.control is the "control" (or NgModel or FormControl)

  //we inject the "LOCALE_ID". This can be "hardcode" in provider or
  //get the value when use Angular localize

  constructor(@Inject(LOCALE_ID) private locale: string, private el: ElementRef, private control: NgControl) {}

  //at very first stage we can also that the value is showed "formatted"
  ngAfterViewInit() {
    setTimeout(() => {
      this.parse();
    });
  }
  parse() {
    this.el.nativeElement.value = this.control?.control?.value
      ? formatNumber(this.control?.control?.value, this.locale, this.mask)
      : '';
  }
}
