import { Injectable } from '@angular/core';

@Injectable()
export class ImagesProviderService {

  constructor() { }

  load() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    });
  }
}
