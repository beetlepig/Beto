import {AfterViewInit, Component, OnInit} from '@angular/core';
import {animate, keyframes, state, style, transition, trigger, AnimationEvent} from '@angular/animations';

@Component({
  selector: 'app-texto-citas',
  templateUrl: './texto-citas.component.html',
  styleUrls: ['./texto-citas.component.css'],
  animations: [
    trigger('moveSourceAnimation', [
      state('0', style({
        transform: 'rotate(-90deg) translateX(0)'
      })),
      transition('*=>0', animate('1700ms cubic-bezier(.19,.61,.43,.86)', keyframes([
        style({transform: 'rotate(-90deg) translateX(-8vh)',        offset: 0}),
        style({transform: 'rotate(-90deg) translateX(0)',            offset: 1.0})
      ]))),
      transition('*=>1', animate('1700ms cubic-bezier(.80,.01,.46,.89)', keyframes([
        style({transform: 'rotate(-90deg) translateX(0)',        offset: 0}),
        style({transform: 'rotate(-90deg) translateX(8vh)',     offset: 1.0})
      ])))
    ]),
    trigger('bigTextFade', [
      state('0', style({
        opacity: 1
      })),
      state('1', style({
        opacity: 0
      })),
      transition('*=>0', animate('1000ms 200ms')),
      transition('*=>1', animate('1000ms 200ms'))
    ]),
    trigger('smallTextFade', [
      state('0', style({
        opacity: 1
      })),
      state('1', style({
        opacity: 0
      })),
      transition('*=>0', animate('1000ms 400ms')),
      transition('*=>1', animate('1000ms 400ms'))
    ])
  ]
})

export class TextoCitasComponent implements OnInit, AfterViewInit {
  activeInfo: RotatingInfoModel;
  infoArray: RotatingInfoModel[];

  changeInfo: boolean;


  constructor() {
    this.infoArray = [
      new RotatingInfoModel('ODC',
        'EN COLOMBIA LOS HOMBRES', 'Son mayores consumidores que las mujeres',
        'http://www.odc.gov.co/Portals/1/publicaciones/pdf/consumo/estudios/nacionales/CO03322016-estudio-epidemiologico-andino-' +
        'consumo-drogas-poblacion-universitaria-colombia-2016.pdf'
      ),
      new RotatingInfoModel('UNDOC', 'EN COLOMBIA LA MAYOR',
        'Prevalencia al consumo se encuentra en personas de 18 a 24 años',
        'https://www.unodc.org/documents/colombia/2014/Julio/Estudio_de_Consumo_UNODC.pdf'
      ),
      new RotatingInfoModel('ODC',
        'EN COLOMBIA LA EDAD', 'Promedio de inicio de consumo de alcohol es de 15 años',
        'http://www.odc.gov.co/Portals/1/publicaciones/pdf/consumo/estudios/nacionales/CO03322016-estudio-epidemiologico-andino-' +
        'consumo-drogas-poblacion-universitaria-colombia-2016.pdf'
      ),
      new RotatingInfoModel('UNODC',
        'CERCA DEL 5%', ' De la población adulta del mundo, entre los 15 y los 64 años, consumió drogas por lo menos en ' +
        'una ocasión en 2015',
        'https://www.unodc.org/wdr2017/field/WDR_Booklet1_Exsum_Spanish.pdf'
      ),
      new RotatingInfoModel('ODC',
        'LAS SUSTANCIAS “TIPO LSD”', 'Superan el consumo de drogas más tradicionales en los universitarios',
        'http://www.odc.gov.co/Portals/1/publicaciones/pdf/consumo/estudios/nacionales/CO03322016-estudio-epidemiologico-andino-' +
        'consumo-drogas-poblacion-universitaria-colombia-2016.pdf'
      ),
      new RotatingInfoModel('UNODC',
        '17 MILLONES DE PERSONAS', 'Consumieron cocaína en el último año alrededor del mundo',
        'https://www.unodc.org/wdr2017/field/WDR_Booklet1_Exsum_Spanish.pdf'
      ),
      new RotatingInfoModel('ODC',
        'EL CANNABIS', 'Es la droga más ampliamente usada',
        'http://www.odc.gov.co/Portals/1/publicaciones/pdf/odc-libro-blanco/reporte_drogas_colombia_2017.pdf'
      ),
      new RotatingInfoModel('UNODC',
        'LOS OPIOIDES', 'Son las sustancias que causan el mayor impacto negativo en la salud',
        'https://www.unodc.org/wdr2017/field/WDR_Booklet1_Exsum_Spanish.pdf'
      ),
      new RotatingInfoModel('ODC',
        'LOS MAYORES FUMADORES', 'De cigarrillos electrónicos son los universitarios más jóvenes',
        'http://www.odc.gov.co/Portals/1/publicaciones/pdf/consumo/estudios/nacionales/CO03322016-estudio-epidemiologico-andino-' +
        'consumo-drogas-poblacion-universitaria-colombia-2016.pdf'
      ),
      new RotatingInfoModel('ODC',
        'EL CONSUMO DE LDS', 'Se ha quintuplicado entre 2009 y 2016',
        'http://www.odc.gov.co/Portals/1/publicaciones/pdf/consumo/estudios/nacionales/CO03322016-estudio-epidemiologico-andino-' +
        'consumo-drogas-poblacion-universitaria-colombia-2016.pdf'
      ),
      new RotatingInfoModel('ODC',
        'CADA AÑO', 'Aumenta significativamente el consumo de alcohol',
        'http://www.odc.gov.co/Portals/1/publicaciones/pdf/consumo/estudios/nacionales/CO03322016-estudio-epidemiologico-andino-' +
        'consumo-drogas-poblacion-universitaria-colombia-2016.pdf'
      )
    ];

    this.activeInfo = this.infoArray[0];

    this.changeInfo = false;
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {

  }
  animEnd(event: AnimationEvent) {

    if (!event.toState) {
      setTimeout(() => {
        this.changeInfo = !this.changeInfo;
      }, 5000);
    } else {
      const actualIndex = this.infoArray.indexOf(this.activeInfo);
      if ((actualIndex + 1) > this.infoArray.length - 1) {
        this.activeInfo = this.infoArray[0];
      } else {
        this.activeInfo = this.infoArray[actualIndex + 1];
      }
      this.changeInfo = !this.changeInfo;
    }

  }

}

class RotatingInfoModel {
  sourceText: string;
  bigText: string;
  smallText: string;
  url: string;

  constructor(_sourceText: string, _bigText: string, _smallText: string, _url: string) {
    this.sourceText = _sourceText;
    this.bigText = _bigText;
    this.smallText = _smallText;
    this.url = _url;
  }
}
