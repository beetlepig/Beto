import { Component, OnInit } from '@angular/core';
import {FirestoreService} from '../firestore/firestore.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {

  model = new MailForm('', '');
  modelUser = new UserForm('', '');
  section: boolean;

  constructor(private fireService: FirestoreService) {
    this.section = false;
  }

  ngOnInit() {

  }

  sendMessage() {
    this.fireService.sendMessageWithMail(this.model.mail, this.model.content);
    this.model = new MailForm('', '');
  }

  loginUser() {
    this.fireService.verifyLoginUser(this.modelUser.usuario, this.modelUser.contrasena);
  }

  onChangeSection(_section: boolean) {
    this.section = _section;
  }


}


export class MailForm {
  constructor(
    public mail: string,
    public content: string) { }
}

export class UserForm {
  constructor(
    public usuario: string,
    public contrasena: string) { }
}
