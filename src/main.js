import * as THREE from 'three';
import { World } from './world.js';

let world = new World(true); // true is enabling some debug renderers

// setup lighting and sky
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
hemiLight.color.setHex(0x5078FE);
hemiLight.groundColor.setHex(0xf7f9ff);
hemiLight.position.set(0, 50, 0);
world.add(hemiLight);

const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10); // debug
world.add(hemiLightHelper);

const dirLight = new THREE.DirectionalLight(0xffffff, 3);
dirLight.color.setHSL(0.1, 1, 0.95);
dirLight.position.set(-1, 1.75, 1);
dirLight.position.multiplyScalar(30);
world.add(dirLight);

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

const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10); // debug
world.add(dirLightHelper);

// skydome
import skyVertShader from './shaders/skyDome.vert?raw';
import skyFragShader from './shaders/skyDome.frag?raw';
const skyUniforms = {
    'topColor': { value: new THREE.Color(0x5078FE) },
    'bottomColor': { value: new THREE.Color(0xf7f9ff) },
    'offset': { value: 33 },
    'exponent': { value: 0.6 }
};
skyUniforms['topColor'].value.copy(hemiLight.color);
world.scene.fog.color.copy(skyUniforms['bottomColor'].value);
const skyGeo = new THREE.SphereGeometry(4000, 32, 15);
const skyMat = new THREE.ShaderMaterial({
    uniforms: skyUniforms,
    vertexShader: skyVertShader,
    fragmentShader: skyFragShader,
    side: THREE.BackSide
});
const sky = new THREE.Mesh(skyGeo, skyMat);
world.add(sky);

// setup scene geometry
let cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xDDB565 }),
);
world.add(cube);

let spinning_cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xaee8ad }),
);
spinning_cube.position.set(0, 2, 0);
spinning_cube.rotateOnAxis(new THREE.Vector3(1, 1, 0), Math.PI/2);
spinning_cube.update = function(delta) {
    spinning_cube.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), delta * 0.8);
}
world.add(spinning_cube);

