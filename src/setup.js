import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export class World {
    constructor() {
        this.timer = new THREE.Timer();
        this.timer.connect(document);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setAnimationLoop(() => this.animate());
        this.renderer.shadowMap.enabled = true;

        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.enableZoom = true;
        controls.minDistance = 2;
        controls.maxDistance = 50;
        controls.enableDamping = true;
        controls.dampingFactor = 0.5;
        controls.enablePan = false;

        document.body.appendChild(this.renderer.domElement);

        this.camera.position.set(0, 10, 5);

        window.addEventListener('resize', this.onWindowResize.bind(this) );
    }

    animate() {
        this.timer.update();
        this.render();
    }

    render() {
        // const delta = this.timer.getDelta();

        // for (let i = 0; i < mixers.length; i++) {
        //     mixers[i].update(delta);
        // }

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        console.log("window resized");
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    addMesh(mesh) {
        this.scene.add(mesh);
    }
}


