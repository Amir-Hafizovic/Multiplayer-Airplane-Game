# THREE.js Multiplayer Airplane Game


A Node.js server and client setup with Three.js using Socket.io

## Usage
Use ```npm run start``` to start the server and bundler

The start script launches:
- ```nodemon``` Which restarts the server on every change (port: 1989)
- ```watchify``` Which bundles the client code from ```src/``` on every change to ```./public/js/bundle.js```

You can also run ```npm run build``` to bundle and minify the client code to ```./public/js/bundle.min.js```


On connection each client receives it's unique ID and on every movement broadcasts to all the other clients all the locations of everyone connected

Browserify is setup to transform both ES6 Javascript and ```glslify``` for GLSL shader bundling

#### This projects uses some elements of the following

* THREE Multiplayer boilerplate https://github.com/juniorxsound/THREE-Multiplayer
* model plane from https://github.com/14islands/aeronaut
