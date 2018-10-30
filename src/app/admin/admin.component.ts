import { Component, OnInit } from '@angular/core';
import {FirestoreService, IMailMessage, IMessagesID, IUser} from '../firestore/firestore.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  model: AdminUser;
  mailsSubscription: Subscription;
  chatsSubscription: Subscription;
  allMails: IMailMessage[];
  allchats: IMessagesID[];
  selectedMail: IMailMessage;
  selectedChat: IMessagesID;
  inputMessageChat: string;

  constructor(public fireService: FirestoreService) {
    this.model = new AdminUser('', '');
  }

  ngOnInit() {
  }

  adminLogin(_model: AdminUser) {
    const model = _model;
    this.fireService.verifyLoginAdmin(model.usuario, model.contrasena).then((adminLogged: IUser) => {
      this.fireService.loggedAdmin = adminLogged;
      this.getMailMessages();
      this.getChatsMessages();
    }).catch((error) => {
      console.error(error);
    });
  }

  sendChatMessage() {
    this.selectedChat.chat.push({by: 'admin', message: this.inputMessageChat});
    this.fireService.sendChatMessage({id: this.selectedChat.id, user: this.fireService.loggedAdmin.user,
      chat: this.selectedChat.chat}).then(() => {
      this.inputMessageChat = '';
    }).catch((error) => {
      console.error(error);
    });
  }

  private getMailMessages() {
    this.fireService.getMailMessages();
    this.mailsSubscription = this.fireService.allMails.subscribe((mails: IMailMessage[]) => {
      this.allMails = mails;
    });
  }

  private getChatsMessages() {
    this.fireService.getAllUserMessages();
    this.chatsSubscription = this.fireService.allChats.subscribe( (chats: IMessagesID[]) => {
      this.allchats = chats;
    });
  }

  onKey(value: string) {
    this.inputMessageChat = value;
  }

}


export class AdminUser {
  constructor(
    public usuario: string,
    public contrasena: string) {
  }
}
