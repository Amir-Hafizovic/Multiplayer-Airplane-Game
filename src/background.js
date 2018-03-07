import * as THREE from 'three'

class Background {
  constructor (scene) {
    this.scene = scene;

    this.scene.background = new THREE.Color().setHSL( 0.6, 0, 1 );
    // this.scene.fog = new THREE.Fog( this.scene.background, 1, 1000 );

    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
      hemiLight.color.setHSL( 0.6, 1, 0.6 );
      hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
      hemiLight.position.set( 0, 200, 0 );
      this.scene.add( hemiLight );
      // var hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
      // this.scene.add( hemiLightHelper );

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
      // var dirLightHeper = new THREE.DirectionalLightHelper( dirLight, 10 )
      // this.scene.add( dirLightHeper );
      // GROUND
      var groundGeo = new THREE.PlaneBufferGeometry( 4000, 4000 );
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
      // this.scene.fog.color.copy( uniforms.bottomColor.value );
      var skyGeo = new THREE.SphereGeometry( 800, 32, 15 );
      var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );
      var sky = new THREE.Mesh( skyGeo, skyMat );
      this.scene.add( sky );
  }
}

export default Background
