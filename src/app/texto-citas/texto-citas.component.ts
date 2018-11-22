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
    this.infoArray = [new RotatingInfoModel('UNDOC', 'UNA COSA', 'Me llegó al kokoro'),
    new RotatingInfoModel('KLLE', 'LA UNIVERSIDAD DE LA VIDA', 'El que a hierro mata a hierro muere')];

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
      }, 10000);
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

  constructor(_sourceText: string, _bigText: string, _smallText: string) {
    this.sourceText = _sourceText;
    this.bigText = _bigText;
    this.smallText = _smallText;
  }
}
