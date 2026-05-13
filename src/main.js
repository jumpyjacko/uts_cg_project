import * as THREE from 'three';

import { World } from './world.js';
import { terrain } from './terrain.js';
import { Sky } from './sky.js';
import { Clouds } from './clouds.js';

let world = new World(true); // true is enabling some debug renderers
await world.loadAssets();

// setup lighting and sky
let sky = new Sky();
world.add(sky.group);
world.addToUpdateTable(sky);

//cloud setup
let clouds = new Clouds();
world.add(clouds.group);
world.addToUpdateTable(clouds);

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

let birdModel = world.assets.bird.clone() // <- this is where the bird model is stored
birdModel.position.y = 20; // e.g. work with bird as if it were any other THREEjs mesh

birdModel.update = (delta) => {
  // stuff to animate bird here, gets called every frame
  birdModel.position.z += 1 * delta;
}
world.add(birdModel);
world.addToUpdateTable(birdModel);
