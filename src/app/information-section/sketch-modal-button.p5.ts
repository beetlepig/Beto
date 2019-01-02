import * as p5 from 'p5';
import {Ip5WithCustomAtributes} from './sketch.p5';

export default function createSketchModal(width: number, height: number) {

  return function sketch(p: Ip5WithCustomAtributes) {
    let sketchWidth: number = width;
    let sketchHeight: number = height;

    let MainPointPos: p5.Vector;

    let font: p5.Font;

    let puntos: PuntoPalpitante[];

    p.preload = function () {
      font = p.loadFont('assets/fonts/Dosis-Bold.ttf');
    };

    p.setup = function () {
      p.createCanvas(sketchWidth, sketchHeight);
      p.frameRate(30);
      p.rectMode(p.CENTER);
      p.ellipseMode(p.CENTER);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(sketchWidth / 13);
      p.textFont(font);

      puntos = [];

      MainPointPos = p.createVector(sketchWidth / 2, sketchHeight / 2.15);

      puntos.push(new PuntoPalpitante(MainPointPos.x, MainPointPos.y,  sketchWidth, sketchHeight, p));

    };

    p.draw = function () {
      p.clear();
      for (let i = puntos.length - 1; i >= 0; i--) {
        puntos[i].update();
      }
      p.fill(216, 116, 48, 200);
      p.text('VER MÁS', sketchWidth / 2, sketchHeight * 0.92);
    };

    p.onResize = function (widthR: number, heightR: number) {
      sketchWidth = widthR;
      sketchHeight = heightR;

      MainPointPos.set(sketchWidth / 2, sketchHeight / 2);

      if (puntos) {
        puntos[0].onResize(MainPointPos.x, MainPointPos.y, sketchWidth, sketchHeight);
      }

      p.resizeCanvas(sketchWidth, sketchHeight);
    };

  };
}


class PuntoPalpitante {
  private xPos: number;
  private yPos: number;

  private xSize: number;
  private ySize: number;
  private fillOpacity: number;

  private xSizeTwo: number;
  private ySizeTwo: number;
  private fillOpacityTwo: number;

  private xSizeThree: number;
  private ySizeThree: number;
  private fillOpacityThree: number;

  private canvasWidth: number;
  private canvasHeight: number;

  private pInstance: p5;

  constructor(_xPos: number, _yPos: number, _canvasWidth: number, _canvasHeight: number, _p: p5) {
    this.xPos = _xPos;
    this.yPos = _yPos;
    this.canvasWidth = _canvasWidth;
    this.canvasHeight = _canvasHeight;

    this.xSize = this.canvasWidth / 40;
    this.ySize = this.canvasWidth / 40;
    this.fillOpacity = 85;

    this.xSizeTwo = 0;
    this.ySizeTwo = 0;
    this.fillOpacityTwo = 170;

    this.xSizeThree = 0;
    this.ySizeThree = 0;
    this.fillOpacityThree = 255;

    this.pInstance = _p;

  }

  update() {
    this.animatePoint();
    this.pInstance.noStroke();
    this.pInstance.fill(76, 175, 80, this.fillOpacity);
    this.pInstance.rect(this.xPos, this.yPos, this.xSize, this.ySize);
    this.pInstance.fill(76, 175, 80, this.fillOpacityTwo);
    this.pInstance.rect(this.xPos, this.yPos, this.xSizeTwo, this.ySizeTwo);
    this.pInstance.fill(76, 175, 80, this.fillOpacityThree);
    this.pInstance.rect(this.xPos, this.yPos, this.xSizeThree, this.ySizeThree);
  }

  animatePoint() {
    this.xSize += (this.canvasWidth + this.canvasHeight) * 0.002;
    this.ySize += (this.canvasWidth + this.canvasHeight) * 0.002;
    this.fillOpacity -= this.pInstance.map((this.canvasWidth + this.canvasHeight), 10, 600, 3, 1);
    if (this.fillOpacity <= 0) {
      this.xSize = 0;
      this.ySize = 0;
      this.fillOpacity = 255;
    }

    this.xSizeTwo += (this.canvasWidth + this.canvasHeight) * 0.002;
    this.ySizeTwo += (this.canvasWidth + this.canvasHeight) * 0.002;
    this.fillOpacityTwo -= this.pInstance.map((this.canvasWidth + this.canvasHeight), 10, 600, 3, 1);
    if (this.fillOpacityTwo <= 0) {
      this.xSizeTwo = 0;
      this.ySizeTwo = 0;
      this.fillOpacityTwo = 255;
    }

    this.xSizeThree += (this.canvasWidth + this.canvasHeight) * 0.002;
    this.ySizeThree += (this.canvasWidth + this.canvasHeight) * 0.002;
    this.fillOpacityThree -= this.pInstance.map((this.canvasWidth + this.canvasHeight), 10, 600, 3, 1);
    if (this.fillOpacityThree <= 0) {
      this.xSizeThree = 0;
      this.ySizeThree = 0;
      this.fillOpacityThree = 255;
    }
  }

  onResize(xPosR: number, yPosR: number, _canvasWidth: number, _canvasHeight: number) {
    this.xPos = xPosR;
    this.yPos = yPosR;
    this.canvasWidth = _canvasWidth;
    this.canvasHeight = _canvasHeight;
  }

}
