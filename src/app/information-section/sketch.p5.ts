import * as p5 from 'p5';

export interface Ip5WithCustomAtributes extends p5 {
  onResize: (width: number, height: number) => void;
  setPuntos: (_puntos: {info: string, posX: number, posY: number}[]) => void;
  canDraw: boolean;
}

export function createSketch(width: number, height: number) {

  return function sketch(p: Ip5WithCustomAtributes) {
    let sketchWidth: number = width;
    let sketchHeight: number = height;

    let puntos: PuntoPalpitante[];

    p.canDraw = false;

    p.setup = function() {
      p.createCanvas(sketchWidth, sketchHeight);
      p.frameRate(30);
      p.rectMode(p.CORNER);
      p.ellipseMode(p.CENTER);

      puntos = [];

      p.setPuntos([{posX: 2, posY: 3.5, info: 'ffssfdfs'}]);

    };

    p.setPuntos = (_puntos: {info: string, posX: number, posY: number}[]) => {
      puntos = [];
      _puntos.forEach((punto: {info: string, posX: number, posY: number}) => {
        puntos.push(new PuntoPalpitante(punto.posX, punto.posY, sketchWidth, sketchHeight, p, punto.info));
      });
    };

    p.draw = function () {
      p.clear();
      /*
      puntos.forEach(function(puntoQuePalpita: PuntoPalpitante) {
        puntoQuePalpita.update();
      });
      */
      if (p.canDraw) {
        for (let i = puntos.length - 1; i >= 0; i--) {
          puntos[i].update();
        }
      }
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

      puntos.forEach((puntin: PuntoPalpitante) => {
        puntin.onResize(sketchWidth, sketchHeight);
      });

      p.resizeCanvas(sketchWidth, sketchHeight);
    };

  };
}


class PuntoPalpitante {
  private xPos: number;
  private yPos: number;

  private xDivider: number;
  private yDivider: number;

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

  constructor(_xDivider: number, _yDivider: number, _canvasWidth: number, _canvasHeight: number, _p: p5, text: string) {
    this.xDivider = _xDivider;
    this.yDivider = _yDivider;
    this.canvasWidth = _canvasWidth;
    this.canvasHeight = _canvasHeight;
    this.xPos = this.canvasWidth / this.xDivider;
    this.yPos = this.canvasHeight / this.yDivider;

    this.xSize = this.canvasWidth / 40;
    this.ySize = this.canvasWidth / 40;
    this.fillOpacity = 130;

    this.xSizeTwo = 0;
    this.ySizeTwo = 0;
    this.fillOpacityTwo = 255;

    this.pInstance = _p;

    this.createTextRect();

    this.textRect.text = text;
  }

  createTextRect() {
    this.textRect = new TextBox(this.pInstance.createVector(this.xPos, this.yPos), this.canvasWidth * 0.3,
    this.canvasHeight * 0.15, 'Hola Amigo', this.pInstance);
  }

  update() {
    this.animatePoint();
    this.textRect.update();
    this.pInstance.noStroke();
    this.pInstance.fill(255, 150, 150, this.fillOpacity);
    this.pInstance.ellipse(this.xPos, this.yPos, this.xSize, this.ySize);
    this.pInstance.fill(255, 150, 150, this.fillOpacityTwo);
    this.pInstance.ellipse(this.xPos, this.yPos, this.xSizeTwo, this.ySizeTwo);
  }

  animatePoint() {
    this.xSize += (this.canvasWidth + this.canvasHeight) * 0.0008;
    this.ySize += (this.canvasWidth + this.canvasHeight) * 0.0008;
    this.fillOpacity -= this.pInstance.map((this.canvasWidth + this.canvasHeight), 50, 2000, 10, 1);
    if (this.fillOpacity <= 0) {
      this.xSize = 0;
      this.ySize = 0;
      this.fillOpacity = 255;
    }

    this.xSizeTwo += (this.canvasWidth + this.canvasHeight) * 0.0008;
    this.ySizeTwo += (this.canvasWidth + this.canvasHeight) * 0.0008;
    this.fillOpacityTwo -= this.pInstance.map((this.canvasWidth + this.canvasHeight), 50, 2000, 10, 1);
    if (this.fillOpacityTwo <= 0) {
      this.xSizeTwo = 0;
      this.ySizeTwo = 0;
      this.fillOpacityTwo = 255;
    }
  }

  onResize(_canvasWidth: number, _canvasHeight: number) {
    this.canvasWidth = _canvasWidth;
    this.canvasHeight = _canvasHeight;
    this.xPos = this.canvasWidth / this.xDivider;
    this.yPos = this.canvasHeight / this.yDivider;
    this.textRect.onResize(this.pInstance.createVector(this.xPos, this.yPos), this.canvasWidth * 0.3,
    this.canvasHeight * 0.15);
  }

}

class TextBox {
  private position: p5.Vector;

  private boxWidth: number;
  private boxHeight: number;

  text: string;
  drawText: boolean;

  boxColorAlpha: number;

  private p5Instance: p5;


  constructor(_position: p5.Vector, _boxWidth: number, _boxHeight: number, _text: string, _p5Instance: p5) {
    this.position = _position;
    this.boxWidth = _boxWidth;
    this.boxHeight = _boxHeight;
    this.boxColorAlpha = 0;
    this.text = _text;
    this.drawText = false;
    this.p5Instance = _p5Instance;
  }

  update() {
    this.fadeBox();
    this.p5Instance.fill(155, 155, 255, this.boxColorAlpha);
    this.p5Instance.rect(this.position.x * 1.05, this.position.y * 1.05, this.boxWidth, this.boxHeight);
    this.p5Instance.fill(50, this.boxColorAlpha);
    this.p5Instance.text(this.text, this.position.x * 1.05, this.position.y * 1.05, this.boxWidth, this.boxHeight);

  }

  fadeBox() {
    if (this.drawText && this.boxColorAlpha < 255) {
      this.boxColorAlpha += 40;
    } else if (!this.drawText && this.boxColorAlpha > 0) {
      this.boxColorAlpha -= 40;
    }
  }

  moved() {
    const mouseX = this.p5Instance.mouseX;
    const mouseY = this.p5Instance.mouseY;
    /*
    if ( (p5.Vector.dist(this.position, this.p5Instance.createVector(this.p5Instance.mouseX, this.p5Instance.mouseY)) < 20) ||
      (this.drawText && ((mouseX > this.position.x && mouseX < this.position.x + this.boxWidth) &&
        (mouseY > this.position.y && mouseY < this.position.y + this.boxHeight)) )) {
      this.drawText = true;
    } else {
      this.drawText = false;
    }
    */
    this.drawText = p5.Vector.dist(this.position, this.p5Instance.createVector(mouseX, mouseY)) < 20;
  }

  onResize(_position: p5.Vector, _boxWidth: number, _boxHeight: number) {
    this.position = _position;
    this.boxWidth = _boxWidth;
    this.boxHeight = _boxHeight;
  }




}
