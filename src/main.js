import * as THREE from 'three';

import { World } from './world.js';
import { Terrain } from './terrain.js';
import { Sky } from './sky.js';
import { Ocean } from './ocean.js';
import { Clouds } from './clouds.js';
import { Birds } from './birds.js';
import { loadAssets } from './assets.js';
import { initTerrainPanel } from './ui/terrainPanel.js';
import { initTimePanel } from './ui/timePanel.js';
import { Stars } from './stars.js';

let world = new World(false); // true is enabling some debug renderers
await loadAssets();

// setup lighting and sky
let sky = new Sky();
world.add(sky.group);
world.addToUpdateTable(sky);

let stars = new Stars();
world.add(stars.group);
world.addToUpdateTable(stars);


//cloud setup
let clouds = new Clouds();
world.add(clouds.group);
world.addToUpdateTable(clouds);

// Island terrain and ocean
const terrain = new Terrain();
terrain.generate();
world.add(terrain.group);

const ocean = new Ocean();
world.add(ocean.mesh);
world.addToUpdateTable(ocean);

initTerrainPanel(terrain, ocean);
initTimePanel(world);

world.scene.fog = new THREE.FogExp2(0xffffff, 0.002);

let birds = new Birds(world);
world.add(birds.group);
world.addToUpdateTable(birds);
