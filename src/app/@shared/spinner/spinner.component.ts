import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '@app/services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements OnInit {
  constructor(public loader: SpinnerService) {}

  ngOnInit(): void {}
}
