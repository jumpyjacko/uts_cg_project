import * as THREE from 'three';

import { World } from './world.js';
import { terrain } from './terrain.js';
import { Sky } from './sky.js';
import { PickingUI } from './picking.js';

let world = new World(true); // true is enabling some debug renderers

let picking = new PickingUI();

// setup lighting and sky
let sky = new Sky();
world.add(sky.group);
world.addToUpdateTable(sky);

// Island terrain
terrain(world);
const oceanGeo = new THREE.PlaneGeometry(500, 500, 1, 1);
const oceanMat = new THREE.MeshStandardMaterial({
    color: 0x124559,
});
const ocean = new THREE.Mesh(oceanGeo, oceanMat);
ocean.rotateX(-Math.PI / 2);
ocean.position.set(0, 0.3, 0);
world.add(ocean);

world.scene.fog = new THREE.FogExp2(0xffffff, 0.002);
