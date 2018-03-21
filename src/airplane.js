import * as THREE from 'three';
import Colors from './colors';

class AirPlane {
  constructor(color) {
    this.mesh = new THREE.Object3D();

    // Create the cabin
    const geomCockpitTail = new THREE.BoxGeometry(130, 40, 40, 1, 1, 1);
    const matCockpitTail = new THREE.MeshPhongMaterial({ color, flatShading: THREE.FlatShading });

    // We can access a specific vertex of a shape through
    // The vertices array, and then move its x, y and z property:
    geomCockpitTail.vertices[4].y -= 10;
    geomCockpitTail.vertices[4].z += 20;
    geomCockpitTail.vertices[5].y -= 10;
    geomCockpitTail.vertices[5].z -= 20;
    geomCockpitTail.vertices[6].y += 30;
    geomCockpitTail.vertices[6].z += 20;
    geomCockpitTail.vertices[7].y += 30;
    geomCockpitTail.vertices[7].z -= 20;

    const cockpitTail = new THREE.Mesh(geomCockpitTail, matCockpitTail);
    cockpitTail.castShadow = true;
    cockpitTail.receiveShadow = true;
    cockpitTail.position.set(-75, 0, 0);
    this.mesh.add(cockpitTail);

    const geomCockpit = new THREE.BoxGeometry(40, 40, 40, 1, 1, 1);
    const matCockpit = new THREE.MeshPhongMaterial({ color, flatShading: THREE.FlatShading });
    const cockpit = new THREE.Mesh(geomCockpit, matCockpit);
    cockpit.castShadow = true;
    cockpit.receiveShadow = true;
    cockpit.position.set(10, 0, 0);
    this.mesh.add(cockpit);

    // Create the engine
    const geomEngine = new THREE.BoxGeometry(20, 40, 40, 1, 1, 1);
    const matEngine = new THREE.MeshPhongMaterial({
      color: Colors.white,
      flatShading: THREE.FlatShading,
    });
    const engine = new THREE.Mesh(geomEngine, matEngine);
    engine.position.x = 40;
    engine.castShadow = true;
    engine.receiveShadow = true;
    this.mesh.add(engine);

    // Create bottom wing
    const geomBottomWing = new THREE.BoxGeometry(40, 2, 200, 1, 1, 1);
    const matBottomWing = new THREE.MeshPhongMaterial({ color, flatShading: THREE.FlatShading });
    const bottomWing = new THREE.Mesh(geomBottomWing, matBottomWing);
    bottomWing.castShadow = true;
    bottomWing.receiveShadow = true;
    bottomWing.position.set(10, -10, 0);
    this.mesh.add(bottomWing);

    // Create the tail
    const geomTailPlane = new THREE.BoxGeometry(30, 25, 2, 1, 1, 1);
    const matTailPlane = new THREE.MeshPhongMaterial({ color, flatShading: THREE.FlatShading });
    const tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
    tailPlane.position.set(-115, 20, 0);
    tailPlane.castShadow = true;
    tailPlane.receiveShadow = true;
    this.mesh.add(tailPlane);

    // Create the tail wing
    const geomTailWing = new THREE.BoxGeometry(20, 2, 60, 1, 1, 1);
    const matTailWing = new THREE.MeshPhongMaterial({ color, flatShading: THREE.FlatShading });
    const tailWing = new THREE.Mesh(geomTailWing, matTailWing);
    tailWing.castShadow = true;
    tailWing.receiveShadow = true;
    tailWing.position.set(-110, 11, 0);
    this.mesh.add(tailWing);

    // Create the propeller
    const geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
    geomPropeller.vertices[4].y -= 5;
    geomPropeller.vertices[4].z += 5;
    geomPropeller.vertices[5].y -= 5;
    geomPropeller.vertices[5].z -= 5;
    geomPropeller.vertices[6].y += 5;
    geomPropeller.vertices[6].z += 5;
    geomPropeller.vertices[7].y += 5;
    geomPropeller.vertices[7].z -= 5;
    const matPropeller = new THREE.MeshPhongMaterial({
      color: Colors.brown,
      flatShading: THREE.FlatShading,
    });
    this.propeller = new THREE.Mesh(geomPropeller, matPropeller);

    this.propeller.castShadow = true;
    this.propeller.receiveShadow = true;

    const geomBlade = new THREE.BoxGeometry(1, 80, 10, 1, 1, 1);
    const matBlade = new THREE.MeshPhongMaterial({
      color: Colors.brownDark,
      flatShading: THREE.FlatShading,
    });
    const blade1 = new THREE.Mesh(geomBlade, matBlade);
    blade1.position.set(8, 0, 0);

    blade1.castShadow = true;
    blade1.receiveShadow = true;

    const blade2 = blade1.clone();
    blade2.rotation.x = Math.PI / 2;

    blade2.castShadow = true;
    blade2.receiveShadow = true;

    this.propeller.add(blade1);
    this.propeller.add(blade2);
    this.propeller.position.set(50, 0, 0);
    this.mesh.add(this.propeller);

    // Change rotation order to avoid gimbal lock
    this.mesh.rotation.order = 'XYZ';
    this.mesh.rotation.y = 0.5 * Math.PI;
    this.mesh.scale.set(0.01, 0.01, 0.01);
  }
}

export default AirPlane;
