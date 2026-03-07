import * as THREE from 'three';
import { World } from './world.js';

let world = new World(true); // true is enabling some debug renderers

// setup lighting and sky
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
hemiLight.color.setHex(0x5078FE);
hemiLight.groundColor.setHex(0x000000);
hemiLight.position.set(0, 50, 0);
world.add(hemiLight);

const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
world.add(hemiLightHelper);

const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
dirLight.color.setHSL( 0.1, 1, 0.95 );
dirLight.position.set( - 1, 1.75, 1 );
dirLight.position.multiplyScalar( 30 );
world.add( dirLight );

dirLight.castShadow = true;

dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;

const d = 50;

dirLight.shadow.camera.left = - d;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = - d;

dirLight.shadow.camera.far = 3500;
dirLight.shadow.bias = - 0.0001;

const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 10 );
world.add( dirLightHelper );

// setup scene geometry
let geometry = new THREE.BoxGeometry(1, 1, 1);
let material = new THREE.MeshStandardMaterial({ color: 0xDDB565 });
let cube = new THREE.Mesh(geometry, material);

world.add(cube);
