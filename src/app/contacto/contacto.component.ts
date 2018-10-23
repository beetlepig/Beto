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
  registro: boolean;

  constructor(public fireService: FirestoreService) {
    this.section = false;
    this.registro = false;
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
      console.log(userLogged);
    }).catch((error) => {
      console.error(error);
    });
  }

  createUser() {
    this.fireService.verifyUserExist(this.modelUser.usuario).then(() => {
      this.fireService.createAccount(this.modelUser.usuario, this.modelUser.contrasena).then((ok: string) => {
        console.log(ok);
      }).catch((error) => {
        console.error(error);
      });
    }).catch((error) => {
      console.error(error);
    });
  }

  reset() {
    this.modelUser = new UserForm('', '');
  }

  logout() {
    this.fireService.loggedUser = null;
  }

  onChangeSection(_section: boolean) {
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
