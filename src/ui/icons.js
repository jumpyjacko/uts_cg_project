import * as THREE from 'three';

const width = 128;
const height = 128;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(width, height);

const views = [];

document.querySelectorAll('.dock-item').forEach((el) => {
    const canvas = el.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = width;
    canvas.height = height;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
    camera.position.z = 2;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x44aa88 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    scene.add(new THREE.AmbientLight(0xffffff, 1));

    views.push({ canvas, ctx, scene, camera, mesh });
});

function animate() {
    views.forEach(view => {
        const { ctx, scene, camera, mesh } = view;

        mesh.rotation.y += 0.02;

        renderer.render(scene, camera);

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(renderer.domElement, 0, 0);
    });

    requestAnimationFrame(animate);
}

animate();
