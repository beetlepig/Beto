import * as p5 from 'p5';

export interface Ip5WithCustomAtributes extends p5 {
  onResize: (width: number, height: number) => void;
  changeTextInBox: (texts: string[]) => void;
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
      p.createCanvas(sketchWidth, sketchHeight);
      p.frameRate(30);
      p.rectMode(p.CORNER);
      p.ellipseMode(p.CENTER);

      puntos = [];

      headPointPos = p.createVector(sketchWidth / 2, sketchHeight / 3.5);
      eyePointPos = p.createVector(sketchWidth / 1.7, sketchHeight / 2.5);
      heardPointPos = p.createVector(sketchWidth / 1.9, sketchHeight / 2);

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

    p.mouseMoved = function() {
      if (puntos) {
        puntos.forEach(function (puntito: PuntoPalpitante) {
          puntito.textRect.moved();
        });
      }
    };

    p.onResize = function (widthR: number, heightR: number) {
      sketchWidth = widthR;
      sketchHeight = heightR;

      headPointPos.set(sketchWidth / 2, sketchHeight / 3.5);
      eyePointPos.set(sketchWidth / 1.7, sketchHeight / 2.5);
      heardPointPos.set(sketchWidth / 1.9, sketchHeight / 2);

      if (puntos) {
        puntos[0].onResize(headPointPos.x, headPointPos.y, sketchWidth, sketchHeight);
        puntos[1].onResize(eyePointPos.x, eyePointPos.y, sketchWidth, sketchHeight);
        puntos[2].onResize(heardPointPos.x, heardPointPos.y, sketchWidth, sketchHeight);
      }

      p.resizeCanvas(sketchWidth, sketchHeight);
    };

    p.changeTextInBox = function (texts: string[]) {
      puntos[0].setSustanceText(texts[0]);
      puntos[1].setSustanceText(texts[1]);
      puntos[2].setSustanceText(texts[2]);
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

  textRect: TextBox;

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

    this.createTextRect();
  }

  createTextRect() {
    this.textRect = new TextBox(this.pInstance.createVector(this.xPos, this.yPos), this.canvasWidth * 0.3,
    this.canvasHeight * 0.15, 'Hola Amigo', this.pInstance);
  }

  update() {
    this.animatePoint();
    this.textRect.update();
    this.pInstance.noStroke();
    this.pInstance.fill(255, 200, 200, this.fillOpacity);
    this.pInstance.ellipse(this.xPos, this.yPos, this.xSize, this.ySize);
    this.pInstance.fill(200, 255, 200, this.fillOpacityTwo);
    this.pInstance.ellipse(this.xPos, this.yPos, this.xSizeTwo, this.ySizeTwo);
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

  onResize(xPosR: number, yPosR: number, _canvasWidth: number, _canvasHeight: number) {
    this.xPos = xPosR;
    this.yPos = yPosR;
    this.canvasWidth = _canvasWidth;
    this.canvasHeight = _canvasHeight;
    this.textRect.onResize(this.pInstance.createVector(this.xPos, this.yPos), this.canvasWidth * 0.3,
    this.canvasHeight * 0.15);
  }

  setSustanceText(text: string) {
    this.textRect.text = text;
  }

}

class TextBox {
  private position: p5.Vector;

  private boxWidth: number;
  private boxHeight: number;

  text: string;
  drawText: boolean;

  private p5Instance: p5;


  constructor(_position: p5.Vector, _boxWidth: number, _boxHeight: number, _text: string, _p5Instance: p5) {
    this.position = _position;
    this.boxWidth = _boxWidth;
    this.boxHeight = _boxHeight;
    this.text = _text;
    this.drawText = false;
    this.p5Instance = _p5Instance;
  }

  update() {
    if (this.drawText) {
      this.p5Instance.fill(155, 155, 255);
      this.p5Instance.rect(this.position.x, this.position.y, this.boxWidth, this.boxHeight);
      this.p5Instance.fill(50);
      this.p5Instance.text(this.text, this.position.x, this.position.y, this.boxWidth, this.boxHeight);
    }
  }

  moved() {
    const mouseX = this.p5Instance.mouseX;
    const mouseY = this.p5Instance.mouseY;
    if ( (p5.Vector.dist(this.position, this.p5Instance.createVector(this.p5Instance.mouseX, this.p5Instance.mouseY)) < 20) ||
      (this.drawText && ((mouseX > this.position.x && mouseX < this.position.x + this.boxWidth) &&
        (mouseY > this.position.y && mouseY < this.position.y + this.boxHeight)) )) {
      this.drawText = true;
    } else {
      this.drawText = false;
    }
  }

  onResize(_position: p5.Vector, _boxWidth: number, _boxHeight: number) {
    this.position = _position;
    this.boxWidth = _boxWidth;
    this.boxHeight = _boxHeight;
  }




}
