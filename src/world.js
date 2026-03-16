import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export class World {
    constructor(debug) {
        this.update_table = [];

        this.timer = new THREE.Timer();
        this.timer.connect(document);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color().setHSL(0.6, 0, 1);
        this.scene.fog = new THREE.Fog(this.scene.background, 1, 3500);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 4000);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setAnimationLoop(() => this.animate());
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableZoom = true;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 100;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
        this.controls.enablePan = false;

        document.body.appendChild(this.renderer.domElement);

        this.camera.position.set(10, 5, 5);
        this.camera.lookAt(0, 0, 0);

        window.addEventListener('resize', this.onWindowResize.bind(this));

        if (debug) {
            this.scene.add(new THREE.AxesHelper(5));
        }
    }

    animate() {
        this.timer.update();
        this.controls.update();
        this.render();
    }

    render() {
        const delta = this.timer.getDelta();

        for (const object of this.update_table) {
            object.update(delta);
        }

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    add(other) {
        this.scene.add(other);

        if (other.update) {
            this.update_table.push(other);
        }
    }
}


