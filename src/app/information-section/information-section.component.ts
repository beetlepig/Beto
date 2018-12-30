import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {createSketch, Ip5WithCustomAtributes} from './sketch.p5';
import * as p5 from 'p5';
import {animate, state, style, transition, trigger, AnimationEvent} from '@angular/animations';
import createSketchModal from './sketch-modal-button.p5';

@Component({
  selector: 'app-information-section',
  templateUrl: './information-section.component.html',
  styleUrls: ['./information-section.component.css'],
  animations: [
    trigger('transformAnimation', [
      state('0', style({
        transform: 'translateY(90vh)'
      })),
      state('1', style({
        transform: 'translateY(0)'
      })),
      transition('*=>0', animate('500ms cubic-bezier(.19,.61,.43,.86)')),
      transition('*=>1', animate('500ms cubic-bezier(.80,.01,.46,.89)'))
    ]),
    trigger('opacityAnimation', [
      state('1', style({
        opacity: 1
      })),
      state('0', style({
        opacity: 0,
        display: 'none'
      })),
      transition('*=>0', animate('1000ms')),
      transition('*=>1', animate('1000ms'))
    ])
  ]
})
export class InformationSectionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('AnimatedCharacter') myCharacter: ElementRef;
  @ViewChild('p5CanvasContainer') containerSketch: ElementRef;
  @ViewChild('p5CanvasContainerModal') containerSketchModal: ElementRef;
  sustancia = [
    new SubstanceObjectModel('EXTASIS',
      [
        new SubstancePresentationModel('CAPSULA', '/assets/substancesImg/EXTASIS/capsula.svg', 3),
        new SubstancePresentationModel('CRISTAL', '/assets/substancesImg/EXTASIS/cristal.svg', 4),
        new SubstancePresentationModel('POLVO', '/assets/substancesImg/EXTASIS/polvo.svg', 5)
      ],
      new CompleteInfoModel(['X', 'MDMA', 'TACHAS', 'PILLS'], [
             {topic: 'DESCRIPCIÓN', info: 'Su nombre científico es 3,4-metilendioximetanfetamina y pertenece a la familia de las ' +
                 'fenetilaminas. Se conoce como MDMA, pepas, pills, tachas o cristal. Se puede adquirir en forma de comprimido o de cristal, ' +
                 'aunque también polvo o cápsulas.<br><br>La variabilidad de la concentración y composición del éxtasis, según dicte la ' +
                 'oferta y coyuntura del mercado, implica un riesgo debido a las dificultades de anticipar o controlar la dosis adecuada. No ' +
                 'obstante, el consumo requiere su aumento gradual para conseguir los mismos efectos. No genera dependencia física demostrada ' +
                 'pero sí psicológica.'},
             {topic: 'EFECTOS PRINCIPALES', info: 'Después de ingerirla sus efectos pueden tardar entre 20 y 90 minutos en manifestarse ' +
                 'y por lo general se dividen en tres fases:<br><br><strong>Subida:</strong> desaparece el cansancio, euforia, ganas de ' +
                 'bailar o realizar alguna actividad física.<br><br><strong>Mantenimiento:</strong> intensificación de las sensaciones ' +
                 'emocionales, cercanía, confianza y empatía hacia las demás personas. En esta fase el efecto puede durar entre 2 a 3 ' +
                 'horas, incluso suele durar unas 4 – 6 horas, siempre dependiendo de la dosis administrada y usuaria/o. Cuando se ' +
                 'consume una dosis suplementaria, los efectos suelen prolongarse durante un par de horas más y pueden mantenerse con ' +
                 'dosis sucesivas, que generalmente no afectan la intensidad de la experiencia, pero sí la alargan, a la vez que ' +
                 'incrementan los efectos secundarios.<br><br><strong>Bajada:</strong> los efectos van desapareciendo dando paso a un ' +
                 'cansancio físico y mental, mientras se experimenta bajón en el estado de ánimo.'},
             {topic: 'EFECTOS SECUNDARIOS', info: 'Pueden aparecer pérdida de apetito, distorsiones visuales, movimientos oculares ' +
                 'involuntarios, incremento de la tasa cardiaca y de la presión arterial (al elevar la dosis), nerviosismo, cambios en ' +
                 'la regulación de la temperatura corporal, vómitos, ansiedad, sudoración, mareos, confusión, boca seca, tensión ' +
                 'mandibular (broxismo), dificultades de concentración, midriasis (dilatación de las pupilas).'},
             {topic: 'RIESGOS ASOCIADOS', info: 'La <strong>combinación</strong> con alcohol provoca aumento en la temperatura corporal ' +
                 'y deshidratación, puede producir un “golpe de calor” ocasionando desmayos y náuseas. Con cocaína aumenta la presión ' +
                 'arterial y el sistema nervioso provocando efectos no deseados.<br><br><strong>Hipertermia</strong> (golpe de calor, ' +
                 'elevación importante de la temperatura corporal). Más probable en ambientes cerrados, cuando se realiza una intensa ' +
                 'actividad física (por ejemplo, bailar durante muchas horas) y cuando la persona usuaria no se hidrata ' +
                 'convenientemente. Para evitar estas complicaciones se recomienda realizar pausas en el baile y reponer líquidos ' +
                 '(agua, zumos, o preferentemente, bebidas isotónicas con moderación, sin excederse, aproximadamente medio litro cada ' +
                 'hora si se realiza una actividad física intensa y menos si se está en reposo).<br><br><strong>Hipotermia</strong> ' +
                 '(disminución considerable de la temperatura corporal). Dependiendo del ambiente donde esté la persona usuaria.' +
                 '<br><br>El éxtasis o MDMA produce elevaciones en la frecuencia cardiaca y en la presión arterial. Por tanto, personas ' +
                 'con problemas cardíacos o de hipertensión deberán tener precaución en su consumo.<br><br>Dosis altas y frecuentes ' +
                 'de éxtasis o MDMA pueden derivar en pérdidas de memoria y alteraciones del estado de ánimo.<br><br>El aumento de las ' +
                 'dosis en una noche genera ansiedad, nerviosismo, mareos, tensión mandibular y depresión.'},
             {topic: 'DATOS CURIOSOS', info: 'En 1912 la compañía Merck aisló accidentalmente la MDMA (3,4-metilendioximetanfetamina). ' +
                 'Al no encontrarle un aplicación médica concreta, los laboratorios abandonaron su investigación. No obstante, entre ' +
                 '1953 y 1954 el ejército estadounidense retomó las pesquisas. Aunque los primeros datos biológicos sobre las mismas ' +
                 'se publicaron hasta 1973, no fue sino durante la década de los 80 cuando personajes como el químico estadounidense ' +
                 'Alexander Shulguin la trajeron de nuevo a la luz pública. Según sus propias palabras: “Rescaté esta sustancia por ' +
                 'sugerencia de un amigo. La probé y escribí mucho sobre ella en las revistas médicas. Descubrí que tenía notables ' +
                 'beneficios terapéuticos. En su momento representó la aparición de una nueva familia de agentes que permiten al ' +
                 'individuo expresar y experimentar contenidos afectivos reprimidos por las barreras culturales”.  El MDMA alcanzó gran ' +
                 'popularidad entre la cultura underground californiana y la clientela de los clubes nocturnos. Los vendedores, en una ' +
                 'acción de marketing, la rebautizaron con el nombre de éxtasis. En 1985, el gobierno estadounidense declaró esta ' +
                 'sustancia ilegal, a pesar de que numerosos científicos argumentamos sobre sus propiedades para hacer aflorar ' +
                 'pensamientos y recuerdos reprimidos.'
             }]
      ),
      'characterAnimateRun'
    ),
    new SubstanceObjectModel('LSD',
      [
        new SubstancePresentationModel('PAPELITO', '/assets/substancesImg/LSD/papelito.svg', 5),
        new SubstancePresentationModel('CUBOS DE AZUCAR', '/assets/substancesImg/LSD/cubos_de_azucar.svg', 3),
        new SubstancePresentationModel('MICROPUNTOS', '/assets/substancesImg/LSD/micropuntos.svg', 4)
      ],
      'characterAnimateJump',
      new CompleteInfoModel(['ÁCIDOS', 'CARTONES', 'PAPELITOS', 'TRIPIS', 'CUADROS'],
        [{topic: 'DESCRIPCIÓN', info: 'Dietilamida del ácido Lisérgico o LSD-25 sintetizada en 1938 en los laboratorios de la ' +
            'compañía farmacéutica Sandoz por el químico suizo Albert Hofmann, en el transcurso de un programa de  investigación de los ' +
            'alcaloides del hongo cornezuelo del centeno.<br><br>En su forma pura es incolora, inodora y levemente amarga. Suele ' +
            'administrarse por vía oral, generalmente absorbida en papel secante, cubo de azúcar o pequeños comprimidos conocidos como ' +
            'micropuntos. El LSD es una sustancia muy sensible, degradable fácilmente en contacto con luz, calor, aire y humedad.'},
          {topic: 'COMPOSICIÓN', info: 'Su fórmula es C15H15N2CON(C2H5)2. Fue sintetizado por primera vez en 1938 y en 1943 el químico ' +
              'suizo Albert Hofmann descubrió sus efectos por accidente durante la recristalización de una muestra de tartrato de LSD. ' +
              'El número 25 (LSD-25) alude al orden que el científico iba dando a los compuestos que sintetizaba.'},
          {topic: 'EFECTOS SECUNDARIOS', info: 'Pueden aparecer pérdida de apetito, distorsiones visuales, movimientos oculares ' +
              'involuntarios, incremento de la tasa cardiaca y de la presión arterial (al elevar la dosis), nerviosismo, cambios en ' +
              'la regulación de la temperatura corporal, vómitos, ansiedad, sudoración, mareos, confusión, boca seca, tensión ' +
              'mandibular (broxismo), dificultades de concentración, midriasis (dilatación de las pupilas).'},
          {topic: 'EFECTOS PRINCIPALES', info: '<strong>Susceptibilidad emocional, aumento o descenso de ansiedad.' +
              '</strong><br><hr><strong>Modulaciones en el comportamiento interpersonal.</strong><br><hr><strong>Mayor sensibilidad a ' +
              'estímulos sonoros y visuales en general.</strong><br><hr><strong>Alteraciones de la propia imagen corporal.' +
              '</strong><br><hr><strong>Distorsiones visuales que suelen ser simplemente ilusiones, aunque pueden en ocasiones ser ' +
              'también alucinaciones (indistinguibles de la realidad).</strong><br><hr><strong>Sinestesia de todo tipo.' +
              '</strong><br><hr><strong>Contorsión de la percepción del tiempo, al sentir que se detiene, o que va hacia atrás o se ' +
              'acelera.</strong><br><hr><strong>Percepción perturbada del mundo externo, en cuanto algo inestable y escurridizo.' +
              '</strong><br><hr><strong>Estimulación del pensamiento, ocasionando el paso acelerado de una idea a otra.' +
              '</strong><br><hr><strong>Disrupción cognitiva o conceptual, algo que se ha interpretado como confusión o cuadros ' +
              'psicóticos pero también como impulso creativo.</strong><br><hr>Algunas personas consumidoras de LSD experimentan ' +
              'sensaciones de euforia, otras de introspección y autoexploración. Hay algunas, no obstante, que viven la experiencia en ' +
              'clave terrorífica, debido a la intensidad de los cambios en la percepción del mundo y de sí mismo, manifestados como ' +
              'incontrolables. Cuando la experiencia tiene un tono general desagradable, suele hablarse de “mal viaje“.<br><br>Durante ' +
              'el viaje sus efectos pueden durar entre 5 y 12 horas, según la dosis.<br><hr><strong>INICIO (“SUBIDA”)</strong><br><br>' +
              '<strong>Comienza a los 20 o 30 minutos</strong> del consumo y <strong>dura unas 2 horas</strong><br>&nbsp  °Aceleración ' +
              'del ritmo cardíaco<br>&nbsp  °Exaltación, inquietud<br>&nbsp  °Euforia, desinhibición<br>&nbsp  °Enrojecimiento de la ' +
              'piel<br><br><strong>VIAJE</strong><br><br>°Se presenta entre los <strong>30 y los 60 minutos posteriores a la ingesta' +
              '</strong> y tiene una <strong>duración</strong> media de <strong>5 horas.</strong><br>°Ilusiones y/o alucinaciones.<br>' +
              '°Alteraciones en el tiempo, las distancias, las formas y distorsión de imágenes y colores.<br>°En algunos casos el viaje ' +
              'es de tipo introspectivo, con alteraciones de la conciencia y del pensamiento, sobre sí mismo y las demás personas.<br>' +
              '<br><strong>REGRESO (“BAJADA”)</strong><br><br><strong>Entre 8 y 12 horas</strong> aproximadamente. Los efectos van ' +
              'disminuyendo, quizás invitando a un estado de fatiga y abatimiento (dependiendo de la dosis consumida, la duración e ' +
              'intensidad del viaje).<br><br>El LSD se utilizó inicialmente para tratar alcoholismo y esquizofrenia. En estos estudios ' +
              'destacó el Instituto de Investigación Psicodélica en Estados Unidos. Defendía que dicha droga podría ayudar al equipo ' +
              'investigador o personal médico hacia maneras de comprender sensaciones y emociones relacionadas con semejantes ' +
              'problemáticas. Sin embargo, el uso clínico de esta sustancia abrió paso a la experimentación recreativa.'},
          {topic: 'INTOXICACIÓN', info: 'No tiene consecuencias a nivel fisiológico, sino <strong>psicológico</strong>. De mezclarse ' +
              'con otras sustancias, consumir dosis demasiado alta, pasar por mala racha o tener predisposición genética, puede ' +
              'producir “mal viaje“, caracterizado por <strong>episodio de pánico</strong> con alucinaciones terroríficas, agitación, ' +
              'desconfianza en las personas del entorno, temblores e hipertensión arterial. Es limitado en el tiempo aunque puede durar ' +
              'más de 24 horas. En casos de prolongación excesiva de estos efectos negativos, es <strong>recomendable consultar con un ' +
              'médico.</strong>'},
          {topic: '¡¡ALERTA!!', info: 'Durante el último semestre del 2012 en Bogotá y en diferentes partes de Colombia, personas ' +
              'consumidoras de LSD reportaron ganas de vomitar, mareo instantáneo, sabor muy amargo, adormecimiento de la boca y ' +
              'sensación de dientes sueltos. Síntomas muy diferentes a los producidos normalmente por la ingesta de LSD. Frente a tal ' +
              'situación, Energy Control (España) reportó presencia de 25I-NBOMe (2CI) en tres muestras analizadas. También se han ' +
              'presentado hospitalizaciones y muertes relacionadas con sobredosificaciones de esta sustancia. Por lo anterior, ' +
              'recomendable comenzar con dosis bajas (1/8) y no consumir si las características organolépticas (sabor y sensación en la ' +
              'boca) son muy diferentes a las habituales.'},
          {topic: 'DATO HISTÓRICO', info: 'En 1938 el químico Albert Hofmann estudiaba para los laboratorios Sandoz el cornezuelo de ' +
              'centeno, una droga usada por las comadronas desde hace siglos. Fue entonces cuando sintetizó por primera vez LSD. Sin ' +
              'embargo abandonaría su investigación sin descubrir los efectos de esta sustancia. Años más tarde, en 1943, por una ' +
              'corazonada quiso continuar con este trabajo. Fue entonces cuando por accidente le cayó una gota de esta sustancia en la ' +
              'mano. Tuvo que suspender la tarea al sentirse mareado y pidió a su ayudante que le acompañara a casa. Aquella anécdota se ' +
              'conocería más tarde como “día de la bicicleta”. Hofmann había tomado sin quererlo una fuerte dosis de LSD por vía ' +
              'subcutánea y estaba comprobando sus efectos. Más tarde corroboraría con más detalle su potencia y posibles usos. De tal ' +
              'forma que en 1947 se comercializó el primer fármaco con LSD, denominado Delysid.'},
          {topic: 'DATOS CURIOSOS', info: 'Cuando los Beatles publicaron su canción Lucy in the Sky with Diamonds, muchas personas ' +
              '(entre ellas, Timothy Leary) interpretaron que el título era un acróstico intencionado de LSD. John Lennon desmintió ' +
              'repetidamente esta interpretación, afirmando que tomó el personaje de un dibujo de su hijo.<br><br>Existe un libro que ' +
              'representa el diario de una chica drogada. La primera sustancia que toma es, en efecto, LSD. El libro se llama ' +
              '“Pregúntale a Alicia” cuyo título está basado en la canción “White Rabbit” de los Jefferson Airplane, a su vez inspirada ' +
              'en los efectos de esta droga. Por otra parte, algunas investigaciones han demostrado el beneficio del usar LSD en ' +
              'tratamientos a niñas o niños afectados severamente y diagnosticados con esquizofrenia o autismo infantil.'}
        ]
      )
    )
  ];

  canvas: Ip5WithCustomAtributes;
  canvasModal: Ip5WithCustomAtributes;

  selectedSubstance: SubstanceObjectModel;
  selectedPresentation: SubstancePresentationModel;
  selectedDosisInfo: DosisAndInformationModel;
  selectedCompleteInfoSection: ICompleteInfoSections;
  actualDosis: number;
  clase: Array<string>;
  animationRunning: boolean;
  characterState: CharacterStateModel;

  showAllInfo: boolean;
  hideContainer: boolean;

  allow: boolean;


  @HostListener('window:resize')
  onResize() {
    const parent: HTMLElement = this.containerSketch.nativeElement;
    const parentModal: HTMLElement = this.containerSketchModal.nativeElement;
    this.canvas.onResize(parent.clientWidth, parent.clientHeight);
    this.canvasModal.onResize(parentModal.clientWidth, parentModal.clientHeight);
  }

  constructor() {
    this.animationRunning = false;
    this.showAllInfo =  false;
    this.hideContainer = false;
    this.clase = new Array<string>(2);
    this.clase[0] = 'characterAnimateDiv';
    this.clase[1] = '';
    this.actualDosis = 1;
    this.allow = true;
  }

  ngOnInit() {
    this.createCanvas();
    this.selectedSubstance = this.sustancia[0];
    this.selectedPresentation = this.selectedSubstance.presentacion[0];
    this.selectedDosisInfo = this.selectedPresentation.infoPerDosis[0];
    this.selectedCompleteInfoSection = this.selectedSubstance.completeInfo.sections[0];
  }

  clickElBoton(hi: number) {
    for (let i = 1; i < this.clase.length; i++) {
      this.clase[i] = '';
    }
    this.animationRunning = true;
    switch (hi) {
      case 0:
        this.clase[1] = 'characterAnimateRun';
        break;
      case 1:
        this.clase[1] = '';
        break;
      case 2:
        this.clase[1] = 'characterAnimateJump';
        break;
    }

  }

  changeSelectedSubstance(substance: SubstanceObjectModel) {
    this.selectedSubstance = substance;
    this.selectedPresentation = this.selectedSubstance.presentacion[0];
    this.selectedCompleteInfoSection = this.selectedSubstance.completeInfo.sections[0];
    this.actualDosis = 1;
  }

  changePresentationImage(direction: string) {
    const actualIndex: number = this.selectedSubstance.presentacion.indexOf(this.selectedPresentation);
    switch (direction) {
      case 'iz':
        if (actualIndex - 1 >= 0) {
         this.selectedPresentation = this.selectedSubstance.presentacion[actualIndex - 1];
        } else {
          this.selectedPresentation = this.selectedSubstance.presentacion[this.selectedSubstance.presentacion.length - 1];
        }
        break;

      case 'der':
        if (actualIndex + 1 <= this.selectedSubstance.presentacion.length - 1) {
          this.selectedPresentation = this.selectedSubstance.presentacion[actualIndex + 1];
        } else {
          this.selectedPresentation = this.selectedSubstance.presentacion[0];
        }
        break;
    }
    // this.selectedPresentation = selectedSubstance;
    this.actualDosis = 1;
  }

  eliminateDosis() {
    if (this.actualDosis > 1) {
      this.actualDosis--;
    }
  }

  addDosis() {
    if (this.actualDosis < this.selectedPresentation.infoPerDosis.length) {
      this.actualDosis++;
    }
  }

  probarSustancia() {
    if ( this.actualDosis > 0) {
      for (let i = 1; i < this.clase.length; i++) {
        this.clase[i] = '';
      }
      this.animationRunning = true;
      this.canvas.canDraw = false;
      this.clase[1] = this.selectedSubstance.animation;
      this.selectedDosisInfo = this.selectedPresentation.infoPerDosis[this.actualDosis - 1];
      this.characterState = null;
    }
  }

  counter(i: number) {
    return new Array(i);
  }

  ngAfterViewInit(): void {
    this.myCharacter.nativeElement.addEventListener('animationstart', this.animationListener.bind(this), false);
    this.myCharacter.nativeElement.addEventListener('animationiteration', this.animationListener.bind(this), false);
    this.myCharacter.nativeElement.addEventListener('animationend', this.animationListener.bind(this), false);
    // this.canvas.onResize(this.containerSketch.nativeElement.clientWidth, this.containerSketch.nativeElement.clientHeight);
  }

  animationListener (event: Event) {
    if (event.type === 'animationend') {
      for (let i = 1; i < this.clase.length; i++) {
        this.clase[i] = '';
      }
      this.animationRunning = false;
      this.canvas.canDraw = true;

      this.characterState = new CharacterStateModel(this.selectedSubstance.nombre, this.selectedDosisInfo.headInfo,
      this.selectedDosisInfo.eyeInfo, this.selectedDosisInfo.heardInfo);

      this.canvas.changeTextInBox([this.characterState.headInfo, this.characterState.eyeInfo, this.characterState.heardInfo]);
    }
  }

  closeOrOpenInfoPanel(closeOrOpen: boolean) {
    this.showAllInfo = closeOrOpen;
  }

  onAnimationEnd(evt: AnimationEvent) {
    if (!evt.toState) {
      this.hideContainer = true;
    }
    this.allow = !this.allow;
  }

  onAnimationStart(evt: AnimationEvent) {
    this.hideContainer = false;
    this.allow = false;
  }

  onMouseWheel(evt: Event) {
    if (this.allow) {
      this.showAllInfo = !this.showAllInfo;
    }
  }


  ngOnDestroy(): void {
    this.myCharacter.nativeElement.removeEventListener('animationstart', this.animationListener, false);
    this.myCharacter.nativeElement.removeEventListener('animationiteration', this.animationListener, false);
    this.myCharacter.nativeElement.removeEventListener('animationend', this.animationListener, false);
    this.destroyCanvas();
  }



  private createCanvas () {
    const sketchFinal = createSketch(this.containerSketch.nativeElement.clientWidth, this.containerSketch.nativeElement.clientHeight);
    this.canvas = new p5(sketchFinal, this.containerSketch.nativeElement) as Ip5WithCustomAtributes;

    const sketchModal = createSketchModal(this.containerSketchModal.nativeElement.clientWidth,
      this.containerSketchModal.nativeElement.clientHeight);
    this.canvasModal = new p5(sketchModal, this.containerSketchModal.nativeElement) as Ip5WithCustomAtributes;
  }

  private destroyCanvas () {
    if (this.canvas) {
      this.canvas.remove();
      this.canvasModal.remove();
    }
  }



}





