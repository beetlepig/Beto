import { Component, OnInit } from '@angular/core';
import {FirestoreService, IMessage, MessageModel, SimpleMessage} from '../firestore/firestore.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {

  model = new MailForm('', '');
  modelUser = new UserForm('', '');
  section: string;
  inputMessageChat: string;
  messagesSubscription: Subscription;
  chatMessagesArray: SimpleMessage[];

  constructor(public fireService: FirestoreService) {
    this.section = 'MAIL';
    this.inputMessageChat = '';
  }

  ngOnInit() {

  }

  sendMessage() {
    this.fireService.sendMessageWithMail(this.model.mail, this.model.content);
    this.model = new MailForm('', '');
  }

  sendChatMessage() {
    this.chatMessagesArray.push({by: 'user', message: this.inputMessageChat});
    this.fireService.sendChatMessage(new MessageModel(this.chatMessagesArray)).then(() => {
      this.inputMessageChat = '';
    }).catch((error) => {
      console.error(error);
    });
  }

  loginUser(_model: UserForm) {
    const model = _model;
    this.fireService.verifyLoginUser(model.usuario, model.contrasena).then((userLogged) => {
      this.fireService.loggedUser = userLogged;
      this.getMessages();
    }).catch((error) => {
      console.error(error);
    });
  }

  createUser() {
    const model = {usuario: this.modelUser.usuario, contrasena: this.modelUser.contrasena};
    this.fireService.verifyUserExist(model.usuario).then(() => {
      this.fireService.createAccount(model.usuario, model.contrasena).then((ok: string) => {
        this.loginUser(model);
      }).catch((error) => {
        console.error(error);
      });
    }).catch((error) => {
      console.error(error);
    });
  }

  getMessages() {
    this.section = 'CHAT';
    this.fireService.getUserMessages();
    this.messagesSubscription = this.fireService.itemMessage.subscribe((value: IMessage) => {
      this.chatMessagesArray = value.chat;
    });
  }

  reset() {
    this.modelUser = new UserForm('', '');
    this.model = new MailForm('', '');
  }

  logout() {
    this.fireService.logout();
    this.section = 'MAIL';
    this.inputMessageChat = null;
    this.chatMessagesArray = null;
    this.messagesSubscription.unsubscribe();
  }

  onChangeSection(_section: string) {
    this.section = _section;
  }

  onKey(value: string) {
    this.inputMessageChat = value;
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
