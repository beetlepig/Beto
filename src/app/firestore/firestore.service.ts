import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument, DocumentChangeAction,
  DocumentReference,
  QueryDocumentSnapshot
} from '@angular/fire/firestore';
import {map, take} from 'rxjs/operators';
import {Observable} from 'rxjs';


export interface IUser {
  password: string|null;
  user: string|null;
}

export interface IUserID extends IUser {
  id: string;
  password: string;
  user: string;
}

export interface IMessage {
  chat: SimpleMessage[] | null;
}

export interface IMailMessage {
  mail: string;
  message: string[];
}

export interface SimpleMessage {
  by: string;
  message: string;
}

export class MessageModel implements  IMessage {
  chat: SimpleMessage[] | null;
  constructor(_chat: SimpleMessage[]) {
    this.chat = _chat;
  }
}

export class LoggedUserModel implements  IUserID {
  id: string;
  password: string;
  user: string;
  constructor (_id: string, _password: string, _user: string) {
    this.id = _id;
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
}


@Injectable({
  providedIn: 'root'
})

export class FirestoreService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  private messagesCollection: AngularFirestoreCollection<IMessages>;
  private messagesMailCollection: AngularFirestoreCollection<IMailMessage>;
  private messageDoc: AngularFirestoreDocument<IMessage>;
  itemMessage: Observable<IMessage>;

  loggedUser: IUserID;

  constructor(private afs: AngularFirestore) {
    this.usersCollection = afs.collection<IUser>('usuarios');
    this.messagesCollection = afs.collection<IMessages>('mensajes');
    this.messagesMailCollection = afs.collection<IMailMessage>('mailMessages');
    this.loggedUser = null;
  }

  sendMessageWithMail(_mail: string, _message: string) {
    this.afs.collection('mailMessages', ref =>
      ref.where('mail', '==', _mail )).snapshotChanges().pipe(take(1)).subscribe((val: DocumentChangeAction<IMailMessage>[]) => {
        if (val.length === 0) {
          this.messagesMailCollection.add({mail: _mail, message: [_message]}).then((docRef: DocumentReference) => {
            //  console.log(value1);
          }).catch((reason: any) => {
            console.log(reason);
          });
        } else {
          const valSnapshot = val[0];
          const newMailMessagesArray = valSnapshot.payload.doc.data().message;
          newMailMessagesArray.push(_message);
          valSnapshot.payload.doc.ref.update({mail: _mail, message: newMailMessagesArray});
        }
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
          resolve(new LoggedUserModel(documentValues.id, documentValues.password, documentValues.user));
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
    return this.messageDoc.update({chat: arrayChat.chat});
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
      this.usersCollection.add({password: _password, user: _usuario}).then((value: DocumentReference) => {
        this.messagesCollection.doc(value.id).set({chat: [{by: 'admin', message: 'Cuentanos que sucede!'}]}).then((value1: void) => {
          //  console.log(value1);
          resolve('usuario creado');
        }).catch((reason: any) => {
          reject(reason);
        });
      }).catch((reason: any) => {
        reject(reason);
      });
    });
  }

  logout() {
    this.loggedUser = null;
    this.itemMessage = null;
    this.messageDoc = null;
  }


}


