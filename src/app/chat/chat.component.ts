import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollMePapu') private elChatContainer: ElementRef;

  scriptGeneralLength: number;
  subActualLength: number;
  actualGeneralPosition: number;
  actualSubPosition: number;

  cansancio: number;
  estado: string;

  showSpice: boolean;



  messagesArray: any[] = [];

  optionAText: string | null;
  optionBText: string | null;
  optionCText: string | null;
  optionDText: string | null;

  private resolve: Function|null = null;
  clickPromise: Promise<string>|null = null;

 // TODO: HACER QUE LAS SECCIONES GENERALES TAMBIÉN SIRVAN CON TO

  script = {
    0: {
      0: {message: 'Hola, Hay alguien?', delay: 5000, options: {a: {message: 'Quien es?', to: 1},
          b: {message: 'Aquí estoy', to: 2}, c: {message: 'Identifícate', to: 3}, d: {message: null} }, general: false, to: null
      },

      1: {message: 'Soy Alex, Me encontré tu numero en el tablero de la u', delay: 3000, options: false, general: false, to: 4},

      2: {message: 'Que bueno, Me dicen Alex. Entonces tenes los inciensos? me encontre tu numero en la u', delay: 3000,
         options: false, general: false, to: 4
      },

      3: {message: 'Tranquilo, soy Alex. Vos sos el del incienso? me encontré tu numero en la u', delay: 3000, options: false,
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

      11: {message: 'El spice, vi en un grupo de Facebook que era como la nueva mota. Hace rato tambien la vi en una tienda naturista y ' +
          'ya me dio curiosidad', delay: 3000, options: false, general: false, to: 12},

      12: {message: 'Pero creo que me equivoque de numero', delay: 3000, options: false, general: false, to: 18},

      13: {message: 'A ver..', delay: 1000, options: {a: {message: 'Purificación espiritual', to: 14},
          b: {message: 'Las velitas para la casa', to: 15}, c: {message: 'Vicio', to: 16},
          d: {message: 'me suena a algo que se fuma', to: 17 }, general: false, to: null}, general: false, to: 15
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
      4: {message: 'Noo que pereza, entonces tocará comprar más', delay: 3000, options: false, general: false, to: 7},
      5: {message: 'Uy ya me metiste miedo', delay: 3000, options: false, general: false, to: 7},
      6: {message: 'Pues mejor cogerlo con cuidado', delay: 3000, options: false, general: false, to: 7},
      7: {message: 'Le voy a preguntar a ver, dame un momento', delay: 10000, options: false, general: false, to: 8},
      8: {message: 'El tipo de dice que es marihuana sintetica, pero que sabe mejor, es una alternativa legal, mas segura y que no es ' +
          'tan fuerte', delay: 3000, options: false, general: false, to: 9},
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
      }, general: false, to: null},

      1: {message: 'no, solo dice "not for human consumption" y se refieren como una "fake weed". Que raro', delay: 3000, options: false,
        general: false, to: 2
      },

      2: {message: 'El empaque es plástico y tiene impreso un diseño con el logo de la marca que en este caso es Spice,' +
          'hasta le hacen marca para vender más, muchos cracks', delay: 3000, options: false,
        general: false, to: 4
      },

      3: {message: 'Negativo, no dice nada de eso. Solo dice en el empaque "not for human consumption"', delay: 3000, options: false,
        general: false, to: 2
      },

      4: {message: 'Bueno, como sea. Llego el momento', delay: 3000, options: {a: {message: 'Momento para qué?', to: 5},
          b: {message: 'vas a quemar?', to: 6},
          c: {message: null},
          d: {message: null},
        },
        general: false, to: null},
      5: {message: 'pa quemar la weed, o lo que sea esto', delay: 3000, options: false,
        general: false, to: 7
      },

      6: {message: 'Depronto', delay: 3000, options: false,
        general: false, to: 7
      },

      7: {message: 'Ahora tengo una party y quiero llegar ready', delay: 3000, options: false,
        general: false, to: 8
      },

      8: {message: 'Me voy a alistar y ver si quemo de una vez', delay: 30000, options: false,
        general: true, to: null
      },

    },
    3: {
      condictions:  [{condicion: 'estado', operator: '===', valor: ''}],
      0: {message: 'No alcanzo a quemar, igual lo voy a llevar a la party por si algo', delay: 2000, general: false, to: 1},
      1: {message: 'Un parcero me dijo que quiere probar', delay: 2000, options: {a: {message: 'Pinta bien, depronto le guste', to: 2},
          b: {message: 'pero eso ni es hierba de verdad', to: 3},
          c: {message: 'solo sea piadoso con el chino, no se pase de verga', to: 3},
          d: {message: 'que la primera fumada sea esa vaina? no me cuadra mucho', to: 3},
      }, general: false, to: null},

      2: {message: 'El man es temerario, seguro le gusta', delay: 2000,
         options: false, general: false, to: 6
      },

      3: {message: 'pero si igual son especias, es natural no? lo natural no cae mal', delay: 2000,
        options: false, general: false, to: 6
      },

      4: {message: 'jajaj le voy a dar lo normal, si el me pide más ahí vemos', delay: 2000,
        options: false, general: false, to: 6
      },

      5: {message: 'prefiero que la primera fumada sea hierba a otra vaina peligrosa', delay: 2000,
        options: false, general: false, to: 6
      },

      6: {message: 'Preparo mi nave y despego para allá, hablamos', delay: 15000,
        options: false, general: true, to: null
      }
    },

    4: {
      condictions:  [{condicion: 'estado', operator: '===', valor: ''}],
      0: {message: 'Qué más', delay: 2000,
        options: false, general: false, to: 1
      },
      1: {message: 'Hablamelo', delay: 2000, options: {a: {message: 'Como está la fiesta?', to: 2},
          b: {message: 'no te pillaron el paquete?', to: 3},
          c: {message: null},
          d: {message: null},
        },
        general: false, to: null
      },
      2 : {message: 'Excelente, apenas llegue pero promete', delay: 2000,
        options: false, general: false, to: 4
      },
      3 : {message: 'Para nada, como saque el material del sobre y lo puse en una bolsa, casi no se notaba', delay: 5000,
        options: false, general: false, to: 4
      },
      4 : {message: 'Ahí acabo de llegar Milton', delay: 5000,
        options: {
          a: {message: 'El socio que decias?', to: 5},
          b: {message: null},
          c: {message: null},
          d: {message: null}
        },
        general: false, to: null
      },
      5 : {message: 'No, Milton es el que compra el guaro', delay: 5000,
        options: {
          a: {message: 'Ese milton es una mala influencia', to: 6},
          b: {message: 'Entonces quien es el que decias?', to: 7},
          c: {message: null},
          d: {message: null}
        },
        general: false, to: null
      },
      6 : {message: 'Desde cuando gastar el guaro es ser mala influencia, de donde yo vengo es todo lo contrario', delay: 5000,
        options: {
          a: {message: 'Entonces quien es el que decias?', to: 7},
          b: {message: null},
          c: {message: null},
          d: {message: null}
        },
        general: false, to: null
      },
      7 : {message: 'Se llama Beto, lo conozco desde que eramos niños', delay: 5000,
        options: {
          a: {message: 'Y como es el?', to: 8},
          b: {message: 'Socios de toda la vida pues', to: 10},
          c: {message: 'Para conocerce de siempre, es raro que el nunca haya fumado', to: 11},
          d: {message: null}
          },
        general: false, to: null
      },
      8 : {message: 'Es bastante pro en el fornite, además es todo estudioso y casi no le gustan las rumbas.', delay: 3000,
        options: false, general: false, to: 9
      },
      9 : {message: 'Fue dificil convencerlo para que viniera', delay: 3000,
        options:
          {
            a: {message: 'Como lo suponia, son bastantes diferentes', to: 13},
            b: {message: null},
            c: {message: null},
            d: {message: null},
          },
        general: false, to: null
      },
      10 : {message: 'De siempre, aunque al man casi no le gusta salir conmigo', delay: 3000,
        options: {
          a: {message: 'Por qué, Alex?', to: 13},
          b: {message: null},
          c: {message: null},
          d: {message: null}
        },
        general: false, to: null
      },
      11 : {message: 'Es que casi no sale conmigo, normalmente se la pasa estudiando.', delay: 3000,
        options: {
          a: {message: 'Es lo contrario a vos', to: 12},
          b: {message: null},
          c: {message: null},
          d: {message: null},
        },
        general: false, to: null
      },
      12 : {message: 'jajaja yo tambien estudio, solo que me gusta salir.', delay: 3000,
        options: false, general: false, to: 13
      },
      13 : {message: 'Lo que pasa es que él ha estudiado casi toda su vida becado, ' +
          'no tiene mucha plata que digamos para pagar una matricula completa', delay: 3000,
        options: false, general: false, to: 14
      },
      14 : {message: 'Por eso perdio el habito de salir, no le queda tiempo', delay: 3000,
        options: false, general: false, to: 15
      },
      15 : {message: 'Hablando del rey de roma, adivina quien llegó', delay: 3000,
        options: {
          a: {message: 'La policia?', to: 16},
          b: {message: 'Beto?', to: 16},
          c: {message: null},
          d: {message: null},
        },
        general: false, to: null
      },
      16 : {message: 'No, llego el flaco, ese man pone la musica sabrosa', delay: 3000,
        options: {
            a: {message: '.-.', to: 17},
            b: {message: '(._.)', to: 17},
            c: {message: '(._. ) ( ._.)', to: 17},
            d: {message: '( ._.) (._. )', to: 17}
        },
        general: false, to: null
      },
      17 : {message: 'Te voy a decir algo', delay: 5000,
        options: false, general: false, to: 18
      },
      18 : {message: 'En realidad el no me dijo que queria fumar, le voy a decir que es otra cosa para pruebe', delay: 3000,
        options: false, general: false, to: 19
      },
      19 : {message: 'Ya es hora que se gradue no?', delay: 3000,
        options:
          {
            a: {message: 'Claro que no, el debe decidir por si mismo', to: 20},
            b: {message: 'Si, dale', to: 21},
            c: {message: 'Yo creo que le harias un favor, a ver si se relaja un poco del estudio', to: 22},
            d: {message: 'Si es con hierba, pues está bien creo yo', to: 23}
          },
        general: false, to: null
      },
      20 : {
        message: 'El va a decidir voluntariamente que quiere probar :)', delay: 6000,
        options: false, general: false, to: 24
      },
      21 : {
        message: 'Sisa, solo es para que se relaje, no es nada del otro mundo', delay: 6000,
        options: false, general: false, to: 24
      },
      22 : {
        message: 'Nada como un buen chirrete despues de un parcial', delay: 6000,
        options: false, general: false, to: 24
      },
      23 : {
        message: 'See, y este spice hasta huele a aromatica', delay: 6000,
        options: false, general: false, to: 24
      },
      24 : {
        message: 'Por fin llegó Beto, voy a hablar muy seriamente con el muchacho.', delay: 15000,
        options: false, general: false, to: 25
      },
      25 : {
        message: '', delay: 5000,
        options:
          {
            a: {message: 'Hola?', to: 26},
            b: {message: null},
            c: {message: null},
            d: {message: null},
          },
        general: false, to: null
      },
      26 : {
        message: 'Ayudame', delay: 9000,
        options: false, general: false, to: 27
      },
      27 : {
        message: 'Este man se puso mal', delay: 5000,
        options:
          {
            a: {message: 'Que tiene?', to: 28},
            b: {message: 'Llevalo al hospital', to: 30},
            c: {message: 'por lo que le diste?', to: 31},
            d: {message: null},
          }, general: false, to: null
      },
      28 : {
        message: 'Está muy alterado y sudando mucho', delay: 5000,
        options: false, general: false, to: 29
      },
      29 : {
        message: 'Me estoy asustando porque dice que le duele el corazon', delay: 5000,
        options: {
          a: {message: 'Llevalo al hospital', to: 30},
          b: {message: null},
          c: {message: null},
          d: {message: null},
        }, general: false, to: null
      },
      30 : {
        message: 'Está bien, pedire un taxi', delay: 5000,
        options: false, general: false, to: 32
      },
      31 : {
        message: 'Es lo mas seguro, fue justo despues de que fumara', delay: 5000,
        options: {
          a: {message: 'Que tiene?', to: 28},
          b: {message: 'Llevalo al hospital', to: 30},
          c: {message: null},
          d: {message: null},
        }, general: false, to: null
      },
      32 : {
        message: 'Ya llego el taxi, hablamos cuando llegue al hospital', delay: 12000,
        options: false, general: true, to: null
      },
    },
    5: {
      condictions:  [{condicion: 'estado', operator: '===', valor: ''}],
      0: {message: 'Beto llego inconsciente, ya lo están revisando', delay: 2000,
        options: {
          a: {message: 'Pero que pasó exactamente?', to: 1},
          b: {message: null},
          c: {message: null},
          d: {message: null},
        }, general: false, to: null
      },
      1: {message: 'Preparé el spice y se lo ofrecí a beto para que fuera el primero en fumar', delay: 2000,
        options: false, general: false, to: 2
      },
      2: {message: 'Después de convencerlo, se fumo como medio Blunt y fue cuando se empezó a poner raro', delay: 2000,
        options: false, general: false, to: 3
      },
      3: {message: 'Empezó a decir que por que estaba ahi, que por que no lo dejaban ir, se puso un poco agresivo', delay: 2000,
        options: false, general: false, to: 4
      },
      4: {message: 'Hasta ese momento no me preocupe mucho, porque sabia que para algunos es ' +
          'normal que no les caiga bien la mota', delay: 2000,
        options: false, general: false, to: 5
      },
      5: {message: 'Pero luego empezó a gritar, sudar y decir que le dolía el corazón, ahi fue cuando te hablé', delay: 2000,
        options: false, general: false, to: 6
      },
      6: {message: 'Y luego en el taxi se desmayó', delay: 2000,
        options: {
          a: {message: 'Es la primera vez que ves also así?', to: 7},
          b: {message: 'No decías que ese spice era seguro?', to: 8},
          c: {message: 'Es tu culpa, ruega que no se muera', to: 10},
          d: {message: null},
        }, general: false, to: null
      },
      7: {message: 'La primera vez. Tras que no es normal un mal viaje así, que además ' +
          'le duela el corazón y se ponga a sudar así, me preocupó', delay: 2000,
        options: false, general: false, to: 8
      },
      8: {message: 'Esa vaina que me vendieron, dios sabe que era, para nada es hierba', delay: 2000,
        options: false, general: false, to: 9
      },
      9: {message: 'Ese man que me la vendió me dijo dizque era super parecida, que más segura y dizque legal', delay: 2000, // Cambiar to
        options: false, general: false, to: 12
      },
      10: {message: 'No me digas eso, no lo hice a propósito, vos sabes', delay: 2000,
        options: false, general: false, to: 11
      },
      11: {message: 'Yo me deje convencer del man ese', delay: 2000,
        options: false, general: false, to: 8
      },
      12: {message: 'Esperemos que beto despierte, cuando me digan algo te escribo', delay: 2000,
        options: {
          a: {message: 'Esperemos que no sea algo grave', to: 13},
          b: {message: 'Terminaras en prisión', to: 14},
          c: {message: null},
          d: {message: null},
        }, general: false, to: 8
      },
      13: {message: 'Eso mismo, ahora hablamos', delay: 15000,
        options: false, general: true, to: null
      },
      14: {message: 'WTF, ahora hablamos', delay: 15000,
        options: false, general: true, to: null
      }
    },
    6: {
      condictions:  [{condicion: 'estado', operator: '===', valor: ''}],
      0: {message: 'Hola?', delay: 15000,
        options: {
          a: {message: 'Te escucho', to: 1},
          b: {message: null},
          c: {message: null},
          d: {message: null},
        }, general: false, to: null
      },
      1: {message: 'Ya hable con el medico', delay: 5000,
        options: {
          a: {message: 'Y que dice', to: 2},
          b: {message: 'Como está Beto?', to: 3}, // cambiar to
          c: {message: null},
          d: {message: null},
        }, general: false, to: null
      },
      2: {message: 'Me toco darle el resto del spice que tenia para identificara de que se trataba', delay: 5000,
        options: {
          a: {message: 'Al fin que era?', to: 3},
          b: {message: 'Adivino, era algún alucinógeno del Amazonas', to: 7},
          c: {message: null},
          d: {message: null},
        }, general: false, to: null
      },
      3: {message: 'Literalmente era marihuana sintética, solo que lo único natural eran los pedazos de matas, que no hacían ' +
          'nada en si', delay: 5000,
        options: false, general: false, to: 4
      },
      4: {message: 'Me dijo que lo psicoactivo eran una o varias sustancias que rociaban a las especias trituradas', delay: 5000,
        options: false, general: false, to: 5
      },
      5: {message: 'Que esta sustancia es sintética, es nueva y muy poco documentada, por lo que aun no está declarada ilegal', delay: 5000,
        options: {
          a: {message: 'Men, eso no suena nada bien', to: 6},
          b: {message: 'Entonces ya saben lo que tiene beto?', to: 8},
          c: {message: null},
          d: {message: null},
        }, general: false, to: null
      },
      6: {message: 'Para nada, por ahora Beto se está recuperando', delay: 5000,
        options: false, general: false, to: 10
      },
      7: {message: 'Para saber de donde viene eso, lo que si era es literalmente marihuana sintética, ' +
          'solo que lo único natural eran los pedazos de matas, que no hacían nada en si', delay: 5000,
        options: false, general: false, to: 4
      },
      8: {message: 'Exactamente no se sabe, está intoxicado por este spice', delay: 5000,
        options: false, general: false, to: 10
      },
      9: {message: 'Sigue inconsciente, pero ya se estabilizo', delay: 5000,
        options: {
          a: {message: 'Al fin que era el tal spice?', to: 3},
          b: {message: null},
          c: {message: null},
          d: {message: null},
        }, general: false, to: null
      },
      10: {message: 'Si pasa algo más de hablo', delay: 5000,
        options: {
          a: {message: 'ok', to: 11},
          b: {message: null},
          c: {message: null},
          d: {message: null},
        }, general: false, to: null
      },
      11: {message: '', delay: 15000,
        options: false, general: true, to: null
      }
    },
    7: {
      condictions:  [{condicion: 'estado', operator: '===', valor: ''}],
      0: {message: 'Podes creer que beto tenia problemas de corazón?', delay: 2000,
        options: {
          a: {message: 'Por eso se puso así?', to: 1},
          b: {message: 'Acaso fue un infarto?', to: 2},
          c: {message: null},
          d: {message: null},
        }, general: false, to: null
      },
      1: {message: 'En parte, parece que el compuesto del spice aumenta la presión arterial de forma significativa', delay: 2000,
        options: false, general: false, to: 4
      },
      2: {message: 'Noooo!!, pero estuvo cerca', delay: 2000,
        options: false, general: false, to: 3
      },
      3: {message: 'parece que el compuesto del spice aumenta la presión arterial de forma significativa, además ' +
          'de provocar efectos psicóticos', delay: 2000,
        options: false, general: false, to: 4
      },
      4: {message: 'y presión arterial alta, mas problemas de corazón no hacen buena combinación', delay: 2000,
        options: {
          a: {message: 'Estuviste a punto de acabar en prisión', to: 5},
          b: {message: 'No te han dicho nada más de esa droga?', to: 7},
          c: {message: null},
          d: {message: null},
        }, general: false, to: null
      },
      5: {message: 'Te llevo a vos conmigo por cómplice', delay: 2000,
        options: {
          a: {message: 'Mentiras, calma', to: 6},
          b: {message: ':c No te han dicho nada más de esa droga?', to: 7},
          c: {message: null},
          d: {message: null},
        }, general: false, to: null
      },
      6: {message: 'Mentiras, no tuviste nada que ver. En cuanto a esa droga...', delay: 2000,
        options: false, general: false, to: 7
      },
      7: {message: 'Al parecer han habido bastantes casos similares', delay: 2000,
        options: false, general: false, to: 8
      },
      8: {message: 'La droga intenta replicar lo que hace el THC, que es el compuesto activo de la marihuana', delay: 2000,
        options: false, general: false, to: 9
      },
      9: {message: 'Pero al tratarse de componentes sintéticos tiene un efecto potencialmente superior y nocivo', delay: 2000,
        options: false, general: false, to: 10
      },
      10: {message: 'Las sustancias que le rocían a eso cambian cada cierto tiempo, a veces contiene plomo y así', delay: 2000,
        options: false, general: false, to: 11
      },
      11: {message: 'En esta ola de afectados, parece que el spice tenia fentanil, esa vaina es ' +
          'hasta 50 veces mas fuerte que la heroína', delay: 2000,
        options: false, general: false, to: 12
      },
      12: {message: 'Consumir eso es como jugarse una lotería', delay: 2000,
        options: {
          a: {message: 'Entonces a tu amigo le dio una sobredosis por fumarse medio porro?', to: 13},
          b: {message: null},
          c: {message: null},
          d: {message: null},
        }, general: false, to: null
      },
      13: {message: 'Técnicamente, si. El medico también me dijo que algunos lotes vienen ' +
          'con más concentración de sustancia, que no es algo bien medido', delay: 2000,
        options: false, general: false, to: 14
      },
      14: {message: 'Ya sabemos para la próxima', delay: 2000,
        options: {
          a: {message: 'Si :(', to: 15},
          b: {message: null},
          c: {message: null},
          d: {message: null},
        }, general: false, to: null
      },
      15: {message: '', delay: 2000,
        options: false, general: true, to: null
      }
    },
    8: {
      condictions: [{condicion: 'estado', operator: '===', valor: 'spice'}],
      0: {message: 'listo, al fin quemé', delay: 3000, options: {a: {message: 'y que tal?', to: 1},
          b: {message: 'te sientes bien?', to: 2},
          c: {message: 'eso si es mota?', to: 3},
          d: {message: null},
        }, general: false, to: null},
      1: {message: 'Si es mas fuerte que la hierba normal, no se por que me dijo que no', delay: 3000, options: false,
        general: false, to: 4
      },
      2: {message: 'uff super bien, ya estoy ready para la party', delay: 3000, options: false,
        general: false, to: 5
      },
      3: {message: 'no sabe como a mota, parece mas bien una mezcla de diferentes hierbas', delay: 3000, options: false,
        general: false, to: 6
      },
      4: {message: 'y el sabor si es mejor, es como una combinación de diferentes hierbas', delay: 3000, options: false,
        general: false, to: 8
      },
      5: {message: 'Aunque si es mas fuerte que la hierba normal, no se por que el dealer me dijo que no', delay: 3000, options: false,
        general: false, to: 7
      },
      6: {message: 'y también es mas fuerte que la hierba normal, no se por que el dealer me dijo lo contrario', delay: 3000,
        options: false,
        general: false, to: 8
      },
      7: {message: 'a parte que no sabe como a mota, parece mas bien una mezcla de diferentes hierbas', delay: 3000,
        options: false,
        general: false, to: 8
      },
      8: {message: 'Está potente', delay: 3000,
        options: {
          a: {message: 'a vos te cayó mal eso', to: 9},
          b: {message: 'no exageraste no?', to: 10},
          c: {message: null},
          d: {message: null},
        },
        general: false, to: 8
      },
      9: {message: 'no para nada, solo está un poco fuerte y ya', delay: 3000,
        options: false,
        general: false, to: 11
      },
      10: {message: 'pues yo fumé lo de siempre, no se si este habia que medirlo', delay: 3000,
        options: false,
        general: false, to: 12
      },
      11: {message: 'y fumé la cantidad de siempre', delay: 3000,
        options: false,
        general: false, to: 12
      },
      12: {message: 'en breves me embarco en mi nave, depronto hablemos mas tarde nuevo amigo', delay: 30000,
        options: false,
        general: true, to: 12
      }
    },
    9: {
      0: {message: 'finish', delay: 1000, general: true, to: null}
    }
  };

  constructor() {
    this.cansancio = 40;
    this.estado = '';
    this.showSpice = false;
  }

  ngOnInit() {
    this.scriptGeneralLength = Object.keys(this.script).length;
    this.actualGeneralPosition = 0;
    this.subActualLength = Object.keys(this.script[this.actualGeneralPosition]).length;
    this.actualSubPosition = 0;

    setTimeout(() => {
      this.nextiMessage().subscribe((next) => {
        console.log('entroSubscribe');
        if (this.actualGeneralPosition === 2) {
         // this.showSpice = true;
        } else {
          this.showSpice = false;
        }
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
      case 'spice':
        this.estado = 'spice';
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

                  case '===':

                    switch (condiction.condicion) {
                      case 'estado':
                        if  (this.estado === condiction.valor) {
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
