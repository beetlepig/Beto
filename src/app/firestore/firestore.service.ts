import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference} from '@angular/fire/firestore';
import {map, take} from 'rxjs/operators';
import {Observable} from 'rxjs';


export interface IUser {
  mail: string|null;
  password: string|null;
  user: string|null;
}

export interface IUserID extends IUser {
  id: string;
  mail: string|null;
  password: string|null;
  user: string|null;
}

export interface IMessage {
  chat: SimpleMessage[] | null;
  toMailMessage: string | null;
}

export interface SimpleMessage {
  by: string;
  message: string;
}

export class MessageModel implements  IMessage {
  chat: SimpleMessage[] | null;
  toMailMessage: string | null;
  constructor(_chat: SimpleMessage[] | null, _toMailMessage: string | null) {
    this.chat = _chat;
    this.toMailMessage = _toMailMessage;
  }
}

export class LoggedUserModel implements  IUserID {
  id: string;
  mail: string | null;
  password: string | null;
  user: string | null;
  constructor (_id: string, _mail: string | null, _password: string | null, _user: string | null) {
    this.id = _id;
    this.mail = _mail;
    this.password = _password;
    this.user = _user;
  }
}

interface IChatAttributes {
  by: string;
  message: string;
}

export interface IMessages {
  chat: IChatAttributes[];
  toMailMessage: string;
}


@Injectable({
  providedIn: 'root'
})

export class FirestoreService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  private messagesCollection: AngularFirestoreCollection<IMessages>;
  messageDoc: AngularFirestoreDocument<IMessage>;
  itemMessage: Observable<IMessage>;

  loggedUser: IUserID;

  constructor(private afs: AngularFirestore) {
    this.usersCollection = afs.collection<IUser>('usuarios');
    this.messagesCollection = afs.collection<IMessages>('mensajes');
    this.loggedUser = null;
  }

  sendMessageWithMail(_mail: string, _message: string) {
    this.usersCollection.add({mail: _mail, password: null, user: null}).then((value: DocumentReference) => {
      this.messagesCollection.doc(value.id).set({chat: null, toMailMessage: _message}).then((value1: void) => {
      //  console.log(value1);
      }).catch((reason: any) => {
        console.log(reason);
      });
    }).catch((reason: any) => {
      console.log(reason);
    });
  }

  verifyLoginUser(_usuario: string, _password: string): Promise<IUserID> {
    return new Promise<IUserID>((resolve, reject) => {
      this.afs.collection('usuarios', ref =>
        ref.where('user', '==', _usuario ).where('password', '==', _password)).snapshotChanges().pipe(take(1),
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as IUser;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))).subscribe((val) => {
              if (val.length === 0) {
                reject('no user found');
              }
        val.forEach((documentValues: IUserID) => {
          resolve(new LoggedUserModel(documentValues.id, documentValues.mail, documentValues.password, documentValues.user));
        });
      }, (error) => {
          reject(error);
      }, () => {
        //  console.log('complete');
      });
    });
  }

  getUserMessages() {
   this.messageDoc = this.messagesCollection.doc(this.loggedUser.id);
   this.itemMessage = this.messageDoc.valueChanges();
  }

  sendChatMessage(arrayChat: IMessage): Promise<void> {
    return this.messageDoc.update({chat: arrayChat.chat, toMailMessage: arrayChat.toMailMessage});
  }

  verifyUserExist(_usuario: string) {
    return new Promise<string>((resolve, reject) => {
      this.afs.collection('usuarios', ref =>
        ref.where('user', '==', _usuario )).valueChanges().pipe(take(1)).subscribe((val) => {
          if (val.length === 0) {
            resolve('user available');
          } else {
            reject('user no available');
          }
      }, (error) => {
        reject(error);
      }, () => {
        //  console.log('complete');
      });
    });
  }

  createAccount(_usuario: string, _password: string) {
    return new Promise<string>((resolve, reject) => {
      this.usersCollection.add({mail: null, password: _password, user: _usuario}).then((value: DocumentReference) => {
        resolve('usuario creado');
      }).catch((reason: any) => {
        reject(reason);
      });
    });

  }


}


