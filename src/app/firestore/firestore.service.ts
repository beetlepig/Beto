import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from '@angular/fire/firestore';


export interface IUser {
  mail: string|null;
  password: string|null;
  user: string|null;
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

  constructor(private afs: AngularFirestore) {
    this.usersCollection = afs.collection<IUser>('usuarios');
    this.messagesCollection = afs.collection<IMessages>('mensajes');
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

  verifyLoginUser(_usuario: string, __password: string) {
    console.log(this.usersCollection.ref.where('size', '==', _usuario).where('size', '==', __password));
  }
}


