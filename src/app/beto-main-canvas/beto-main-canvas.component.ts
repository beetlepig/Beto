import {Component, ElementRef, OnInit, ViewChild, HostListener} from '@angular/core';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import * as ThreeStats from 'three/examples/js/libs/stats.min';
import 'imports-loader?THREE=three!three/examples/js/controls/OrbitControls';
import 'imports-loader?THREE=three!three/examples/js/loaders/GLTFLoader';


import {
  AnimationAction,
  AnimationClip, AnimationMixer,
  BoxBufferGeometry, Clock, Color,
  CylinderBufferGeometry, DirectionalLight, FogExp2, Line,
  LineBasicMaterial, LoopOnce,
  Mesh,
  MeshPhongMaterial, OrbitControls, PerspectiveCamera,
  PlaneBufferGeometry, Scene, SkinnedMesh, Vector3, WebGLRenderer
} from 'three';


import {Tween} from '@tweenjs/tween.js';





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

  camera: PerspectiveCamera;
  controls: OrbitControls;
  scene: Scene;
  renderer: WebGLRenderer;
  stats: any;
  count: number;

  // Mesh
  pyramidMesh: Mesh;
  cubeMesh: Mesh;

  // Delta Time
  interval: number;
  delta: number;

  // Model
  beto: Scene;
  betoAnimations: Array<AnimationClip>;
  skinnedMesh: Array<SkinnedMesh>;

  // Animations Controller
  mixer: AnimationMixer;
  idleAction: AnimationAction;
  runb_aimAction: AnimationAction;
  runb_skate: AnimationAction;
  actions: Array<AnimationAction>;
  actualAction: AnimationAction;


  clock: Clock;


  @HostListener('window:resize', ['$event'])
  public onResize() {
    this.renderer.setSize(this.renderContainerParent.clientWidth, this.renderContainerParent.clientHeight);
    this.camera.aspect = this.getAspectRatio;
    this.camera.updateProjectionMatrix();
  }


  constructor() {

    this.delta = 0;

    this.interval = 1 / 60;

    this.count = 1;

    this.skinnedMesh = [];

    this.clock = new Clock();
  }

  ngOnInit(): void {
  this.initScene();
  this.initRenderer();
  this.initCamera();
  this.create3DObjects();
  this.resetView(new Vector3(10, 10, 10),
    new Vector3(this.pyramidMesh.position.x, this.pyramidMesh.position.y, this.pyramidMesh.position.z));
  this.loadModelBeto();
  this.lights();
  this.update();
  }

  initScene(): void {
    this.scene = new Scene();
    this.scene.background = new Color( 0xcccccc );
    this.scene.fog = new FogExp2( 0xcccccc, 0.002 );
  }

  initRenderer(): void {
    this.renderer = new WebGLRenderer( {canvas: this.renderContainer, antialias: true } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize(this.renderContainerParent.clientWidth, this.renderContainerParent.clientHeight );
    this.renderer.gammaOutput = true;
    this.stats = new ThreeStats();
    this.renderContainerParent.appendChild(this.stats.domElement);


  }

  initCamera(): void {
    this.camera = new PerspectiveCamera( 30, this.getAspectRatio, 1, 1000 );
    this.camera.position.set( 15, 15, 15 );
    // controls
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
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

  limitPan(min: Vector3, max: Vector3): void {
    this.controls.target.clamp(min, max);
  }

  create3DObjects(): void {
    let geometry: any = new CylinderBufferGeometry( 0, 2, 4, 4, 1 );
    let material: any = new MeshPhongMaterial( { color: 0xffffff, flatShading: true } );
    this.pyramidMesh = new Mesh( geometry, material );
    this.pyramidMesh.position.x = 0;
    this.pyramidMesh.position.y = 2;
    this.pyramidMesh.position.z = 0;
    this.pyramidMesh.updateMatrix();
    this.pyramidMesh.matrixAutoUpdate = false;
    this.pyramidMesh.visible = true;
    this.scene.add( this.pyramidMesh );

    geometry = new BoxBufferGeometry( 2, 2, 4, 4, 4 );
    material = new MeshPhongMaterial( { color: new Color('rgb(255,255,255)'), flatShading: true } );
    this.cubeMesh = new Mesh( geometry, material );
    this.cubeMesh.position.x = 0;
    this.cubeMesh.position.y = 1;
    this.cubeMesh.position.z = 0;
    this.cubeMesh.updateMatrix();
    this.cubeMesh.matrixAutoUpdate = false;
    this.cubeMesh.visible = false;
    this.scene.add( this.cubeMesh );

    geometry = new PlaneBufferGeometry(100, 100, 100, 100);
    material = new LineBasicMaterial();
    const planeMesh = new Line( geometry, material );
    planeMesh.position.x = 0;
    planeMesh.position.y = 0;
    planeMesh.position.z = 0;
    planeMesh.rotateX( -(Math.PI / 2) );
    planeMesh.updateMatrix();
    planeMesh.matrixAutoUpdate = false;
    planeMesh.visible = true;
    this.scene.add( planeMesh );


    this.controls.target.copy(new Vector3(  this.pyramidMesh.position.x,  this.pyramidMesh.position.y,  this.pyramidMesh.position.z));
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

        if ( child instanceof SkinnedMesh ) {
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
    this.mixer = new AnimationMixer( this.skinnedMesh[0] );
    // temporal
    this.mixer.timeScale = 2;
    this.idleAction = this.mixer.clipAction( this.betoAnimations[0] );
    this.runb_aimAction = this.mixer.clipAction( this.betoAnimations[1] );
    this.runb_skate = this.mixer.clipAction( this.betoAnimations[2] );
    this.runb_skate.setLoop( LoopOnce, 1 );
    this.runb_skate.clampWhenFinished = true;
    this.actions = [ this.idleAction, this.runb_aimAction, this.runb_skate ];
    this.activateAllActions();
  }

  activateAllActions() {
    this.actualAction = this.idleAction;
    this.setWeight( this.idleAction, 1 );
    this.setWeight( this.runb_aimAction, 0 );
    this.setWeight( this.runb_skate, 0 );
    this.actions.forEach( function ( action ) {
      action.play();
    } );
  }

  setWeight( action, weight ): void {
    action.enabled = true;
    action.setEffectiveTimeScale( 1 );
    action.setEffectiveWeight( weight );
  }

  prepareCrossFade( startAction: AnimationAction, endAction: AnimationAction, defaultDuration: number ) {
    // Switch default / custom crossfade duration (according to the user's choice)
    const duration = defaultDuration;
    // If the current action is 'idle' (duration 4 sec), execute the crossfade immediately;
    // else wait until the current action has finished its current loop
    if ( startAction === this.idleAction ) {
      this.executeCrossFade( startAction, endAction, duration );
    } else {
      this.synchronizeCrossFade( startAction, endAction, duration );
    }

  }

  synchronizeCrossFade( startAction, endAction, duration ) {

    const onLoopFinished = ( event ) => {
      if ( event.action === startAction ) {
        this.mixer.removeEventListener( 'loop', onLoopFinished );
        this.executeCrossFade( startAction, endAction, duration );
      }
    };

    this.mixer.addEventListener( 'loop', onLoopFinished );

  }

  oneRepetitionActions(startAction: AnimationAction, endAction: AnimationAction, duration: number) {
    const onLoopFinished = ( event ) => {
      if ( event.action === endAction ) {

        this.executeCrossFade( endAction, startAction, duration );
        this.mixer.removeEventListener( 'finished', onLoopFinished );
      }
    };

    this.mixer.addEventListener( 'finished', onLoopFinished );


  }

  executeCrossFade( startAction, endAction, duration ) {
    this.actualAction = endAction;
    // Not only the start action, but also the end action must get a weight of 1 before fading
    // (concerning the start action this is already guaranteed in this place)
    this.setWeight( endAction, 1 );
    endAction.reset();
    // Crossfade with warping - you can also try without warping by setting the third parameter to false
    startAction.crossFadeTo( endAction, duration, true );

    if (endAction === this.runb_skate) {
      this.oneRepetitionActions(startAction, endAction, duration);
    }
  }

  lights(): void {
    const lightOne = new DirectionalLight( 0xE1F5FE);
    lightOne.position.set( 1, 1, 1 );
    this.scene.add( lightOne );
    const lightTwo = new DirectionalLight( 0x002288 );
    lightTwo.position.set( - 1, - 1, - 1 );
    this.scene.add( lightTwo );
  }

  update(): void {

    requestAnimationFrame( () => this.update() );
   this.delta += this.clock.getDelta();


    if (this.delta  > this.interval) {
      TWEEN.update();
      this.limitPan(new Vector3(-4, 0, -4), new Vector3(4, 4, 4));
      this.controls.update();
      this.mixer.update( this.delta );
      this.render();

      this.delta = this.delta % this.interval;

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


        this.resetView(new Vector3(15, 15, 15),
          new Vector3(this.cubeMesh.position.x, this.cubeMesh.position.y, this.cubeMesh.position.z));

        break;
      case 2:
        this.beto.visible = true;
        this.cubeMesh.visible = false;
        this.pyramidMesh.visible = false;


        this.resetView(new Vector3(2, 5, 10),
          new Vector3(this.beto.position.x, this.beto.position.y + 2.5, this.beto.position.z));


        break;
      default:
        this.count = 0;
        this.cubeMesh.visible = false;
        this.pyramidMesh.visible = true;
        this.beto.visible = false;

        this.resetView(new Vector3(10, 10, 10),
          new Vector3(this.pyramidMesh.position.x, this.pyramidMesh.position.y, this.pyramidMesh.position.z));

        break;
    }
    this.count++;
  }

  private resetView(position: Vector3, target: Vector3): void {
    this.controls.enablePan = false;
    this.controls.enableRotate = false;
    // @ts-ignore
    this.controls.position0 = position;
    // @ts-ignore
    this.controls.target0 = target;

    const tweenPositionToReset = new Tween( this.controls.object.position )
    // @ts-ignore
      .to( { x: this.controls.position0.x, y: this.controls.position0.y, z: this.controls.position0.z }, 3000 )
      .easing( TWEEN.Easing.Quartic.InOut )
      .start();

    new Tween( this.controls.target )
    // @ts-ignore
      .to( { x: this.controls.target0.x, y: this.controls.target0.y, z: this.controls.target0.z }, 2000 )
      .easing( TWEEN.Easing.Quadratic.InOut )
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
