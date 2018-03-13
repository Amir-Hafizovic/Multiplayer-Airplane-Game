import * as THREE from 'three'
import Cube from './cube'

class Explode {
  constructor (scene) {
  	var MAX_SIZE = 30;
  	var MIN_SIZE = 5;

  	//cerate randomly sized cube
  	var geometry = new Cube(Math.random()*MAX_SIZE + MIN_SIZE, Math.random()*MAX_SIZE + MIN_SIZE, Math.random()*MAX_SIZE + MIN_SIZE);

  	// if (Math.random() < .1){
  	// 	//color orange
  	// 	for (var i = 0; i < geometry.faces.length; i++) {
  	// 		geometry.faces[i].color.setRGB( 1,0,0);
  	// 	}
  	// } else {
  	// 	//color grey
  	// 	for (var i = 0; i < geometry.faces.length; i++) {
  	// 		var brightness = Math.floor( Math.random() * 216 + 40);
  	// 		geometry.faces[i].color.setRGB( 1,0,0 );
  	// 	}
  	// }

    const randomColor = function () {
      return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
    }
  	// = new THREE.Mesh(geometry /*, new THREE.FaceColorFillMaterial()*/);
    geometry = new THREE.BoxBufferGeometry( Math.random()*2, Math.random()*2, Math.random()*2 );
    var material = new THREE.MeshBasicMaterial( { color: randomColor() } );
    this.cube = new THREE.Mesh( geometry, material );
  	this.reset();
    // this.cube.scale.set(0.1,0.1,0.1);
    console.log('cube', this.cube);
    // this.cube.wireframe = true;
  	scene.add(this.cube);
  }

  reset() {

  	var MAX_SPEED = 20;
  	var MAX_ROT = .1;

  	this.xd = (Math.random()*MAX_SPEED*2 - MAX_SPEED)/100.0 ;
  	this.yd = (Math.random()*MAX_SPEED*2 - MAX_SPEED)/100.0 ;
  	this.zd = (Math.random()*MAX_SPEED*2 - MAX_SPEED)/100.0 ;

  	this.xrd = Math.random()*MAX_ROT*2 - MAX_ROT;
  	this.zrd = Math.random()*MAX_ROT*2 - MAX_ROT;

    //this.cube.position = camera.position
    this.cube.position.x = 100;
  	this.cube.position.y = 60;
  	this.cube.position.z = 125;

  	this.cube.rotation.x = Math.random()*360;
  	this.cube.rotation.z = Math.random()*360;

  	this.ticks = 0;

  }

  loop() {

  	this.cube.position.x += this.xd;
  	this.cube.position.y += this.yd;
  	this.cube.position.z += this.zd;

  	this.cube.rotation.x += this.xrd;
  	this.cube.rotation.z += this.zrd;

  	this.ticks ++;

  	if (this.ticks > 150){
  		this.reset();
  	}

  }
}

export default Explode
