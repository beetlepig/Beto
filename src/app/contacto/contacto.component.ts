import { Component, OnInit } from '@angular/core';
import {FirestoreService} from '../firestore/firestore.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {

  model = new MailForm('', '');

  constructor(private fireService: FirestoreService) { }

  ngOnInit() {

  }

  sendMessage() {
    this.fireService.sendMessageWithMail(this.model.mail, this.model.content);
    this.model = new MailForm('', '');
  }


}


export class MailForm {
  constructor(
    public mail: string,
    public content: string) { }
}
