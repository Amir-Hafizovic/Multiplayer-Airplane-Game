//Three.js
import * as THREE from 'three';
import Stats from 'stats.js';
//import Airplane from './airplane';
// import ProceduralCity from './proceduralcity';
import Background from './background';
import City from './city';
import FlyControls from './FlyControls';
//FirstPersonControls(THREE);
FlyControls(THREE);
// ProceduralCity(THREE);

// Event emitter implementation for ES6
import EventEmitter from 'event-emitter-es6';

class Scene extends EventEmitter {
  constructor(domElement = document.getElementById('gl_context'),
              _width = window.innerWidth,
              _height = window.innerHeight,
              hasControls = true,
              clearColor = 'black'){

    //Since we extend EventEmitter we need to instance it from here
    super();

    //THREE scene
    this.scene = new THREE.Scene();

    //Utility
    this.width = _width;
    this.height = _height;

    //THREE Camera
    this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 1000);

    //THREE WebGL renderer
    this.renderer = new THREE.WebGLRenderer({
      antialiasing: true
    });

    // this.renderer.setClearColor(new THREE.Color(clearColor));

    this.renderer.setSize(this.width, this.height);

    //Push the canvas to the DOM
    domElement.append(this.renderer.domElement);

    if(hasControls){
      // this.controls = new THREE.FirstPersonControls(this.camera, this.renderer.domElement);
      this.controls = new THREE.FlyControls(
        this.camera,
        this.renderer.domElement,
        () => this.emit('userMoved')
      );

      //this.controls.lookSpeed = 0.15;
      this.controls.dragToLook = false;
      this.controls.movementSpeed = 20;
      this.controls.rollSpeed = 0.5;
      this.autoForward = false;
    }

    //Setup event listeners for events and handle the states
    window.addEventListener('resize', e => this.onWindowResize(e), false);
    domElement.addEventListener('mouseenter', e => this.onEnterCanvas(e), false);
    domElement.addEventListener('mouseleave', e => this.onLeaveCanvas(e), false);
    window.addEventListener('keydown', e => this.onKeyDown(e), false);

    this.helperGrid = new THREE.GridHelper( 50, 50 );
    this.helperGrid.position.y = -0.5;
    this.scene.add(this.helperGrid);
    this.clock = new THREE.Clock();

    // var light = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
    // this.scene.add( light );
    // const spotlight = new THREE.SpotLight( 0xFFFFFF );
    // spotlight.position.set( -10, 60, 10 );
    // this.scene.add(spotlight);
    const bg = new Background(this.scene);
    const city = new City(this.scene, this.renderer);


        this.addStats = function(){
        const stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.getElementById('stats').appendChild(stats.domElement);

        return stats;
        };
        this.stats = this.addStats();

        // var city  = new ProceduralCity(THREE, this.renderer);
        // this.scene.add(city);

    this.update();

  }

  // drawUsers(positions, id){
  //   for(let i = 0; i < Object.keys(positions).length; i++){
  //     if(Object.keys(positions)[i] != id){
  //       this.users[i].position.set(positions[Object.keys(positions)[i]].position[0],
  //                                  positions[Object.keys(positions)[i]].position[1],
  //                                  positions[Object.keys(positions)[i]].position[2]);
  //     }
  //   }
  // }

  update(){
    requestAnimationFrame(() => this.update());
    this.stats.update();

    this.controls.update(this.clock.getDelta());
    this.controls.target = new THREE.Vector3(0,0,0);
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize(e) {
    this.width = window.innerWidth;
    this.height = Math.floor(window.innerHeight - (window.innerHeight * 0.3));
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  onLeaveCanvas(e){
    this.controls.enabled = false;
  }
  onEnterCanvas(e){
    this.controls.enabled = true;
  }
  onKeyDown(e){
    this.emit('userMoved');
  }
}

export default Scene;
