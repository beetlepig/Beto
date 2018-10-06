import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-information-section',
  templateUrl: './information-section.component.html',
  styleUrls: ['./information-section.component.css']
})
export class InformationSectionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('AnimatedCharacter') myCharacter: ElementRef;
  sustancia = [
    new SubstanceObjectModel('Cafeína',
      [
        new SubstancePresentationModel('Sobre', '/assets/substancesImg/7702040127008.jpg',
          [
                        new DosisAndInformationModel('head dosis sobre 1', 'eye dosis sobre 1', 'heard dosis sobre 1'),
                        new DosisAndInformationModel('head dosis sobre 2', 'eye dosis sobre 2', 'heard dosis sobre 2')
          ]
        ),
        new SubstancePresentationModel('Liquido', '/assets/substancesImg/buen-cafe-full.jpg',
          [
                        new DosisAndInformationModel('head dosis liquido 1', 'eye dosis liquido 1', 'heard dosis liquido 1'),
                        new DosisAndInformationModel('head dosis liquido 2', 'eye dosis liquido 2', 'heard dosis liquido 2'),
                        new DosisAndInformationModel('head dosis liquido 3', 'eye dosis liquido 3', 'heard dosis liquido 3'),
                        new DosisAndInformationModel('head dosis liquido 4', 'eye dosis liquido 4', 'heard dosis liquido 4'),
                        new DosisAndInformationModel('head dosis liquido 5', 'eye dosis liquido 5', 'heard dosis liquido 5')
          ]
        )
      ],
      'characterAnimateRun', 'esta es la info completa'
    ),


    new SubstanceObjectModel('Weed',
      [
        new SubstancePresentationModel('Mota', '/assets/substancesImg/1423530503.jpg',
          [
                          new DosisAndInformationModel('head dosis mota 1', 'eye dosis mota 1', 'heard dosis mota 1'),
                          new DosisAndInformationModel('head dosis mota 2', 'eye dosis mota 2', 'heard dosis mota 2'),
                          new DosisAndInformationModel('head dosis mota 3', 'eye dosis mota 3', 'heard dosis mota 3')
          ]
        ),
        new SubstancePresentationModel('Chocolate', '/assets/substancesImg/Kiva_Tangerine_Large.jpg',
          [
                          new DosisAndInformationModel('head chocolate 1', 'eye chocolate 1', 'heard chocolate 1'),
                          new DosisAndInformationModel('head chocolate 2', 'eye chocolate 2', 'heard chocolate 2')
          ]
        )
      ],
      'characterAnimateJump', 'información sobre la hierba'
    )
  ];

  selectedSubstance: SubstanceObjectModel;
  selectedPresentation: SubstancePresentationModel;
  selectedDosisInfo: DosisAndInformationModel;
  actualDosis: number;
  clase: Array<string>;
  animationRunning: boolean;
  characterState: CharacterStateModel;
  constructor() {
    this.animationRunning = false;
    this.clase = new Array<string>(2);
    this.clase[0] = 'characterAnimateDiv';
    this.clase[1] = '';
    this.actualDosis = 1;
  }

  ngOnInit() {
    this.selectedSubstance = this.sustancia[0];
    this.selectedPresentation = this.selectedSubstance.presentacion[0];
    this.selectedDosisInfo = this.selectedPresentation.infoPerDosis[0];
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
    this.actualDosis = 1;
  }

  changePresentationImage(selectedSubstance: SubstancePresentationModel) {
    this.selectedPresentation = selectedSubstance;
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
  }

  animationListener (event: AnimationEvent) {
    if (event.type === 'animationend') {
      for (let i = 1; i < this.clase.length; i++) {
        this.clase[i] = '';
      }
      this.animationRunning = false;
      this.characterState = new CharacterStateModel(this.selectedSubstance.nombre, this.selectedDosisInfo.headInfo,
        this.selectedDosisInfo.eyeInfo, this.selectedDosisInfo.heardInfo);
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
  completeInfo: string;

  constructor (name: string, presentaciones: SubstancePresentationModel[], animacion: string, _completeInfo: string) {
    this.nombre = name;
    this.presentacion = presentaciones;
    this.animation = animacion;
    this.completeInfo = _completeInfo;
  }
}


class SubstancePresentationModel {
  tipo: string;
  img: string;
  infoPerDosis: DosisAndInformationModel[];
  constructor(tipin: string, laimagen: string, _infoPerDosis: DosisAndInformationModel[]) {
    this.tipo = tipin;
    this.img = laimagen;
    this.infoPerDosis = _infoPerDosis;
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
