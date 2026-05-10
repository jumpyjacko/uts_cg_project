import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

const width = 128;
const height = 128;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(width, height);
const loader = new GLTFLoader();

const views = [];

document.querySelectorAll('.three-dock-item').forEach((el) => {
    const action = el.dataset.action;
    const canvas = el.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = width;
    canvas.height = height;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10);
    camera.position.set(0, 0.5, 3);

    const sun = new THREE.DirectionalLight(0xffffff, 1);
    sun.position.set(1, 2, 3);
    sun.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(sun, new THREE.AmbientLight(0xffffff, 0.6));

    const view = { canvas, ctx, scene, camera, mesh: null }; 
    views.push(view);

    switch (action) {
        case 'tree':
            loadModel("./models/tree1.glb", view);
            break;
        case 'house':
            loadModel("./models/house4.glb", view);
            break;
        case 'lighthouse':
            loadModel("./models/lighthouse.glb", view);
            break;
        default:
    }
});

function animate() {
    requestAnimationFrame(animate);

    views.forEach(view => {
        const { ctx, scene, camera, mesh } = view;

        if (mesh) {
            mesh.rotation.y += 0.02;
        }

        renderer.render(scene, camera);
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(renderer.domElement, 0, 0);
    });
}

function loadModel(path, view) {
    loader.load(path, (gltf) => {
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.5 / maxDim;
        model.scale.setScalar(scale);

        model.position.x = -center.x * scale;
        model.position.y = -center.y * scale + 0.5;
        model.position.z = -center.z * scale;

        view.scene.add(model);
        view.mesh = model;
    });
}

animate();
