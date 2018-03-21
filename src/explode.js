import * as THREE from 'three';
import Cube from './cube';

class Explode {
  constructor(scene) {
    const MAX_SIZE = 30;
    const MIN_SIZE = 5;

    // Cerate randomly sized cube
    let geometry = new Cube(
      Math.random() * MAX_SIZE + MIN_SIZE,
      Math.random() * MAX_SIZE + MIN_SIZE,
      Math.random() * MAX_SIZE + MIN_SIZE,
    );

    const randomColor = function () {
      return `#${(0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6)}`;
    };
    geometry = new THREE.BoxBufferGeometry(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    const material = new THREE.MeshBasicMaterial({ color: randomColor() });
    this.cube = new THREE.Mesh(geometry, material);
    this.reset();

    console.log('cube', this.cube);

    scene.add(this.cube);
  }

  reset() {
    const MAX_SPEED = 20;
    const MAX_ROT = 0.1;

    this.xd = (Math.random() * MAX_SPEED * 2 - MAX_SPEED) / 100.0;
    this.yd = (Math.random() * MAX_SPEED * 2 - MAX_SPEED) / 100.0;
    this.zd = (Math.random() * MAX_SPEED * 2 - MAX_SPEED) / 100.0;

    this.xrd = Math.random() * MAX_ROT * 2 - MAX_ROT;
    this.zrd = Math.random() * MAX_ROT * 2 - MAX_ROT;

    // textchimp
    this.cube.position.x = 0; // 100;
    this.cube.position.y = 0; // 60;
    this.cube.position.z = 0; // 125;
    // /textchimp

    this.cube.rotation.x = Math.random() * 360;
    this.cube.rotation.z = Math.random() * 360;

    this.ticks = 0;
  }

  loop() {
    this.cube.position.x += this.xd;
    this.cube.position.y += this.yd;
    this.cube.position.z += this.zd;

    this.cube.rotation.x += this.xrd;
    this.cube.rotation.z += this.zrd;

    this.ticks++;

    if (this.ticks > 150) {
      this.reset();
    }
  }
}

export default Explode;
