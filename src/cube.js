import * as THREE from 'three';

function v(scope, x, y, z) {
  scope.vertices.push(new THREE.Vertex(new THREE.Vector3(x, y, z)));
}

function f4(scope, a, b, c, d) {
  scope.faces.push(new THREE.Face4(a, b, c, d));
}

const Cube = function (width, height, depth) {
  THREE.Geometry.call(this);

  const scope = this;
  const widthHalf = width / 2;
  const heightHalf = height / 2;
  const depthHalf = depth / 2;

  v(scope, widthHalf, heightHalf, -depthHalf);
  v(scope, widthHalf, -heightHalf, -depthHalf);
  v(scope, -widthHalf, -heightHalf, -depthHalf);
  v(scope, -widthHalf, heightHalf, -depthHalf);
  v(scope, widthHalf, heightHalf, depthHalf);
  v(scope, widthHalf, -heightHalf, depthHalf);
  v(scope, -widthHalf, -heightHalf, depthHalf);
  v(scope, -widthHalf, heightHalf, depthHalf);

  f4(scope, 0, 1, 2, 3);
  f4(scope, 4, 7, 6, 5);
  f4(scope, 0, 4, 5, 1);
  f4(scope, 1, 5, 6, 2);
  f4(scope, 2, 6, 7, 3);
  f4(scope, 4, 0, 3, 7);
};

Cube.prototype = new THREE.Geometry();
Cube.prototype.constructor = Cube;


export default Cube;
