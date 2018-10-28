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
  section: string;

  constructor(public fireService: FirestoreService) {
    this.section = 'MAIL';
  }

  ngOnInit() {

  }

  sendMessage() {
    this.fireService.sendMessageWithMail(this.model.mail, this.model.content);
    this.model = new MailForm('', '');
  }

  loginUser() {
    this.fireService.verifyLoginUser(this.modelUser.usuario, this.modelUser.contrasena).then((userLogged) => {
      this.fireService.loggedUser = userLogged;
      this.getMessages();
    }).catch((error) => {
      console.error(error);
    });
  }

  createUser() {
    this.fireService.verifyUserExist(this.modelUser.usuario).then(() => {
      this.fireService.createAccount(this.modelUser.usuario, this.modelUser.contrasena).then((ok: string) => {
        this.loginUser();
      }).catch((error) => {
        console.error(error);
      });
    }).catch((error) => {
      console.error(error);
    });
  }

  getMessages() {
    this.section = 'CHAT';
  }

  reset() {
    this.modelUser = new UserForm('', '');
  }

  logout() {
    this.fireService.loggedUser = null;
    this.section = 'MAIL';
  }

  onChangeSection(_section: string) {
    this.section = _section;
  }


}


export class MailForm {
  constructor(
    public mail: string,
    public content: string) {
  }
}

export class UserForm {
  constructor(
    public usuario: string,
    public contrasena: string) {
  }
}
