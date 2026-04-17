import * as THREE from 'three';
import { World } from './world.js';

let world = new World(true); // true is enabling some debug renderers

// setup lighting and sky
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
hemiLight.color.setHex(0x7098FE);
hemiLight.groundColor.setHex(0xf7f9ff);
hemiLight.position.set(0, 50, 0);
world.add(hemiLight);

const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10); // debug
world.add(hemiLightHelper);

const spotlight = new THREE.SpotLight(0xffffff, 3);
spotlight.position.set(-1, 1.75, 1);
spotlight.position.multiplyScalar(20);
spotlight.power = 9001;
spotlight.angle = 70;
world.add(spotlight);

spotlight.castShadow = true;
spotlight.shadow.mapSize.width = 4096;
spotlight.shadow.mapSize.height = 4096;

const d = 50;
spotlight.shadow.camera.left = -d;
spotlight.shadow.camera.right = d;
spotlight.shadow.camera.top = d;
spotlight.shadow.camera.bottom = -d;
spotlight.shadow.camera.far = 3500;
spotlight.shadow.bias = -0.00;

const dirLightHelper = new THREE.SpotLightHelper(spotlight, 10); // debug
world.add(dirLightHelper);

// skydome
import skyVertShader from './shaders/skyDome.vert?raw';
import skyFragShader from './shaders/skyDome.frag?raw';
import { terrain } from './terrain.js';
const skyUniforms = {
    'topColor': { value: new THREE.Color(0x5078FE) },
    'bottomColor': { value: new THREE.Color(0xf7f9ff) },
    'offset': { value: 33 },
    'exponent': { value: 0.6 }
};
skyUniforms['topColor'].value.copy(hemiLight.color);
world.scene.fog.color.copy(skyUniforms['bottomColor'].value);
const skyGeo = new THREE.SphereGeometry(3500, 32, 15);
const skyMat = new THREE.ShaderMaterial({
    uniforms: skyUniforms,
    vertexShader: skyVertShader,
    fragmentShader: skyFragShader,
    side: THREE.BackSide
});
const sky = new THREE.Mesh(skyGeo, skyMat);
world.add(sky);

// Island terrain
terrain(world);

// test cube
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshStandardMaterial()
);
cube.position.set(0, 10, 0);
cube.castShadow = true;
world.add(cube);

