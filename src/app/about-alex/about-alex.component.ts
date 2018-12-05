import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-alex',
  templateUrl: './about-alex.component.html',
  styleUrls: ['./about-alex.component.css']
})
export class AboutAlexComponent implements OnInit {
  info: string;

  constructor() {
    this.info = 'Alex es un/a jóven universitario/a, al igual que tu y muchos otros; nació con la intención de que no corras riesgos ' +
      'al tomar una decisión de consumo de sustancias psicoactivas, pues te acompaña en esta etapa de tu vida donde la curiosidad es ' +
      'más grande que nunca. Alex puede ser amante de los deportes o de las películas, puede ser fan de Bad Bunny o de Arctic Monkeys, ' +
      'puede ser perezoso o increíblemente activo, puede ser muy sociable o muy introvertido, Alex puedes ser tú.<br> Por otro lado, ' +
      'esta web también es un esfuerzo por parte de Bienestar Universitario de la Universidad Icesi, para que puedas obtener ' +
      'información de confianza, y además ofrecer la posibilidad de resolver tus dudas mediante un contacto directo con los ' +
      'profesionales de psicología, de esta forma ahora es posible obtener ayuda de una forma personalizada y anónima.';
  }

  ngOnInit() {
  }

}
