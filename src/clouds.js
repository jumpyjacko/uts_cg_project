import * as THREE from 'three';

const CLOUD_CONFIG = {
    count: 10,   // clouds in the ring
    radius: 100,   // ring radius around island centre
    height: 50,   // base height
    size: 8,    // base cloud size (puffs + count auto-randomise per cloud)
};

export class Clouds {
    constructor() {
        this.group = new THREE.Group();
        this.clouds = [];

        this.mat = new THREE.MeshStandardMaterial({
            color: 0xaaaaaa,
            brightness: 1.0,
            roughness: 1.0,
            metalness: 0.0,
        });

        this.create();
    }

    create() {
        const { count, radius, height, size } = CLOUD_CONFIG;

        const numGroups = 6;
        const groupAnchors = Array.from({ length: numGroups }, () => Math.random() * Math.PI * 2);

        for (let i = 0; i < count; i++) {
            const anchor = groupAnchors[i % numGroups];
            const jitter = (Math.random() - 0.5) * 1.5; // How spread out the clump is
            const angle = anchor + jitter;

            const radialOffset = (Math.random() - 0.5) * 40;
            const r = radius + radialOffset;

            const cx = Math.cos(angle) * r;
            const cz = Math.sin(angle) * r;

            const cy = height + (Math.random() - 0.5) * 20;
            const s = size * (0.7 + Math.random() * 0.8);

            const cloud = this._makeCloud(cx, cy, cz, s);
            this.clouds.push(cloud);
            this.group.add(cloud);
        }
    }

    _makeCloud(cx, cy, cz, size) {
        const cloud = new THREE.Group();
        const nPuffs = Math.round(7 + Math.random() * 9);

        const stretchX = 2.0 + Math.random() * 1.5;
        const squashY = 0.7;

        // Centre puff
        const centre = new THREE.Mesh(new THREE.SphereGeometry(size, 7, 7), this.mat);
        centre.castShadow = true;
        cloud.add(centre);

        for (let i = 0; i < nPuffs; i++) {
            const angle = (i / nPuffs) * Math.PI * 2;

            const dist = (0.3 + Math.random() * 0.8) * size;
            const puff = new THREE.Mesh(
                new THREE.SphereGeometry((0.4 + Math.random() * 0.45) * size, 7, 7),
                this.mat
            );
            puff.castShadow = true;

            puff.position.set(
                Math.cos(angle) * dist * stretchX,
                (-0.2 + Math.random() * 0.4) * size,
                Math.sin(angle) * dist * 0.8
            );
            cloud.add(puff);
        }

        cloud.position.set(cx, cy, cz);
        cloud.rotation.y = Math.random() * Math.PI * 2;

        cloud.scale.set(1, squashY, 1);

        cloud.userData.driftSpeed = 0.3 + Math.random() * 0.5;
        cloud.userData.driftOffset = Math.random() * Math.PI * 2;

        return cloud;
    }

    update(delta) {
        this.group.rotation.y += 0.008 * delta * 5;

        // subtle individual bob per cloud
        const t = performance.now() / 1000;
        this.clouds.forEach(cloud => {
            cloud.position.y += Math.sin(t * cloud.userData.driftSpeed + cloud.userData.driftOffset) * 0.05;
        });
    }
}
