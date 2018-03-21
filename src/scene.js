// Three.js
import * as THREE from 'three';
import Stats from 'stats.js';
// Event emitter implementation for ES6
import EventEmitter from 'event-emitter-es6';
import Background from './background';
import City from './city';
import FlyControls from './FlyControls';
import Explode from './explode';
FlyControls(THREE);


class Scene extends EventEmitter {
  constructor(
    domElement = document.getElementById('gl_context'),
    _width = window.innerWidth,
    _height = window.innerHeight,
    hasControls = true,
    clearColor = 'black',
  ) {
    // Since we extend EventEmitter we need to instance it from here
    super();

    // THREE scene
    this.scene = new THREE.Scene();

    // Utility
    this.width = _width;
    this.height = _height;

    // THREE Camera
    this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 1500);
    // window.camera = this.camera;

    // THREE WebGL renderer
    this.renderer = new THREE.WebGLRenderer({
      antialiasing: true,
    });

    // this.renderer.setClearColor(new THREE.Color(clearColor));

    this.renderer.setSize(this.width, this.height);

    // Push the canvas to the DOM
    domElement.append(this.renderer.domElement);

    this.explosion = false;

    if (hasControls) {
      this.controls = new THREE.FlyControls(
        this.camera,
        this.renderer.domElement,
        () => this.emit('userMoved'),
      );

      // this.controls.lookSpeed = 0.15;
      this.controls.dragToLook = false;
      this.controls.rollSpeed = 0.5;
      this.controls.autoForward = true;
      // this.controls.movementSpeed = 20;
    }

    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = 500;
    this.mouse = new THREE.Vector2();

    window.addEventListener('mousemove', e => this.onMouseMove(e), false);

    // Setup event listeners for events and handle the states
    window.addEventListener('resize', e => this.onWindowResize(e), false);
    domElement.addEventListener('mouseenter', e => this.onEnterCanvas(e), false);
    domElement.addEventListener('mouseleave', e => this.onLeaveCanvas(e), false);
    // window.addEventListener('keydown', e => this.onKeyDown(e), false);

    this.clock = new THREE.Clock();

    const bg = new Background(this.scene);
    const city = new City(this.scene, this.renderer);

    this.blocks = [];
    this.blockCount = 30;
    // textchimp add cubes to group
    this.splodeGroup = new THREE.Object3D();
    for (let i = 0; i < this.blockCount; i++) {
      this.block = new Explode(this.scene);
      this.splodeGroup.add(this.block.cube);
      this.blocks.push(this.block);
    }

    // add group to scene
    this.scene.add(this.splodeGroup);

    this.addStats = function () {
      const stats = new Stats();
      stats.setMode(0);
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.left = '0px';
      stats.domElement.style.top = '0px';

      document.getElementById('stats').appendChild(stats.domElement);

      return stats;
    };
    this.stats = this.addStats();

    this.update();
  }


  update() {
    requestAnimationFrame(() => this.update());
    this.stats.update();

    this.controls.update(this.clock.getDelta());
    this.controls.target = new THREE.Vector3(0, 0, 0);

    if (window.airplane) {
      window.airplane.children[6].rotation.x += 0.9;
    }
    // console.log(window.airplane);
    this.render();
  }

  render() {
    // update the picking ray with the camera and mouse position
    this.raycaster.set(this.camera.getWorldPosition(), this.camera.getWorldDirection());

    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(this.scene.children);

    if (intersects.length) {
      if (intersects[0].object.name === 'City' && intersects[0].distance <= 5) {
        console.log('Building hit!!');

        // replace plane with exploding blocks
        this.camera.children[0].position.set(1000, 1000, 1000);
        this.splodeGroup.position.setFromMatrixPosition(this.camera.matrixWorld);
        // pull back from explosion
        this.controls.movementSpeed = -15;
        this.explosion = 150;
      }
      else if (intersects[0].distance < 300 && intersects[0].object.name === 'airplane-enemy') {
        console.log(`%c ENEMY IN SIGHT!! ${intersects[0].object.name}`, 'color: orange');
      }
    }

    // explosion
    if (this.explosion) {
      for (let i = 0; i < this.blockCount; i++) {
        this.blocks[i].loop();
      }
      this.explosion--;

      if (this.explosion === 0) {
        console.log('splode finished!');
        // warp whole group to somewhere invisible
        this.splodeGroup.position.set(10000, 10000, 10000);
        this.blocks.forEach(b => b.reset());
        // respawn plane & camera
        this.camera.position.set(100, 60, 125);
        this.camera.children[0].position.set(0, -0.5, -2.2);
        this.movementSpeed = 20;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize(e) {
    this.width = window.innerWidth;
    this.height = Math.floor(window.innerHeight - (window.innerHeight * 0.3));
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  onLeaveCanvas(e) {
    this.controls.enabled = false;
  }
  onEnterCanvas(e) {
    this.controls.enabled = true;
  }
  onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    this.mouse.x = (event.clientX / this.width) * 2 - 1;
    this.mouse.y = -(event.clientY / this.height) * 2 + 1;
  }
  // onKeyDown(e){
  //   this.emit('userMoved');
  // }
}

export default Scene;
