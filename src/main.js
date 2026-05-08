import * as THREE from 'three';

import { World } from './world.js';
import { terrain } from './terrain.js';
import { Sky } from './sky.js';
import { Ocean } from './ocean.js';

let world = new World(true); // true is enabling some debug renderers

// setup lighting and sky
let sky = new Sky();
world.add(sky.group);
world.addToUpdateTable(sky);

// Island terrain
terrain(world);
const ocean = new Ocean();
world.add(ocean.mesh);
world.addToUpdateTable(ocean);

world.scene.fog = new THREE.FogExp2(0xffffff, 0.002);