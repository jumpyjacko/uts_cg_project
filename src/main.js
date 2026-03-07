import * as THREE from 'three';
import { World } from './setup.js';

let world = new World();

// setup scene geometry
let geometry = new THREE.BoxGeometry(1, 1, 1);
let material = new THREE.MeshBasicMaterial({ color: 0xDDB565 });
let cube = new THREE.Mesh(geometry, material);
world.addMesh(cube);

world.render();
