import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from '@angular/fire/firestore';
import {take} from 'rxjs/operators';


export interface IUser {
  mail: string|null;
  password: string|null;
  user: string|null;
}

export class LoggedUserModel implements  IUser {
  mail: string | null;
  password: string | null;
  user: string | null;
  constructor (_mail: string | null, _password: string | null, _user: string | null) {
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

  loggedUser: IUser;

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

  verifyLoginUser(_usuario: string, _password: string): Promise<IUser> {
    return new Promise<IUser>((resolve, reject) => {
      this.afs.collection('usuarios', ref =>
        ref.where('user', '==', _usuario ).where('password', '==', _password)).valueChanges().pipe(take(1)).subscribe((val) => {
          if (val.length === 0) {
            reject('no user found');
          }
        val.forEach((documentValues: IUser) => {
          resolve(new LoggedUserModel(documentValues.mail, documentValues.password, documentValues.user));
        });
      }, (error) => {
          reject(error);
      }, () => {
        //  console.log('complete');
      });
    });
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


