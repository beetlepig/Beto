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

  cansancio: number;
  estado: string;





  messagesArray: any[] = [];

  optionAText: string | null;
  optionBText: string | null;
  optionCText: string | null;
  optionDText: string | null;

  private resolve: Function|null = null;
  clickPromise: Promise<string>|null = null;

 // TODO: HACER QUE LAS SECCIONES GENERALES TAMBIEN SIRVAN CON TO

  script = {
    0: {
      0: {message: 'Hola, Hay alguien?', delay: 5000, options: {a: {message: 'Quien es?', to: 1},
          b: {message: 'Aquí estoy', to: 2}, c: {message: 'Identifícate', to: 3}, d: {message: null} }, general: false, to: null
      },

      1: {message: 'Soy Beto, Me encontré tu numero en el tablero de la u', delay: 3000, options: false, general: false, to: 4},

      2: {message: 'Que bueno, Me dicen Beto. Entonces tenes los inciensos? me encontre tu numero en la u', delay: 3000,
         options: false, general: false, to: 4
      },

      3: {message: 'Tranquilo, soy Beto. Vos sos el de las ventas? me encontré tu numero en la u', delay: 3000, options: false,
        general: false, to: 4
      },

      4: {message: 'Donde se publican las ventas', delay: 3000, options: false, general: false, to: 5},

      5: {message: 'Decia que vendias inciensos', delay: 3000, options: {a: {message: 'Inciensos?', to: 6},
          b: {message: 'Yo no estoy vendiendo nada...', to: 7}, c: {message: 'Es una broma?', to: 8},
          d: {message: 'no recuerdo poner mi numero en alguna parte', to: 9}}, general: false, to: null
      },

      6: {message: 'Hombre, el spice', delay: 1000, options: {a: {message: 'Creo que te equivocaste de numero', to: 9},
          b: {message: 'Claro, yo te vendo', to: 10}, c: {message: 'No tengo idea de lo que hablas', to: 11},
          d: {message: null}, to: 9 }, general: false, to: 7
      },

      7: {message: 'Ah no? parecía enserio', delay: 1000, options: false, general: false, to: 10},

      8: {message: 'Eso me pregunto yo...', delay: 1000, options: false, general: false, to: 10},

      9: {message: 'Depronto fue algún socio tuyo, yo que se', delay: 4000, options: false, general: false, to: 10},

      10: {message: 'Pero si sabes de lo que hablo?', delay: 1000, options: {a: {message: 'Ni idea', to: 11},
          b: {message: 'Creo que si se', to: 13}, c: {message: null},
          d: {message: null }}, general: false, to: null
      },

      11: {message: 'El spice, vi en un grupo de Facebook que era como la nueva mota', delay: 3000, options: false, general: false, to: 12},

      12: {message: 'Pero creo que me equivoque de numero', delay: 3000, options: false, general: false, to: 18},

      13: {message: 'A ver..', delay: 1000, options: {a: {message: 'Purificación espiritual', to: 14},
          b: {message: 'Las velitas para la casa', to: 15}, c: {message: 'Vicio', to: 16},
          d: {message: 'me suena a algo que se fuma' }, general: false, to: null}, general: false, to: 15
      },

      14: {message: 'Pues también ayuda a eso, pero digamos que no es su campo principal', delay: 4000, options: false, general: false,
        to: 11
      },

      15: {message: 'Estas desubicado, hombre', delay: 4000, options: false, general: false,
        to: 11
      },

      16: {message: 'Claramente', delay: 4000, options: false, general: false,
        to: 11
      },

      17: {message: 'Eres un entendido del tema', delay: 4000, options: false, general: false,
        to: 11
      },

      18: {message: 'como sea, ya que encontré tu numero, ayúdame con algo', delay: 3000, options: false, general: true, to: null}
    },
    1: {
      0: {message: 'Le voy a comprar eso al contacto de Facebook', delay: 3000, options: false, general: false, to: 1},
      1: {message: 'Vos de casualidad sabes cuales con las diferencias con la mota de siempre?', delay: 4000, options: null, general: false,
        to: 2},
      2: {message: 'Es que no encuentro nada al respecto y me da pena preguntarle al tipo', delay: 2000,
          options: {a: {message: 'Pues a decir verdad yo tampoco lo se', to: 3},
          b: {message: 'Me han dicho que esa vaina es como mas suave', to: 4},
          c: {message: 'He leído que esa vaina es re impredecible', to: 5},
          d: {message: 'Me han dicho que es mas fuerte', to: 6},
          }, general: false, to: null
      },
      3: {message: 'Entonces tocará arriesgarse', delay: 3000, options: false, general: false, to: 7},
      4: {message: 'Noo que pereza, entonces voy a comprar mas', delay: 3000, options: false, general: false, to: 7},
      5: {message: 'Uy ya me metiste miedo', delay: 3000, options: false, general: false, to: 7},
      6: {message: 'Pues mejor cogerlo con cuidado', delay: 3000, options: false, general: false, to: 7},
      7: {message: 'Le voy a preguntar a ver, dame un momento', delay: 10000, options: false, general: false, to: 8},
      8: {message: 'El tipo de dice que es marihuana sintetica, pero que sabe mejor y que no es tan fuerte', delay: 3000, options: false,
           general: false, to: 9},
      9: {message: 'vos que decis?', delay: 10000, options: {a: {message: 'Vos verás', to: 10},
          b: {message: 'Tengo mi dudas', to: 11},
          c: {message: 'Dale, no se ve tan heavy', to: 12},
          d: {message: null},
         }, general: false, to: null},
      10: {message: 'Igual podes decirme lo que creas mejor', delay: 3000, options: false, general: false, to: 13},
      11: {message: 'Se ve que eres prudente, igual no siempre hay peligro', delay: 3000, options: false, general: false, to: 13},
      12: {message: 'Me gusta esa actitud', delay: 3000, options: false, general: false, to: 13},
      13: {message: 'Le dire entonces al tipo que me lo traiga a domicilio', delay: 3000, options: false, general: false, to: 14},
      14: {message: 'Te hablo cuando llegue', delay: 20000, options: false, general: true, to: null},
    },
    2: {
      0: {message: 'Ya llegó', delay: 2000, options: {a: {message: 'Tiene contraindicaciones?', to: 1},
          b: {message: 'como es?', to: 2},
          c: {message: 'Dice la composición?', to: 3},
          d: {message: null},
      }, general: true, to: null},
      1: {message: 'no, solo dice de que es más potente y se refieren como una "fake weed". Que raro', delay: 3000, options: false,
        general: false, to: 4},
      2: {message: 'El empaque es plástico y tiene impreso un diseño con el logo de la marca', delay: 3000, options: false,
        general: false, to: 4},
      3: {message: 'Negativo, no dice nada de eso', delay: 3000, options: false,
        general: false, to: 4},
      4: {message: 'Bueno, como sea. Llego el momento', delay: 3000, options: {a: {message: 'Momento para qué?', to: 5},
          b: {message: 'vas a quemar?', to: 5},
          c: {message: null},
          d: {message: null},
        },
        general: false, to: null},
      5: {message: 'pa quemar la weed, o lo que sea esto', delay: 3000, options: false,
        general: false, to: 4
      },

      6: {message: 'Depronto', delay: 3000, options: false,
        general: false, to: 4
      },

      7: {message: 'Ahora tengo una party y quiero llegar ready', delay: 3000, options: false,
        general: false, to: 4
      },

      8: {message: 'Me voy a alistar y ver si quemo de una vez', delay: 30000, options: false,
        general: false, to: 4
      },

    },
    4: {
      condictions:  [{condicion: 'cansancio', operator: '<=', valor: '20'}],
      0: {message: 'menos mal tome cafesito', delay: 2000, general: true, to: null}
    },

    5: {
      condictions: [{condicion: 'cansancio', operator: '>', valor: '20'}],
      0: {message: 'c duerme', delay: 3000, general: true, to: null}
    },

    6: {
      0: {message: 'finish', delay: 1000, general: true, to: null}
    }

  };

  constructor() {
    this.cansancio = 40;
    this.estado = '';
  }

  ngOnInit() {
    this.scriptGeneralLength = Object.keys(this.script).length;
    this.actualGeneralPosition = 0;
    this.subActualLength = Object.keys(this.script[this.actualGeneralPosition]).length;
    this.actualSubPosition = 0;

    setTimeout(() => {
      this.nextiMessage().subscribe((next) => {
        console.log('entroSubscribe');
      }, () => {

      }, () => {
        console.log('observable terminado');
      });
    }, 4000);

  }

  setSustancia(kind: string) {
    switch (kind) {
      case 'coffee':
        this.cansancio -= 10;
        break;
      case 'other':
        break;
    }
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
            const haveOptions =  this.script[this.actualGeneralPosition][this.actualSubPosition]['options'];
            const isGeneral: boolean =  this.script[this.actualGeneralPosition][this.actualSubPosition]['general'];
            const to = this.script[this.actualGeneralPosition][this.actualSubPosition]['to'];
            const condictions = this.script[this.actualGeneralPosition]['condictions'];
            let cumpleCondicion = true;
            console.log(this.script[this.actualGeneralPosition][this.actualSubPosition]['message']);


            if (condictions) {
              condictions.forEach((condiction) => {
                switch (condiction.operator) {
                  case '<=':
                    switch (condiction.condicion) {
                      case 'cansancio':
                        if  (this.cansancio <= condiction.valor) {
                          console.log('no está cansado');
                          cumpleCondicion = true;
                          this.messagesArray.push({message: this.script[this.actualGeneralPosition][this.actualSubPosition]['message'],
                            isBeto: true});
                        } else {
                          cumpleCondicion = false;
                        }
                      break;
                    }

                    break;

                  case '>':
                    switch (condiction.condicion) {
                      case 'cansancio':
                        if  (this.cansancio > condiction.valor) {
                          cumpleCondicion = true;
                          this.messagesArray.push({message: this.script[this.actualGeneralPosition][this.actualSubPosition]['message'],
                            isBeto: true});
                        } else {
                          cumpleCondicion = false;
                        }
                      break;
                    }
                  break;
                }

              });


            } else {
              this.messagesArray.push({message: this.script[this.actualGeneralPosition][this.actualSubPosition]['message'], isBeto: true});
            }

            if (isGeneral || !cumpleCondicion) {
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
                console.log(resolve);
                this.actualSubPosition  = haveOptions[resolve[1]]['to'];
                console.log(haveOptions);
                console.log('siguiente posicion:' + this.actualSubPosition);
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
            observer.complete();
          }
        };

        ejecutar();
    });
  }



}
