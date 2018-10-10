import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-mini-menu',
  templateUrl: './mini-menu.component.html',
  styleUrls: ['./mini-menu.component.css'],
  animations: [
    trigger('slideAnimation', [
      state('0', style({
        width: 0
      })),
      state('1', style({
        width: '100%'
      })),
      transition('*=>0', animate('500ms cubic-bezier(.14,.62,.4,.9)')),
      transition('*=>1', animate('500ms cubic-bezier(.14,.62,.4,.9)'))
    ])
  ]
})
export class MiniMenuComponent implements OnInit {
  isHoverOne: boolean;
  isHoverTwo: boolean;

  constructor() {
    this.isHoverOne = false;
    this.isHoverTwo = false;
  }

  ngOnInit() {
  }

  onHoverTitle(id: number) {
    console.log('entro Hover');
    switch (id) {
      case 0:
        this.isHoverOne = true;
        break;
      case 1:
        this.isHoverTwo = true;
        break;
    }
  }

  onHoverOutTile(id: number) {
    console.log('salio Hover');
    switch (id) {
      case 0:
        this.isHoverOne = false;
        break;
      case 1:
        this.isHoverTwo = false;
        break;
    }
  }

}
