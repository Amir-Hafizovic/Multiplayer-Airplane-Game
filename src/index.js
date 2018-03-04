import Scene from './scene';
import Airplane from './airplane';
import Colors from './colors'

import * as THREE from 'three';

const randomColor = function () {
  return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
}

//A socket.io instance
const socket = io();

//One WebGL context to rule them all !
let glScene = new Scene();
let id;
let instances = [];
let clients = new Object();

glScene.on('userMoved', () => {
  const newPosition = [
    glScene.camera.position.x,
    glScene.camera.position.y,
    glScene.camera.position.z
  ];
  const newRotation = [
    glScene.camera.rotation.x,
    glScene.camera.rotation.y,
    glScene.camera.rotation.z,
  ];
  console.log(newRotation);
  socket.emit('move', newPosition, newRotation);
});

//On connection server sends the client his ID
socket.on('introduction', (_id, _clientNum, _ids) => {
  // Create airplanes for other connected clients
  for(let i = 0; i < _ids.length; i++) {
    // if(_ids[i] != _id) {
      // const planeStartY = 200
      // const planeStartZ = 0
      let airplane = new Airplane(randomColor());
      airplane.mesh.scale.set(0.01, 0.01, 0.01);

      airplane.mesh.rotation.y = 1.5;


      clients[_ids[i]] = {
        airplane: airplane.mesh
      }

      //Add initial users to the scene
      glScene.scene.add(clients[_ids[i]].airplane);
      console.log(`ap X: ${airplane.mesh.rotation.x} ap Y: ${airplane.mesh.rotation.y} ap Z: ${airplane.mesh.rotation.z}`);
    // }
  }

  console.log(clients);

  id = _id;
  console.log('My ID is: ' + id);
  //airplane.propeller.rotation.x += 0.3;
});

socket.on('newUserConnected', (clientCount, _id, _ids) => {
  console.log(clientCount + ' clients connected');
  let alreadyHasUser = false;
  for(let i = 0; i < Object.keys(clients).length; i++){
    if(Object.keys(clients)[i] == _id){
      alreadyHasUser = true;
      break;
    }
  }
  if(_id != id && !alreadyHasUser) {
    console.log('A new user connected with the id: ' + _id);
    // const planeStartY = 200
    // const planeStartZ = 0
    let airplane = new Airplane(randomColor());
    airplane.mesh.scale.set(0.01, 0.01, 0.01);
    // airplane.mesh.position.y = 2000 + planeStartY
    clients[_id] = {
      airplane: airplane.mesh
    }

    //Add initial users to the scene
    glScene.scene.add(clients[_id].airplane);
    console.log(`ap X: ${airplane.mesh.rotation.x} ap Y: ${airplane.mesh.rotation.y} ap Z: ${airplane.mesh.rotation.z}`);
  }
  //airplane.propeller.rotation.x += 0.3
});

socket.on('userDisconnected', (clientCount, _id, _ids) => {
  //Update the data from the server
  // document.getElementById('numUsers').textContent = clientCount;

  if(_id != id) {
    console.log('A user disconnected with the id: ' + _id);
    glScene.scene.remove(clients[_id].airplane);
    delete clients[_id];
  }
});

socket.on('connect', ()=>{});

//Update when one of the users moves in space
// props sent contain position and rotation of the other users' camera
socket.on('userPositions', _clientProps => {
  for(let i = 0; i < Object.keys(_clientProps).length; i++) {
    if(Object.keys(_clientProps)[i] != id) {

      const currentProps = Object.keys(_clientProps)[i];

      //Store the values
      let oldPos = clients[currentProps].airplane.position;
      let oldRot = clients[currentProps].airplane.rotation;
      let newPos = _clientProps[currentProps].position;
      let newRot = _clientProps[currentProps].rotation;

      //Create a vector 3 and lerp the new values with the old values
      let lerpedPos = new THREE.Vector3();
      lerpedPos.x = THREE.Math.lerp(oldPos.x, newPos[0], 0.3);
      lerpedPos.y = THREE.Math.lerp(oldPos.y, newPos[1], 0.3);
      lerpedPos.z = THREE.Math.lerp(oldPos.z, newPos[2], 0.3);

      let lerpedRot = new THREE.Vector3();
      lerpedRot.x = THREE.Math.lerp(oldRot.x, newRot[0], 0.3);
      lerpedRot.y = THREE.Math.lerp(oldRot.y, newRot[1], 0.3);
      lerpedRot.z = THREE.Math.lerp(oldRot.z, newRot[2], 0.3);

      //Set the position and rotation
      clients[currentProps].airplane.position.set(lerpedPos.x, lerpedPos.y, lerpedPos.z);
      clients[currentProps].airplane.rotation.set(lerpedRot.x, lerpedRot.y, lerpedRot.z)
    }
  }
});
