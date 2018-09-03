import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  scriptGeneralLength: number;
  subActualLength: number;
  actualGeneralPosition: number;
  actualSubPosition: number;





  messagesArray: any[] = [];

  optionAText: string | null;
  optionBText: string | null;
  optionCText: string | null;
  optionDText: string | null;

  private resolve: Function|null = null;
  clickPromise: Promise<string>|null = null;



  script = {
    0: {
      0: {message: 'hola amigazo', delay: 3000, options: false, general: false, to: 1},
      1: {message: 'como estas', delay: 5000, options: {a: {message: 'bien amigo', to: 2},
          b: {message: 'mal amigo', to: 3}, c: {message: null}, d: {message: null} }, general: false, to: null},
      2: {message: 'que bien', delay: 3000, options: false, general: true, to: null},
      3: {message: 'y eso?', delay: 3000, options: {a: {message: 'el clima', to : 4}, b : {message: 'La humedad', to: 5},
          c: {message: 'Llegue tarde a juridico', to: 6}, d: {message: null}}, general: false},
      4: {message: 'que calor tan bravo no?', delay: 1000, options: false, general: true, to: null},
      5: {message: 'esta humedad me da gripa', delay: 1000, options: false, general: true, to: null},
      6: {message: 'pues si se levanto faltando 30', delay: 1000, options: false, general: true, to: null}
    },
    1: {
      0: {message: 'bye socio', delay: 1000, options: false, general: true, to: null}
    }

  };

  constructor() {

  }

  ngOnInit() {
    this.scriptGeneralLength = Object.keys(this.script).length;
    this.actualGeneralPosition = 0;
    this.subActualLength = Object.keys(this.script[this.actualGeneralPosition]).length;
    this.actualSubPosition = 0;

   this.nextiMessage().subscribe(next => {
     console.log('entroSubscribe');
   });


  }

  reset(tex: string[]) {
    this.optionAText = tex[0];
    this.optionBText = tex[1];
    this.optionCText = tex[2];
    this.optionDText = tex[3];
    this.clickPromise = new Promise<string>((resolve, reject) => { this.resolve = resolve; });
  }

  clicked(pickedOption: string, key: string) {
    if (this.resolve !== null && this.resolve !== undefined && pickedOption !== null) {
      this.resolve  = this.resolve([pickedOption, key]);
    }

  }

  nextiMessage(): Observable<void> {

    return new Observable(observer => {
        const ejecutar = () => {
          if (this.actualGeneralPosition < this.scriptGeneralLength) {
            console.log(this.actualSubPosition);
            const delay = this.script[this.actualGeneralPosition][this.actualSubPosition]['delay'];
            this.messagesArray.push({message: this.script[this.actualGeneralPosition][this.actualSubPosition]['message'], isBeto: true});
            const haveOptions =  this.script[this.actualGeneralPosition][this.actualSubPosition]['options'];
            const isGeneral: boolean =  this.script[this.actualGeneralPosition][this.actualSubPosition]['general'];
            const to = this.script[this.actualGeneralPosition][this.actualSubPosition]['to'];
            console.log(this.script[this.actualGeneralPosition][this.actualSubPosition]['message']);

            if (isGeneral) {
              this.actualGeneralPosition++;
              this.actualSubPosition = 0;

              setTimeout(() => {
                observer.next();
                ejecutar();
              }, delay);

            } else if (!haveOptions && to) {
              this.actualSubPosition = to;

              setTimeout(() => {
                observer.next();
                ejecutar();
              }, delay);

            } else if (haveOptions) {
              const opcionesTextos: string[] = [];
              for (let i = 0; i < 4; i ++) {
                switch (i) {
                  case 0:
                    opcionesTextos.push(haveOptions['a']['message']);
                    break;
                  case 1:
                    opcionesTextos.push(haveOptions['b']['message']);
                    break;
                  case 2:
                    opcionesTextos.push(haveOptions['c']['message']);
                    break;
                  case 3:
                    opcionesTextos.push(haveOptions['d']['message']);
                    break;
                }
              }
              this.reset(opcionesTextos);
              this.clickPromise.then((resolve) => {
                console.log(resolve[0]);
                this.actualSubPosition  = haveOptions[resolve[1]]['to'];
                this.messagesArray.push({message: resolve[0], isBeto: false});
                this.optionAText = null;
                this.optionBText = null;
                this.optionCText = null;
                this.optionDText = null;

                setTimeout(() => {
                  observer.next();
                  ejecutar();
                }, delay);
              });
            }


          } else {
            console.log('finished');
          }
        };

        ejecutar();
    });
  }



}
