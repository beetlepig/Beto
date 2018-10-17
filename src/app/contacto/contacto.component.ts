import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {

  model = new MailForm('', '');

  constructor() { }

  ngOnInit() {

  }

  sendMessage() {
    this.model = new MailForm('', '');
  }


}


export class MailForm {
  constructor(
    public mail: string,
    public content: string) { }
}
