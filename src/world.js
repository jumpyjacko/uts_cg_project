import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer, GLTFLoader, RenderPass, SAOPass, SMAAPass, UnrealBloomPass } from 'three/examples/jsm/Addons.js';
import { setupPicking, setupRaycast } from './picking.js';
import { setupRenderPassList } from './ui/list.js';

export class World {
    constructor(debug) {
        this.update_table = [];

        this.timer = new THREE.Timer();
        this.timer.connect(document);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color().setHSL(0.6, 0, 1);
        this.scene.fog = new THREE.Fog(this.scene.background, 1, 3500);

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 4000);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setAnimationLoop(() => this.animate());
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableZoom = true;
        this.controls.minDistance = 50;
        this.controls.maxDistance = 150;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
        this.controls.enablePan = false;
        this.controls.maxPolarAngle = (Math.PI / 2) - 0.1;

        // init post processing
        this.composer = new EffectComposer(this.renderer);
        this.renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(this.renderPass);

        this.passes = [];
        const resolution = new THREE.Vector2(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
        const saoPass = new SAOPass(this.scene, this.camera, true, true);
        saoPass.resolution = resolution;
        saoPass.params = {
            output: 0,
            saoBias: 0.5,
            saoIntensity: 0.006,
            saoScale: 17,
            saoKernelRadius: 50,
            saoMinResolution: 0,
            saoBlur: true,
            saoBlurRadius: 2,
            saoBlurStdDev: 4,
            saoBlurDepthCutoff: 0.01
        };
        this.passes.push({ id: "ao", pass: saoPass, enabled: true });

        const bloomPass = new UnrealBloomPass(resolution, 0.067, 0.8, 0.95);
        this.passes.push({ id: "bloom", pass: bloomPass, enabled: true });

        const smaaPass = new SMAAPass();
        this.passes.push({ id: "smaa", pass: smaaPass, enabled: true });

        this.updateRenderPasses(this.passes);
        setupRenderPassList(this);
        // end post processing

        document.body.appendChild(this.renderer.domElement);
        this.renderer.domElement.id = "main-view";

        this.camera.position.set(50, 50, 50);
        this.camera.lookAt(0, 0, 0);

        window.addEventListener('resize', this.onWindowResize.bind(this));

        if (debug) {
            this.scene.add(new THREE.AxesHelper(5));
        }

        setupPicking();
        this.raycast = setupRaycast(this);
    }

    async loadAssets() {
        const loadingScreen = document.getElementById('loading-screen');
        const progressBar = document.getElementById('progress-bar');

        const manager = new THREE.LoadingManager();
        const gltfLoader = new GLTFLoader(manager);

        manager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const progress = (itemsLoaded / itemsTotal) * 100;
            progressBar.style.width = progress + '%';
        };

        manager.onLoad = () => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 1000);
        };

        const treePaths = [
            "./models/tree1.glb",
            "./models/tree2.glb",
            "./models/tree3.glb",
            "./models/tree4.glb"
        ];
        const housePaths = [
            "./models/house1.glb",
            "./models/house2.glb",
            "./models/house3.glb",
            "./models/house4.glb"
        ];
        const [trees, houses, lighthouse, dock, bird] = await Promise.all([
            Promise.all(treePaths.map(path => gltfLoader.loadAsync(path))),
            Promise.all(housePaths.map(path => gltfLoader.loadAsync(path))),
            gltfLoader.loadAsync("./models/lighthouse.glb"),
            gltfLoader.loadAsync("./models/dock.glb"),
            gltfLoader.loadAsync("./models/bird.glb"),
        ]);

        this.assets = {
            trees: trees.map(gltf => gltf.scene),
            houses: houses.map(gltf => gltf.scene),
            lighthouse: lighthouse.scene,
            dock: dock.scene,
            bird: bird.scene,
        };

        console.log("Loaded assets: ", this.assets);
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

        this.composer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    remove(other) {
        this.scene.remove(other);

        const index = this.update_table.indexOf(other);
        if (index !== -1) {
            this.update_table.splice(index, 1);
        }
    }

    add(other) {
        this.scene.add(other);

        if (other.update) {
            this.addToUpdateTable(other);
        }
    }

    addToUpdateTable(other) {
        this.update_table.push(other);
    }

    updateRenderPasses(passes) {
        this.composer.dispose();
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(this.renderPass);

        for (const { pass, enabled } of passes) {
            if (!enabled) continue;
            this.composer.addPass(pass);
        }
    }
}


