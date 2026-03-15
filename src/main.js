import * as THREE from 'three';
import { World } from './world.js';

import { Perlin } from './noise.js';

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

// Island terrain
let perlin = new Perlin();

export function drawPerlinToCanvas(canvas, scale = 0.01) {
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const img = ctx.createImageData(width, height);
    const data = img.data;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let n = perlin.get(x * scale, y * scale) +
                perlin.get(x * (scale*2), y * (scale*2));

            // convert -1..1 → 0..255
            let v = Math.floor((n + 1) * 0.5 * 255);

            let i = (y * width + x) * 4;

            data[i] = v;
            data[i + 1] = v;
            data[i + 2] = v;
            data[i + 3] = 255;
        }
    }

    ctx.putImageData(img, 0, 0);
}

const canvas = document.createElement("canvas");
drawPerlinToCanvas(canvas);
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(canvas),
    }),
)
plane.position.set(0, 0, 0);
world.add(plane);
