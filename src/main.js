import * as THREE from 'three';

import { World } from './world.js';
import { terrain } from './terrain.js';
import { Sky } from './sky.js';

let world = new World(true); // true is enabling some debug renderers

// setup lighting and sky
let sky = new Sky();
world.add(sky);

// Island terrain
terrain(world);
const oceanGeo = new THREE.PlaneGeometry(500, 500, 1, 1);
const oceanMat = new THREE.MeshStandardMaterial({
    color: 0x0000ff,
});
const ocean = new THREE.Mesh(oceanGeo, oceanMat);
ocean.rotateX(-Math.PI / 2);
ocean.position.set(0, 0.3, 0);
world.add(ocean);


// test cube
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshStandardMaterial()
);
cube.position.set(0, 10, 0);
cube.castShadow = true;
world.add(cube);

