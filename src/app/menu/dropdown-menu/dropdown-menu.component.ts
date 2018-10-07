import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.css'],
  animations: [
    trigger('heightAnimation', [
      state('0', style({
        height: '100%'
      })),
      state('1', style({
        height: 0
      })),
      transition('*=>0', animate('1000ms cubic-bezier(.19,.61,.43,.86)')),
      transition('*=>1', animate('1000ms cubic-bezier(.80,.01,.46,.89)'))
    ]),
    trigger('opacityAnimation', [
      state('0', style({
        opacity: 1
      })),
      state('1', style({
        opacity: 0
      })),
      transition('*=>0', animate('500ms 400ms ease-in-out')),
      transition('*=>1', animate('500ms ease-in-out'))
    ])
  ]
})
export class DropdownMenuComponent implements OnInit {
  @Input() show: boolean;
  @Output() clickInLink: EventEmitter<boolean>;

  constructor() {
    this.show = true;
    this.clickInLink = new EventEmitter<boolean>();
  }

  ngOnInit() {
  }

  onClickRouterLink() {
    this.clickInLink.emit(true);
  }

}
