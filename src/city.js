  import * as THREE from 'three';

class City {
  constructor (scene, renderer) {
    this.scene = scene;
    this.renderer = renderer;

    // const light = new THREE.HemisphereLight(0xfffff0, 0x101020, 1.25);
    // light.position.set(0.75, 1, 0.25);
    // this.scene.add(light);
    // const grassPlane = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshBasicMaterial({color: 0x04871d}));
    // grassPlane.rotation.x = -90 *Math.PI/180;
    // grassPlane.position.x = 145;
    // grassPlane.position.z = 145;
    // grassPlane .position.y = -0.1;
    // console.log('GPLANE',grassPlane.rotation);
    // console.log('GPLANEPOS',grassPlane.position);
    // this.scene.add(grassPlane);

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(320, 320), new THREE.MeshBasicMaterial({color: 0x6a6a6a}));
    plane.rotation.x = -90 *Math.PI/180;
    plane.position.x = 145;
    plane.position.z = 145;
    // console.log('PLANE',plane.rotation);
    // console.log('PLANEPOS',plane.position);
    this.scene.add(plane);

    const buildings = new Buildings();
    const city = new THREE.Geometry();
    const cityBlocksX = 10;
    const cityBlocksZ = 10;

    const center = new THREE.Matrix4().makeTranslation( 0, 0.5, 0 );
    const scale = new THREE.Matrix4().makeScale(20, 20, 20);
    for (let x = 0; x < cityBlocksX; ++x) {
      for (let z = 0; z < cityBlocksZ; ++z) {
        const building = buildings.random();
        building.applyMatrix(scale);
        building.applyMatrix(new THREE.Matrix4().makeTranslation(32 * x, 0, 32 * z));
        city.merge(building, building.matrix);
      }
    }

    const texture = new THREE.Texture(generateTexture());
    texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    texture.needsUpdate = true;

    const mesh = new THREE.Mesh(city, new THREE.MeshLambertMaterial({map: texture, vertexColors: THREE.VertexColors}));

    mesh.name = "City";

    this.scene.add(mesh);

    function generateTexture() {
      const canvas = document.createElement( 'canvas' );
      canvas.width = 32;
      canvas.height = 64;

      let context = canvas.getContext( '2d' );
      context.fillStyle = '#111';
      context.fillRect( 0, 0, 32, 64 );

      for ( let y = 2; y < 64; y += 2 ) {
        for ( let x = 0; x < 32; x += 2 ) {
          const value = Math.floor( Math.random() * 128 );
          context.fillStyle = 'rgb(' + [ value, value, value ].join( ',' )  + ')';
          context.fillRect( x, y, 2, 1 );
        }
      }

      const canvas2 = document.createElement( 'canvas' );
      canvas2.width = 512;
      canvas2.height = 1024;

      let context2 = canvas2.getContext( '2d' );
      context2.imageSmoothingEnabled = false;
      context2.drawImage( canvas, 0, 0, canvas2.width, canvas2.height );

      return canvas2;
    }
  } //constructor
}//class

class Buildings {
  constructor() {
    const baseBox = new THREE.BoxGeometry(1, 1, 1);
    const black = new THREE.Color().setRGB(0, 0, 0);
    baseBox.faces[4].color = black;
    baseBox.faces[5].color = black;
    baseBox.applyMatrix(new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ));

    this.random = function() {
      const cubeChance = 0.5;
      const stackChance = cubeChance + 0.3;

      const choice = Math.random();
      if (choice < cubeChance) {
         return this.cube();
      } else if (choice < stackChance) {
        return this.stack();
      } else {
        return this.blocky();
      }
    }

    this.cube = function(width, height) {
      const cubeHeightMin = 1;
      const cubeHeightMax = 2;
      const roofChance = 0.3;

      const geometry = baseBox.clone();

      const heightAddition = Math.random() * Math.random() * (cubeHeightMax - cubeHeightMin);
      geometry.applyMatrix(new THREE.Matrix4().makeScale(1, cubeHeightMin + heightAddition, 1));

      if (Math.random() < roofChance) {
        const roof = this.makeCap(geometry);
        geometry.merge(roof, roof.matrix);
      }

      return geometry;
    }

    this.blocky = function() {
      const blockAmount = Math.ceil(Math.random() * 2) + 2;
      const cubeHeightMin = 1;
      const cubeHeightMax = 3;

      const geometry = new THREE.Geometry();
      for (let blockNumber = 0; blockNumber < blockAmount; ++blockNumber) {
        const width = 0.1 + Math.random() * 0.9;
        const depth = 0.1 + Math.random() * 0.9;
        const height = Math.random() * (cubeHeightMax - cubeHeightMin);
        const box = baseBox.clone();
        box.applyMatrix(new THREE.Matrix4().makeScale(width, cubeHeightMin + height, depth));
        const xShift = Math.random() * (1-width) - (1-width)/2;
        const zShift = Math.random() * (1-depth) - (1-depth)/2;
        box.applyMatrix(new THREE.Matrix4().makeTranslation(xShift, 0, zShift));
        geometry.merge(box, box.matrix);
      }
      return geometry;
    }


    this.stack = function() {
      const stackAmount = Math.ceil(Math.random() * 3) + 1;
      const stackHeightMin = 0.7;
      const stackHeightMax = 1.5;

      const geometry = new THREE.Geometry();
      let lastSize = 1;
      let lastTop = 0;
      for (let stackNumber = 0; stackNumber < stackAmount; ++stackNumber) {
        const size = (1 - Math.random() * Math.random()) * lastSize;
        const height = Math.random() * (stackHeightMax - stackHeightMin);
        const box = baseBox.clone();
        box.applyMatrix(new THREE.Matrix4().makeScale(size, stackHeightMin + height, size));
        box.applyMatrix(new THREE.Matrix4().makeTranslation(0, lastTop, 0));
        if (stackNumber != stackAmount - 1) {
          const cap = this.makeCap(box);
          box.merge(cap, cap.matrix);
        }

        lastSize = size;
        box.computeBoundingBox();
        lastTop = box.boundingBox.max.y;
        geometry.merge(box, box.matrix);
      }
      return geometry;
    }

    this.makeCap = function(building) {
      const roofHeight = 0.01 + Math.random() * 0.1;
      const roofOverhang = Math.random() * 0.05;

      building.computeBoundingBox();
      const bbox = building.boundingBox;
      const size = building.boundingBox.getSize();
      const cube = baseBox.clone();
      cube.applyMatrix(new THREE.Matrix4().makeScale(size.x + roofOverhang*2, roofHeight, size.z + roofOverhang*2));

      const center = building.center();
      cube.applyMatrix(new THREE.Matrix4().makeTranslation(0, bbox.max.y, 0));

      for (let index = 0; index < cube.faces.length; ++index) {
        cube.faces[index].color = new THREE.Color().setRGB(0, 0, 0);
      }

      return cube;
    }
  }
}//buildings



export default City;
