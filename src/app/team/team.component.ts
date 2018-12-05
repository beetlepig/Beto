import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  parla: string;

  constructor() {
    this.parla = '¡Hola! Somos Carlos e Isabella, estudiantes del programa de Diseño de Medios Interactivos de la Universidad Icesi, ' +
      'creemos en la prevención de consumo de sustancias psicoactivas y que mediante esto, podemos minimizar los factores de ' +
      'riesgo de consumo, como lo es, la desinformación y la baja percepción del riesgo; por esta razón, juntos hemos creado a ' +
      'Alex para que puedas informarte y experimentar con las drogas, si, así como lo lees, experimentar con las drogas, creemos ' +
      'que es mucho más seguro que experimentes con Alex en un ambiente de confianza y te informes, para que a la hora de verte en ' +
      'la necesidad de tomar una decisión de consumo puedas hacerlo de manera consciente y consensuada. Esperamos este espacio sea ' +
      'de tu agrado, que te sientas cómodo, bien informado y puedas aprender.';
  }

  ngOnInit() {
  }

}
