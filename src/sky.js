import * as THREE from 'three';

import skyVertShader from './shaders/skyDome.vert?raw';
import skyFragShader from './shaders/skyDome.frag?raw';

export class Sky {
    constructor(colour = 0x7098fe) {
        this.sky_colour = colour;
        this.fog_colour = 0xf7f9ff;

        this.create();
    }

    create() {
        this.group = new THREE.Group();

        // lighting
        const hemiLight = new THREE.HemisphereLight(this.sky_colour, this.fog_colour, 2);
        hemiLight.position.set(0, 50, 0);
        this.group.add(hemiLight);

        const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10); // debug
        this.group.add(hemiLightHelper);

        this.pivot = new THREE.Object3D();
        const dirLight = new THREE.DirectionalLight(0xFFF9eb, 3);
        dirLight.intensity = 5;
        dirLight.position.set(0, 100, 0);
        dirLight.target = this.pivot;
        this.pivot.add(dirLight);
        this.group.add(this.pivot);

        const d = 50;
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 8192;
        dirLight.shadow.mapSize.height = 8192;
        dirLight.shadow.camera.left = -d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = -d;
        dirLight.shadow.camera.far = 500;
        dirLight.shadow.bias = -0.00;

        this.spotlightHelper = new THREE.DirectionalLightHelper(dirLight, 10); // debug
        this.group.add(this.spotlightHelper);

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
        this.pivot.rotation.z += 0.1 * delta;
        
        if (this.spotlightHelper) {
            this.spotlightHelper.update();
        }
    }
}
