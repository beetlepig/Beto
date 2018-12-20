import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FirestoreService, IMessages, IMessagesID, SimpleMessage} from '../firestore/firestore.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollMePapu') private elChatContainer: ElementRef;

  model = new MailForm('', '');
  modelUser = new UserForm('', '');
  section: string;
  inputMessageChat: string;
  messagesSubscription: Subscription;
  chatDoc: IMessagesID;

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
    if (this.inputMessageChat !== '') {
      this.chatDoc.chat.push({by: 'user', message: this.inputMessageChat});
      this.fireService.sendChatMessage({id: this.chatDoc.id, user: this.fireService.loggedUser.user, chat: this.chatDoc.chat}).then(() => {
        this.inputMessageChat = '';
      }).catch((error) => {
        console.error(error);
      });
    }
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
    this.messagesSubscription = this.fireService.itemMessage.subscribe((value: IMessagesID) => {
      this.chatDoc = value;
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
    this.chatDoc = null;
    this.messagesSubscription.unsubscribe();
  }

  onChangeSection(_section: string) {
    this.section = _section;
  }

  onKey(value: string) {
    this.inputMessageChat = value;
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.elChatContainer.nativeElement.scrollTop = this.elChatContainer.nativeElement.scrollHeight;
    } catch (err) {

    }
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
