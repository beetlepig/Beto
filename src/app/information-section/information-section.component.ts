import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-information-section',
  templateUrl: './information-section.component.html',
  styleUrls: ['./information-section.component.css']
})
export class InformationSectionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('AnimatedCharacter') myCharacter: ElementRef;
  sustancia = [
    new SubstanceObjectModel('Cafeína', [
      new SubstancePresentationModel('Sobre', '/assets/substancesImg/7702040127008.jpg', '10'),
      new SubstancePresentationModel('Liquido', '/assets/substancesImg/buen-cafe-full.jpg', '15')],
      'characterAnimateRun'
    ),


    new SubstanceObjectModel('Weed', [
      new SubstancePresentationModel('Mota', '/assets/substancesImg/1423530503.jpg', '20'),
      new SubstancePresentationModel('Chocolate', '/assets/substancesImg/Kiva_Tangerine_Large.jpg', '5')],
      'characterAnimateJump'
    )
  ];

  selectedSubstance: SubstanceObjectModel;
  selectedPresentation: SubstancePresentationModel;
  actualDosis: number;
  clase: Array<string>;
  animationRunning: boolean;

  constructor() {
    this.animationRunning = false;
    this.clase = new Array<string>(2);
    this.clase[0] = 'characterAnimateDiv';
    this.clase[1] = '';
    this.actualDosis = 0;
  }

  ngOnInit() {
    this.selectedSubstance = this.sustancia[0];
    this.selectedPresentation = this.selectedSubstance.presentacion[0];
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
  }

  changePresentationImage(selectedSubstance: SubstancePresentationModel) {
    this.selectedPresentation = selectedSubstance;
  }

  eliminateDosis() {
    if (this.actualDosis > 0) {
      this.actualDosis--;
    }
  }

  addDosis() {
    if (this.actualDosis < parseInt(this.selectedPresentation.dosisMax, 10)) {
      this.actualDosis++;
    }
  }

  counter(i: number) {
    return new Array(i);
  }

  ngAfterViewInit(): void {
    this.myCharacter.nativeElement.addEventListener('animationstart', this.animationListener.bind(this), false);
    this.myCharacter.nativeElement.addEventListener('animationiteration', this.animationListener.bind(this), false);
    this.myCharacter.nativeElement.addEventListener('animationend', this.animationListener.bind(this), false);
  }

  animationListener (event: AnimationEvent) {
    if (event.type === 'animationend') {
      for (let i = 1; i < this.clase.length; i++) {
        this.clase[i] = '';
      }
      this.animationRunning = false;
    }
      switch (event.animationName) {
        case 'idle':

          break;

        case 'run':


          break;
      }
  }


  ngOnDestroy(): void {
    this.myCharacter.nativeElement.removeEventListener('animationstart', this.animationListener, false);
    this.myCharacter.nativeElement.removeEventListener('animationiteration', this.animationListener, false);
    this.myCharacter.nativeElement.removeEventListener('animationend', this.animationListener, false);
  }
}


class SubstanceObjectModel {
  nombre: string;
  presentacion: SubstancePresentationModel[];
  animation: string;

  constructor (name: string, presentaciones: SubstancePresentationModel[], animacion: string) {
    this.nombre = name;
    this.presentacion = presentaciones;
    this.animation = animacion;

  }
}


class SubstancePresentationModel {
  tipo: string;
  img: string;
  dosisMax: string;
  constructor(tipin: string, laimagen: string, dosisMaxima: string) {
    this.tipo = tipin;
    this.img = laimagen;
    this.dosisMax = dosisMaxima;
  }
}
