import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-evaluate',
  templateUrl: './evaluate.component.html',
  styleUrls: ['./evaluate.component.css']
})
export class EvaluateComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onClick (target: Element, targetTwo: Element, classOne: string, classTwo: string) {
    target.className = classOne;
    targetTwo.className = classTwo;
  }

}
