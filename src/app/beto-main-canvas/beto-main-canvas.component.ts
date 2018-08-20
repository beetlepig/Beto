import {Component, ElementRef, OnInit, ViewChild, HostListener} from '@angular/core';
import * as THREE from 'three';
import * as ThreeStats from 'three/examples/js/libs/stats.min';
import 'imports-loader?THREE=three!three/examples/js/controls/OrbitControls';
import 'imports-loader?THREE=three!three/examples/js/loaders/GLTFLoader';
import * as TWEEN from '@tweenjs/tween.js';
import {AnimationAction} from 'three';
import {promise} from 'selenium-webdriver';
import Thenable = promise.Thenable;



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
  stats: any;
  count: number;

  // Mesh
  pyramidMesh: THREE.Mesh;
  cubeMesh: THREE.Mesh;

  // Delta Time
  now: number;
  delta: number;
  then: number;
  interval: number;

  // Model
  beto: THREE.Scene;
  betoAnimations: Array<THREE.AnimationClip>;
  skinnedMesh: Array<THREE.SkinnedMesh>;

  // Animations Controller
  mixer: THREE.AnimationMixer;
  idleAction: AnimationAction;
  runb_aimAction: AnimationAction;
  runb_skate: AnimationAction;
  actions: AnimationAction[];


  clock: THREE.Clock;


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

    this.count = 1;

    this.skinnedMesh = [];

    this.clock = new THREE.Clock();
  }

  ngOnInit(): void {
  this.initScene();
  this.initRenderer();
  this.initCamera();
  this.create3DObjects();
  this.resetView(new THREE.Vector3(10, 10, 10),
    new THREE.Vector3(this.pyramidMesh.position.x, this.pyramidMesh.position.y, this.pyramidMesh.position.z));
  this.loadModelBeto();
  this.lights();
  this.update();
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
    this.renderer.gammaOutput = true;
    this.stats = new ThreeStats();
    this.renderContainerParent.appendChild(this.stats.domElement);


  }

  initCamera(): void {
    this.camera = new THREE.PerspectiveCamera( 30, this.getAspectRatio, 1, 1000 );
    this.camera.position.set( 15, 15, 15 );
    // controls
    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.enablePan = true;
    // @ts-ignore
    this.controls.screenSpacePanning = true;
    // @ts-ignore
    this.controls.panSpeed = 0.2;
    this.controls.rotateSpeed = 0.2;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 20;
    this.controls.maxPolarAngle = Math.PI ;
  }

  limitPan(min: THREE.Vector3, max: THREE.Vector3): void {
    this.controls.target.clamp(min, max);
  }

  create3DObjects(): void {
    let geometry: any = new THREE.CylinderBufferGeometry( 0, 2, 4, 4, 1 );
    let material: any = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );
    this.pyramidMesh = new THREE.Mesh( geometry, material );
    this.pyramidMesh.position.x = 0;
    this.pyramidMesh.position.y = 2;
    this.pyramidMesh.position.z = 0;
    this.pyramidMesh.updateMatrix();
    this.pyramidMesh.matrixAutoUpdate = false;
    this.pyramidMesh.visible = true;
    this.scene.add( this.pyramidMesh );

    geometry = new THREE.BoxBufferGeometry( 2, 2, 4, 4, 4 );
    material = new THREE.MeshPhongMaterial( { color: new THREE.Color('rgb(255,255,255)'), flatShading: true } );
    this.cubeMesh = new THREE.Mesh( geometry, material );
    this.cubeMesh.position.x = 0;
    this.cubeMesh.position.y = 1;
    this.cubeMesh.position.z = 0;
    this.cubeMesh.updateMatrix();
    this.cubeMesh.matrixAutoUpdate = false;
    this.cubeMesh.visible = false;
    this.scene.add( this.cubeMesh );

    geometry = new THREE.PlaneBufferGeometry(100, 100, 100, 100);
    material = new THREE.MeshBasicMaterial();
    const planeMesh = new THREE.Line( geometry, material );
    planeMesh.position.x = 0;
    planeMesh.position.y = 0;
    planeMesh.position.z = 0;
    planeMesh.rotateX( -(Math.PI / 2) );
    planeMesh.updateMatrix();
    planeMesh.matrixAutoUpdate = false;
    planeMesh.visible = true;
    this.scene.add( planeMesh );


    this.controls.target.copy(new THREE.Vector3(  this.pyramidMesh.position.x,  this.pyramidMesh.position.y,  this.pyramidMesh.position.z));
    this.controls.reset();
  }

  loadModelBeto() {
    // @ts-ignore
    const loader = new THREE.GLTFLoader();
    loader.load( '/assets/BetoModel/scene.gltf', ( gltf ) => {
      gltf.scene.traverse( ( child ) => {
        if ( child.isMesh ) {
         // child.material.envMap = envMap;
        }

        if ( child instanceof THREE.SkinnedMesh ) {
          this.skinnedMesh.push(child);
        }
      } );
      this.betoAnimations = gltf.animations;
      console.log(this.betoAnimations);
      console.log(this.skinnedMesh);
      this.beto = gltf.scene;
      this.beto.visible = false;
      this.scene.add( this.beto );
      this.initAnimationMixer();
    },
      function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

      },
      // called when loading has errors
      function ( error ) {

        console.log( 'An error happened:' + error );

      } );
  }

  initAnimationMixer() {
    // Initialize mixer and clip actions
    this.mixer = new THREE.AnimationMixer( this.skinnedMesh[0] );
    this.idleAction = this.mixer.clipAction( this.betoAnimations[0] );
    this.runb_aimAction = this.mixer.clipAction( this.betoAnimations[1] );
    this.runb_skate = this.mixer.clipAction( this.betoAnimations[2] );
    this.actions = [ this.idleAction, this.runb_aimAction, this.runb_skate ];
    this.activateAllActions();
  }

  activateAllActions() {
    this.setWeight( this.idleAction, 1 );
    this.setWeight( this.runb_aimAction, 0 );
    this.setWeight( this.runb_skate, 0 );
    this.actions.forEach( function ( action ) {
      action.play();
    } );
  }

  setWeight( action, weight ) {
    action.enabled = true;
    action.setEffectiveTimeScale( 1 );
    action.setEffectiveWeight( weight );
  }

  crossfade() {
    this.setWeight(this.idleAction, 0);
    this.setWeight(this.runb_aimAction, 1);
  }

  lights(): void {
    const lightOne = new THREE.DirectionalLight( 0xE1F5FE);
    lightOne.position.set( 1, 1, 1 );
    this.scene.add( lightOne );
    const lightTwo = new THREE.DirectionalLight( 0x002288 );
    lightTwo.position.set( - 1, - 1, - 1 );
    this.scene.add( lightTwo );
  }

  update(): void {

    requestAnimationFrame( () => this.update() );
    this.now = Date.now();
    this.delta = this.now - this.then;
    this.mixer.update( this.clock.getDelta() );
    if (this.delta > this.interval) {

      TWEEN.update();
      this.limitPan(new THREE.Vector3(-4, 0, -4), new THREE.Vector3(4, 4, 4));
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

    switch (this.count) {
      case 1:
        this.cubeMesh.visible = true;
        this.pyramidMesh.visible = false;
        this.beto.visible = false;


        this.resetView(new THREE.Vector3(15, 15, 15),
          new THREE.Vector3(this.cubeMesh.position.x, this.cubeMesh.position.y, this.cubeMesh.position.z));

        break;
      case 2:
        this.beto.visible = true;
        this.cubeMesh.visible = false;
        this.pyramidMesh.visible = false;


        this.resetView(new THREE.Vector3(2, 5, 10),
          new THREE.Vector3(this.beto.position.x, this.beto.position.y + 2.5, this.beto.position.z));


        break;
      default:
        this.count = 0;
        this.cubeMesh.visible = false;
        this.pyramidMesh.visible = true;
        this.beto.visible = false;

        this.resetView(new THREE.Vector3(10, 10, 10),
          new THREE.Vector3(this.pyramidMesh.position.x, this.pyramidMesh.position.y, this.pyramidMesh.position.z));

        break;
    }
    this.count++;
  }

  private resetView(position: THREE.Vector3, target: THREE.Vector3): void {
    this.controls.enablePan = false;
    this.controls.enableRotate = false;
    // @ts-ignore
    this.controls.position0 = position;
    // @ts-ignore
    this.controls.target0 = target;

    const tweenPositionToReset = new TWEEN.Tween( this.controls.object.position )
    // @ts-ignore
      .to( { x: this.controls.position0.x, y: this.controls.position0.y, z: this.controls.position0.z }, 3000 )
      .easing( TWEEN.Easing.Quadratic.In )
      .start();

    new TWEEN.Tween( this.controls.target )
    // @ts-ignore
      .to( { x: this.controls.target0.x, y: this.controls.target0.y, z: this.controls.target0.z }, 2000 )
      .easing( TWEEN.Easing.Quadratic.In )
      .start();

    tweenPositionToReset.onComplete(() => {
      this.controls.reset();
      this.controls.enablePan = true;
      this.controls.enableRotate = true;
    });

  }

  fullScreen() {

      if (this.renderContainerParent.requestFullscreen) {
          if (!document.fullscreenElement) {
            this.renderContainerParent.requestFullscreen();
          } else {
            document.exitFullscreen();
            setTimeout(() => {
              this.onResize();
            }, 500);
          }
      } else if (this.renderContainerParent.webkitRequestFullscreen) {
          if (!document.webkitFullscreenElement) {
              this.renderContainerParent.webkitRequestFullscreen();
          } else {
              document.webkitExitFullscreen();
            setTimeout(() => {
              this.onResize();
            }, 500);
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
          setTimeout(() => {
            this.onResize();
          }, 500);
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
          setTimeout(() => {
            this.onResize();
          }, 500);
        }
      } else {
        alert('FullScreenApi no soportado');
      }


  }


}
