import * as THREE from 'three';

import skyVertShader from './shaders/skyDome.vert?raw';
import skyFragShader from './shaders/skyDome.frag?raw';

export class Sky {
    constructor(colour = 0x7098fe) {
        this.sky_colour = colour;
        this.fog_colour = 0xf7f9ff;

        this.create();

        return this.group;
    }

    create() {
        this.group = new THREE.Group();

        // lighting
        const hemiLight = new THREE.HemisphereLight(this.sky_colour, this.fog_colour, 2);
        hemiLight.position.set(0, 50, 0);
        this.group.add(hemiLight);

        const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10); // debug
        this.group.add(hemiLightHelper);

        const spotlight = new THREE.SpotLight(0xFFF9FF, 3);
        spotlight.position.set(-1, 1.75, 1);
        spotlight.position.multiplyScalar(30);
        spotlight.power = 17000;
        spotlight.angle = 70;
        this.group.add(spotlight);

        const d = 50;
        spotlight.castShadow = true;
        spotlight.shadow.mapSize.width = 8192;
        spotlight.shadow.mapSize.height = 8192;
        spotlight.shadow.camera.left = -d;
        spotlight.shadow.camera.right = d;
        spotlight.shadow.camera.top = d;
        spotlight.shadow.camera.bottom = -d;
        spotlight.shadow.camera.far = 500;
        spotlight.shadow.bias = -0.00;

        const spotlightHelper = new THREE.SpotLightHelper(spotlight, 10); // debug
        this.group.add(spotlightHelper);

        // skydome
        const skyUniforms = {
            'topColor': { value: new THREE.Color(this.sky_colour) },
            'bottomColor': { value: new THREE.Color(this.fog_colour) },
            'offset': { value: 33 },
            'exponent': { value: 0.6 }
        };
        skyUniforms['topColor'].value.copy(hemiLight.color);
        const skyGeo = new THREE.SphereGeometry(200, 32, 15);
        const skyMat = new THREE.ShaderMaterial({
            uniforms: skyUniforms,
            vertexShader: skyVertShader,
            fragmentShader: skyFragShader,
            side: THREE.BackSide
        });
        const sky = new THREE.Mesh(skyGeo, skyMat);
        this.group.add(sky);


    }

    update(delta) {
    }
}
