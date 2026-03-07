import * as THREE from 'three';
import { World } from './world.js';

let world = new World(true); // true is enabling some debug renderers

// setup scene geometry
let geometry = new THREE.BoxGeometry(1, 1, 1);
let material = new THREE.MeshStandardMaterial({ color: 0xDDB565 });
let cube = new THREE.Mesh(geometry, material);

world.add(cube);