class SubstanceObjectModel {
  nombre: string;
  presentacion: SubstancePresentationModel[];
  completeInfo: CompleteInfoModel;
  animation: string;

  constructor (name: string, presentaciones: SubstancePresentationModel[], _completeInfo: CompleteInfoModel, animacion: string) {
    this.nombre = name;
    this.presentacion = presentaciones;
    this.completeInfo = _completeInfo;
    this.animation = animacion;
  }
}

interface ICompleteInfoSections {
  topic: string;
  info: string;
}

class CompleteInfoModel {
  nombres: string[];
  sections: ICompleteInfoSections[];

  constructor(_nombres: string[], _sections: ICompleteInfoSections[]) {
    this.nombres = _nombres;
    this.sections = _sections;
  }
}


class SubstancePresentationModel {
  tipo: string;
  img: string;
  maxDosis: number;
  constructor(tipin: string, laimagen: string, _infoPerDosis: number) {
    this.tipo = tipin;
    this.img = laimagen;
    this.maxDosis = _infoPerDosis;
  }
}

class DosisAndInformationModel {
  headInfo: string;
  eyeInfo: string;
  heardInfo: string;

  constructor (_headInfo: string, _eyeInfo: string, _heardInfo: string) {
    this.headInfo = _headInfo;
    this.eyeInfo = _eyeInfo;
    this.heardInfo = _heardInfo;
  }

}

class CharacterStateModel {
  name: string;
  headInfo: string;
  eyeInfo: string;
  heardInfo: string;
  constructor(_name: string, _headInfo: string, _eyeInfo: string, _heardInfo: string) {
    this.headInfo = _headInfo;
    this.eyeInfo = _eyeInfo;
    this.heardInfo = _heardInfo;
    this.name = _name;
  }
}
