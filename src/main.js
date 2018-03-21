import * as THREE from 'three';

import Scene from './scene';
import Airplane from './airplane';

const randomColor = function () {
  return `#${(0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6)}`;
};

// A socket.io instance
// eslint-disable-next-line no-undef
const socket = io();

// One WebGL context to rule them all!
const glScene = new Scene();
window.scene = glScene;
let id;
const clients = {};


glScene.on('userMoved', () => {
  const newPosition = [
    glScene.camera.position.x,
    glScene.camera.position.y,
    glScene.camera.position.z,
  ];
  const newRotation = [
    glScene.camera.rotation.x,
    glScene.camera.rotation.y,
    glScene.camera.rotation.z,
  ];

  socket.emit('move', newPosition, newRotation);
});

// On connection server sends the client his ID
socket.on('introduction', (_id, _clientNum, _ids) => {
  // Create airplanes for other connected clients
  for (let i = 0; i < _ids.length; i++) {
    const airplane = new Airplane(randomColor());

    clients[_ids[i]] = {
      airplane: airplane.mesh,
    };

    // Add initial users to the scene
    if (_ids[i] === _id) {
      window.airplane = clients[_ids[i]].airplane;
      // This model is for the current user/current browser,
      // So add it as a child of the camera
      glScene.camera.add(clients[_ids[i]].airplane);
      glScene.camera.rotation.x = 0.1 * Math.PI;
      glScene.camera.rotation.y = 1.2 * Math.PI;
      glScene.camera.position.y = 100;
      glScene.camera.position.z = -100;
      glScene.camera.position.x = -100;

      clients[_ids[i]].airplane.position.z -= 2.2;
      clients[_ids[i]].airplane.position.y -= 0.5;

      glScene.scene.add(glScene.camera);
      window.camera = glScene.camera;
      console.log(airplane);
    }
    else {
      // Add model for *other* players to the scene
      console.log('clients', clients[_ids[i]].airplane.rotation);
      clients[_ids[i]].airplane.position.z += (i * 2);
      glScene.scene.add(clients[_ids[i]].airplane);
      clients[_ids[i]].airplane.name = 'airplane-enemy';
    }
  }

  console.log(clients);

  id = _id;
  console.log(`My ID is: ${id}`);
});

socket.on('newUserConnected', (clientCount, _id) => {
  console.log(`${clientCount} clients connected`);
  let alreadyHasUser = false;
  for (let i = 0; i < Object.keys(clients).length; i++) {
    if (Object.keys(clients)[i] === _id) {
      alreadyHasUser = true;
      break;
    }
  }
  if (_id !== id && !alreadyHasUser) {
    console.log(`A new user connected with the id: ${_id}`);

    const airplane = new Airplane(randomColor());
    airplane.mesh.name = 'airplane-enemy';
    clients[_id] = {
      airplane: airplane.mesh,
    };

    // Add initial users to the scene
    glScene.scene.add(clients[_id].airplane);
  }
});

socket.on('userDisconnected', (clientCount, _id) => {
  // Update the data from the server
  if (_id !== id) {
    console.log(`A user disconnected with the id: ${_id}`);
    glScene.scene.remove(clients[_id].airplane);
    delete clients[_id];
  }
});

socket.on('connect', () => {});
// Update when one of the users moves in space
// Props sent contain position and rotation of the other users' camera
socket.on('userPositions', _clientProps => {
  for (let i = 0; i < Object.keys(_clientProps).length; i++) {
    if (Object.keys(_clientProps)[i] !== id) {
      const currentProps = Object.keys(_clientProps)[i];

      // Store the values
      const oldPos = clients[currentProps].airplane.position;
      const oldRot = clients[currentProps].airplane.rotation;
      const newPos = _clientProps[currentProps].position;
      const newRot = _clientProps[currentProps].rotation;

      // Create a vector 3 and lerp the new values with the old values
      const lerpedPos = new THREE.Vector3();
      lerpedPos.x = THREE.Math.lerp(oldPos.x, newPos[0], 0.3);
      lerpedPos.y = THREE.Math.lerp(oldPos.y, newPos[1], 0.3);
      lerpedPos.z = THREE.Math.lerp(oldPos.z, newPos[2], 0.3);

      const lerpedRot = new THREE.Vector3();
      lerpedRot.x = THREE.Math.lerp(oldRot.x, newRot[0], 0.3);
      lerpedRot.y = THREE.Math.lerp(oldRot.y, newRot[1], 0.3);
      lerpedRot.z = THREE.Math.lerp(oldRot.z, newRot[2], 0.3);

      // Set the position and rotation
      clients[currentProps].airplane.position.set(lerpedPos.x, lerpedPos.y, lerpedPos.z);
      clients[currentProps].airplane.rotation.set(lerpedRot.x, lerpedRot.y, lerpedRot.z);
    }
  }
});
