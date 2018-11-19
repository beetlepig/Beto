import * as p5 from 'p5';

export interface Ip5WithCustomAtributes extends p5 {
  onResize: (width: number, height: number) => void;
}

export function createSketch(width: number, height: number) {

  return function sketch(p: Ip5WithCustomAtributes) {
    let sketchWidth: number = width;
    let sketchHeight: number = height;

    let headPointPos: p5.Vector;
    let eyePointPos: p5.Vector;
    let heardPointPos: p5.Vector;

    let puntos: PuntoPalpitante[];

    p.setup = function() {
      puntos = [];

      headPointPos = p.createVector(sketchWidth / 2, sketchHeight / 3.5);
      eyePointPos = p.createVector(sketchWidth / 1.7, sketchHeight / 2.5);
      heardPointPos = p.createVector(sketchWidth / 1.9, sketchHeight / 2);

      p.createCanvas(sketchWidth, sketchHeight);
      p.frameRate(30);
      p.rectMode(p.CORNER);
      p.ellipseMode(p.CENTER);

      puntos.push(new PuntoPalpitante(headPointPos.x, headPointPos.y,  sketchWidth, sketchHeight, p));
      puntos.push(new PuntoPalpitante(eyePointPos.x, eyePointPos.y,  sketchWidth, sketchHeight, p));
      puntos.push(new PuntoPalpitante(heardPointPos.x, heardPointPos.y,  sketchWidth, sketchHeight, p));

    };

    p.draw = function () {
      p.clear();
      puntos.forEach(function(puntoQuePalpita: PuntoPalpitante) {
        puntoQuePalpita.update();
      });
    };

    p.onResize = function (widthR: number, heightR: number) {
      sketchWidth = widthR;
      sketchHeight = heightR;

      headPointPos.set(sketchWidth / 2, sketchHeight / 3.5);
      eyePointPos.set(sketchWidth / 1.7, sketchHeight / 2.5);
      heardPointPos.set(sketchWidth / 1.9, sketchHeight / 2);

      if (puntos) {
        puntos[0].onResizeupdatePos(headPointPos.x, headPointPos.y);
        puntos[1].onResizeupdatePos(eyePointPos.x, eyePointPos.y);
        puntos[2].onResizeupdatePos(heardPointPos.x, heardPointPos.y);
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

  private canvasWidth: number;
  private canvasHeight: number;

  private textRect: textBox;

  private pInstance: p5;

  constructor(_xPos: number, _yPos: number, _canvasWidth: number, _canvasHeight: number, _p: p5) {
    this.xPos = _xPos;
    this.yPos = _yPos;
    this.canvasWidth = _canvasWidth;
    this.canvasHeight = _canvasHeight;

    this.xSize = this.canvasWidth / 40;
    this.ySize = this.canvasWidth / 40;
    this.fillOpacity = 130;

    this.xSizeTwo = 0;
    this.ySizeTwo = 0;
    this.fillOpacityTwo = 255;

    this.pInstance = _p;
  }

  createTextRect() {

  }

  update() {
    this.animatePoint();
    this.pInstance.noStroke();
    this.pInstance.fill(255, 200, 200, this.fillOpacity);
    this.pInstance.ellipse(this.xPos, this.yPos, this.xSize, this.ySize);
    this.pInstance.fill(200, 255, 200, this.fillOpacityTwo);
    this.pInstance.ellipse(this.xPos, this.yPos, this.xSizeTwo, this.ySizeTwo);
  }

  onResizeupdatePos(xPosR: number, yPosR: number) {
    this.xPos = xPosR;
    this.yPos = yPosR;
  }

  animatePoint() {
    this.xSize += 0.3;
    this.ySize += 0.3;
    this.fillOpacity -= 2;
    if (this.fillOpacity <= 0) {
      this.xSize = 0;
      this.ySize = 0;
      this.fillOpacity = 255;
    }

    this.xSizeTwo += 0.3;
    this.ySizeTwo += 0.3;
    this.fillOpacityTwo -= 2;
    if (this.fillOpacityTwo <= 0) {
      this.xSizeTwo = 0;
      this.ySizeTwo = 0;
      this.fillOpacityTwo = 255;
    }
  }

}

class textBox {
  private position: p5.Vector; 

  private boxWidth: number;
  private boxHeight: number;

  private text: string;

  private p5Instance: p5;


constructor(_position: p5.Vector, _boxWidth: number, _boxHeight: number, _text: string, _p5Instance: p5){
  this.position = _position;
  this.boxWidth = _boxWidth;
  this.boxHeight = _boxHeight;
  this.text = _text;
  this.p5Instance = _p5Instance;
}

update() {
  this.p5Instance.fill(155,155,255);
  this.p5Instance.rect(this.position.x, this.position.y, this.boxWidth, this.boxHeight);
}


}
