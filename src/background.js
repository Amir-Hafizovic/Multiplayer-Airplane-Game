import * as THREE from 'three';

class Background {
  constructor(scene) {
    this.scene = scene;

    this.scene.background = new THREE.Color().setHSL(0.6, 0, 1);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 200, 0);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(-1, 1.75, 1);
    dirLight.position.multiplyScalar(30);
    this.scene.add(dirLight);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    const d = 50;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = -0.0001;

    // Create ground
    const groundGeo = new THREE.PlaneBufferGeometry(4000, 4000);
    const groundMat = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x050505 });
    groundMat.color.setHSL(0.095, 1, 0.75);
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    this.scene.add(ground);
    ground.receiveShadow = true;

    // Create skydome
    const vertexShader = document.getElementById('vertexShader').textContent;
    const fragmentShader = document.getElementById('fragmentShader').textContent;
    const uniforms = {
      topColor: { value: new THREE.Color(0x0077ff) },
      bottomColor: { value: new THREE.Color(0xffffff) },
      offset: { value: 33 },
      exponent: { value: 0.6 },
    };
    uniforms.topColor.value.copy(hemiLight.color);
    const skyGeo = new THREE.SphereGeometry(1000, 32, 15);
    const skyMat = new THREE.ShaderMaterial({
      vertexShader, fragmentShader, uniforms, side: THREE.BackSide,
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);

    this.scene.add(sky);
  }
}

export default Background;
