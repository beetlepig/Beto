import { Injectable } from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ImagesProviderService {

  idleBase64: string;
  images: string[][] = [];

  constructor(private httpClient: HttpClient) { }

  async load() {
    this.images.push(await this.getImagesBase64(this.getImagesHttp(['/assets/SpriteSheet/EXTASIS/subida-extasis.png',
      '/assets/SpriteSheet/EXTASIS/viaje-extasis.png', '/assets/SpriteSheet/EXTASIS/bajada-extasis.png'])));
    this.images.push(await this.getImagesBase64(this.getImagesHttp(['/assets/SpriteSheet/LSD/LSD-subida.png',
      '/assets/SpriteSheet/LSD/LSD-viaje.png', '/assets/SpriteSheet/LSD/LSD-bajada.png'])));
    this.idleBase64 = (await this.getImagesBase64(this.getImagesHttp(['/assets/SpriteSheet/SOBER/idle.png'])))[0];
    /*
    this.extasisBase64 = await this.getImagesBase64(this.getImagesHttp(['/assets/SpriteSheet/EXTASIS/subida-extasis.png',
      '/assets/SpriteSheet/EXTASIS/viaje-extasis.png', '/assets/SpriteSheet/EXTASIS/bajada-extasis.png']));
    this.lSDBase64 = await this.getImagesBase64(this.getImagesHttp(['/assets/SpriteSheet/LSD/LSD-subida.png',
      '/assets/SpriteSheet/LSD/LSD-viaje.png', '/assets/SpriteSheet/LSD/LSD-bajada.png']));
      */
  }

  getImagesHttp(urls: string[]): Observable<Blob[]> {
   return forkJoin(urls.map((url: string) => {
      return this.getImage(url);
    }));
  }

  getImagesBase64(forkjoined: Observable<Blob[]>): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      forkjoined.subscribe((blobs: Blob[]) => {
        Promise.all(blobs.map((blob: Blob) => {
          return this.convertBlobToBase64(blob);
        })).then((images: string[]) => {
          resolve(images);
        });
      });
    });
  }

  getImage(imageUrl: string): Observable<Blob> {
    return this.httpClient.get(imageUrl, { responseType: 'blob' });
  }

  convertBlobToBase64 (blob: Blob): Promise<string> {
    return new Promise<string>(function (resolve, reject) {
      const reader: FileReader = new FileReader;
      reader.readAsDataURL(blob);
      reader.onerror = reject;
      reader.onloadend = function() {
        // console.log(reader.result);
        resolve(reader.result.toString());
      };
    });
  }

}
