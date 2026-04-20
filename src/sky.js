import * as THREE from 'three';

import skyVertShader from './shaders/skyDome.vert?raw';
import skyFragShader from './shaders/skyDome.frag?raw';

export class Sky {
    constructor(colour = 0x7098fe) {
        this.skyColour = colour;
        this.fogColour = 0xf7f9ff;

        this.create();
    }

    create() {
        this.group = new THREE.Group();

        // lighting
        const hemiLight = new THREE.HemisphereLight(this.skyColour, this.fogColour, 2);
        hemiLight.position.set(0, 50, 0);
        this.group.add(hemiLight);

        const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10); // debug
        this.group.add(hemiLightHelper);

        this.pivot = new THREE.Object3D();
        this.sun = new THREE.DirectionalLight(0xFFF9eb, 3);
        this.sun.intensity = 3;
        this.sun.position.set(0, 100, 0);
        this.sun.target = this.pivot;
        this.pivot.add(this.sun);
        this.group.add(this.pivot);

        const d = 50;
        this.sun.castShadow = true;
        this.sun.shadow.mapSize.width = 8192;
        this.sun.shadow.mapSize.height = 8192;
        this.sun.shadow.camera.left = -d;
        this.sun.shadow.camera.right = d;
        this.sun.shadow.camera.top = d;
        this.sun.shadow.camera.bottom = -d;
        this.sun.shadow.camera.far = 500;
        this.sun.shadow.bias = -0.00;

        this.spotlightHelper = new THREE.DirectionalLightHelper(this.sun, 10); // debug
        this.group.add(this.spotlightHelper);

        // skydome
        this.skyUniforms = {
            'topColor': { value: new THREE.Color(this.skyColour) },
            'bottomColor': { value: new THREE.Color(this.fogColour) },
            'offset': { value: 33 },
            'exponent': { value: 0.6 }
        };
        this.skyUniforms['topColor'].value.copy(hemiLight.color);
        const skyGeo = new THREE.SphereGeometry(200, 32, 15);
        const skyMat = new THREE.ShaderMaterial({
            uniforms: this.skyUniforms,
            vertexShader: skyVertShader,
            fragmentShader: skyFragShader,
            side: THREE.BackSide
        });
        const sky = new THREE.Mesh(skyGeo, skyMat);
        this.group.add(sky);


    }

    update(delta) {
        const sunWorldPosition = new THREE.Vector3();
        this.sun.getWorldPosition(sunWorldPosition);
        let dayFactor = sunWorldPosition.y / 100;

        let speed = dayFactor > 0 ? 0.05 : 0.5;
        this.sunAngle = (this.sunAngle || 0) + speed * delta;
        this.pivot.rotation.z = this.sunAngle;
        

        const noonSky = new THREE.Color(0x7098fe);
        const sunsetSky = new THREE.Color(0xffafa0);
        const nightSky = new THREE.Color(0x020205);
        const noonFog = new THREE.Color(0xf7f9ff);
        const nightFog = new THREE.Color(0x0a0a10);

        let finalSky = new THREE.Color();
        let finalFog = new THREE.Color();

        if (dayFactor > 0.05) {
            const lerpIn = (dayFactor - 0.05) / 0.95;
            finalSky.copy(sunsetSky).lerp(noonSky, lerpIn);
            finalFog.copy(nightFog).lerp(noonFog, dayFactor);
            this.sun.intensity = dayFactor * 4.0;
        } else if (dayFactor <= 0.05 && dayFactor > -0.1) {
            const lerpOut = (dayFactor + 0.1) / 0.2;
            finalSky.copy(nightSky).lerp(sunsetSky, lerpOut);
            finalFog.copy(nightFog);
            this.sun.intensity = Math.max(0.1, dayFactor * 4.0);
        } else {
            finalSky.copy(nightSky);
            finalFog.copy(nightFog);
            this.sun.intensity = 0.0;
        }

        // 4. Update Uniforms
        if (this.skyUniforms) {
            this.skyUniforms['topColor'].value.copy(finalSky);
            this.skyUniforms['bottomColor'].value.copy(finalFog);
        }

        if (this.spotlightHelper) {
            this.spotlightHelper.update();
        }
    }
}
