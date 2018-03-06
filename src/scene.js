//Three.js
import * as THREE from 'three';
import Stats from 'stats.js';
//import Airplane from './airplane';
// import ProceduralCity from './proceduralcity';
//import FirstPersonControls from './fpscontrols';
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

    this.renderer.setClearColor(new THREE.Color(clearColor));

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
      this.controls.dragToLook = true;
      this.controls.movementSpeed = 5;
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
    // LIGHTS
      this.scene.background = new THREE.Color().setHSL( 0.6, 0, 1 );
			this.scene.fog = new THREE.Fog( this.scene.background, 1, 5000 );

			var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
				hemiLight.color.setHSL( 0.6, 1, 0.6 );
				hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
				hemiLight.position.set( 0, 50, 0 );
				this.scene.add( hemiLight );
				var hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
				this.scene.add( hemiLightHelper );
				//
				var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
				dirLight.color.setHSL( 0.1, 1, 0.95 );
				dirLight.position.set( -1, 1.75, 1 );
				dirLight.position.multiplyScalar( 30 );
				this.scene.add( dirLight );
				dirLight.castShadow = true;
				dirLight.shadow.mapSize.width = 2048;
				dirLight.shadow.mapSize.height = 2048;
				var d = 50;
				dirLight.shadow.camera.left = -d;
				dirLight.shadow.camera.right = d;
				dirLight.shadow.camera.top = d;
				dirLight.shadow.camera.bottom = -d;
				dirLight.shadow.camera.far = 3500;
				dirLight.shadow.bias = -0.0001;
				var dirLightHeper = new THREE.DirectionalLightHelper( dirLight, 10 )
				this.scene.add( dirLightHeper );
				// GROUND
				var groundGeo = new THREE.PlaneBufferGeometry( 10000, 10000 );
				var groundMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x050505 } );
				groundMat.color.setHSL( 0.095, 1, 0.75 );
				var ground = new THREE.Mesh( groundGeo, groundMat );
				ground.rotation.x = -Math.PI/2;
				ground.position.y = -33;
				this.scene.add( ground );
				ground.receiveShadow = true;
				// SKYDOME
				var vertexShader = document.getElementById( 'vertexShader' ).textContent;
				var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
				var uniforms = {
					topColor:    { value: new THREE.Color( 0x0077ff ) },
					bottomColor: { value: new THREE.Color( 0xffffff ) },
					offset:      { value: 33 },
					exponent:    { value: 0.6 }
				};
				uniforms.topColor.value.copy( hemiLight.color );
				this.scene.fog.color.copy( uniforms.bottomColor.value );
				var skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
				var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );
				var sky = new THREE.Mesh( skyGeo, skyMat );
				this.scene.add( sky );

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
