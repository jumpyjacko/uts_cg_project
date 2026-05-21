import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

export let assets = {};

export async function loadAssets() {
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

    assets = {
        trees: trees.map(gltf => gltf.scene),
        houses: houses.map(gltf => gltf.scene),
        lighthouse: lighthouse.scene,
        dock: dock.scene,
        bird: bird.scene,
    };

    console.log("Loaded assets: ", assets);
}
