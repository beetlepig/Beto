import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-alex-logo',
  templateUrl: './alex-logo.component.html',
  styleUrls: ['./alex-logo.component.css']
})
export class AlexLogoComponent implements OnInit {

  @Input() _fontSize: string;

  constructor() {

  }

  ngOnInit() {
    if (null == this._fontSize) {
      throw new Error('Attribute "FontSize" is required');
    }
  }
}
