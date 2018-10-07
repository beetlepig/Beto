import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  showDropDownMenu: boolean;

  constructor() {
    this.showDropDownMenu = true;
  }

  ngOnInit() {
  }

  menuClick() {
    this.showDropDownMenu = !this.showDropDownMenu;
    console.log('entro');
  }

}
