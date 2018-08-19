import {Component, ElementRef, OnInit, ViewChild, HostListener} from '@angular/core';
import * as THREE from 'three';
import * as ThreeStats from 'three/examples/js/libs/stats.min';
import 'imports-loader?THREE=three!three/examples/js/controls/OrbitControls';


@Component({
  selector: 'app-beto-main-canvas',
  templateUrl: './beto-main-canvas.component.html',
  styleUrls: ['./beto-main-canvas.component.css']
})
export class BetoMainCanvasComponent implements OnInit {
  @ViewChild('3Dcontainer')
  private rendererContainer: ElementRef;

  @ViewChild('statsContainer')
  private threeHTMLcontainer: ElementRef;

  private get renderContainer(): HTMLCanvasElement {
    return this.rendererContainer.nativeElement;
  }

  private get renderContainerParent(): HTMLCanvasElement {
    return this.threeHTMLcontainer.nativeElement;
  }

  private get getAspectRatio() {
    return this.renderContainerParent.clientWidth / this.renderContainerParent.clientHeight;
  }

  camera: THREE.PerspectiveCamera;
  controls: THREE.OrbitControls;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  stats: ThreeStats;

  // Mesh
  pyramidMesh: THREE.Mesh;
  cubeMesh: THREE.Mesh;

  // Delta Time
  now: number;
  delta: number;
  then: number;
  interval: number;


  @HostListener('window:resize', ['$event'])
  public onResize() {
    this.renderer.setSize(this.renderContainerParent.clientWidth, this.renderContainerParent.clientHeight);
    this.camera.aspect = this.getAspectRatio;
    this.camera.updateProjectionMatrix();
  }


  constructor() {
    this.now = Date.now();
    this.delta =  Date.now();
    this.then =  Date.now();
    this.interval = 1000 / 60;
  }

  ngOnInit(): void {
  this.initScene();
  this.initRenderer();
  this.initCamera();
  this.create3DObjects();
  this.lights();
  this.animate();
  }

  initScene(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xcccccc );
    this.scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
  }

  initRenderer(): void {
    this.renderer = new THREE.WebGLRenderer( {canvas: this.renderContainer, antialias: true } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize(this.renderContainerParent.clientWidth, this.renderContainerParent.clientHeight );
    this.stats = new ThreeStats();
    this.renderContainerParent.appendChild(this.stats.domElement);


  }

  initCamera(): void {
    this.camera = new THREE.PerspectiveCamera( 30, this.getAspectRatio, 1, 1000 );
    this.camera.position.set( 50, 50, 50 );
    // controls
    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    this.controls.target = new THREE.Vector3(0, 0, 0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.30;
    this.controls.enablePan = false;
    // this.controls.screenSpacePanning = false;
    this.controls.minDistance = 10;
    this.controls.maxDistance = 500;
    this.controls.maxPolarAngle = Math.PI ;
  }

  create3DObjects(): void {
    let geometry: any = new THREE.CylinderBufferGeometry( 0, 10, 30, 4, 1 );
    let material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );
    this.pyramidMesh = new THREE.Mesh( geometry, material );
    this.pyramidMesh.position.x = 0;
    this.pyramidMesh.position.y = 0;
    this.pyramidMesh.position.z = 0;
    this.pyramidMesh.updateMatrix();
    this.pyramidMesh.matrixAutoUpdate = false;
    this.pyramidMesh.visible = true;
    this.scene.add( this.pyramidMesh );

    geometry = new THREE.BoxBufferGeometry( 10, 10, 20, 4, 4 );
    material = new THREE.MeshPhongMaterial( { color: new THREE.Color('rgb(255,255,255)'), flatShading: true } );
    this.cubeMesh = new THREE.Mesh( geometry, material );
    this.cubeMesh.position.x = 0;
    this.cubeMesh.position.y = 0;
    this.cubeMesh.position.z = 0;
    this.cubeMesh.updateMatrix();
    this.cubeMesh.matrixAutoUpdate = false;
    this.cubeMesh.visible = false;
    this.scene.add( this.cubeMesh );
  }

  lights(): void {
    const lightOne = new THREE.DirectionalLight( 0xE1F5FE);
    lightOne.position.set( 1, 1, 1 );
    this.scene.add( lightOne );
    const lightTwo = new THREE.DirectionalLight( 0x002288 );
    lightTwo.position.set( - 1, - 1, - 1 );
    this.scene.add( lightTwo );
  }

  animate() {

    requestAnimationFrame( () => this.animate() );
    this.now = Date.now();
    this.delta = this.now - this.then;

    if (this.delta > this.interval) {

      this.controls.update();
      this.render();

      this.then = this.now - (this.delta % this.interval);

    }


  }

  render(): void {
    this.stats.begin();
    this.renderer.render( this.scene, this.camera );
    this.stats.end();
  }

  toggleObject() {
    this.pyramidMesh.visible = !this.pyramidMesh.visible;
    this.cubeMesh.visible = !this.cubeMesh.visible;
  }

  fullScreen() {

      if (this.renderContainerParent.requestFullscreen) {
          if (!document.fullscreenElement) {
            this.renderContainerParent.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
      } else if (this.renderContainerParent.webkitRequestFullscreen) {
          if (!document.webkitFullscreenElement) {
              this.renderContainerParent.webkitRequestFullscreen();
          } else {
              document.webkitExitFullscreen();
          }
           // @ts-ignore
      } else if (this.renderContainerParent.mozRequestFullScreen) {
           // @ts-ignore
        if (!document.mozFullScreenElement) {
           // @ts-ignore
        this.renderContainerParent.mozRequestFullScreen();
        } else {
          // @ts-ignore
          document.mozCancelFullScreen();
        }
         // @ts-ignore
      } else if (this.renderContainerParent.msRequestFullscreen) {
         // @ts-ignore
        if (!document.msFullscreenElement) {
          // @ts-ignore
        this.renderContainerParent.msRequestFullscreen();
        } else {
          // @ts-ignore
          document.msExitFullscreen();
        }
      } else {
        alert('FullScreenApi no soportado');
      }

      setTimeout(() => {
        this.onResize();
      }, 500);
  }


}
