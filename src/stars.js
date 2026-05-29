import * as THREE from 'three';
import { rawHeight } from './sky';

export class Stars {
    constructor(count = 1500, radius = 195) { // radius from skydome
        this.count = count;
        this.radius = radius;

        this.create();
    }

    create() {
        this.group = new THREE.Group();

        const positions = new Float32Array(this.count * 3);

        for (let i = 0; i < this.count; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);

            const x = this.radius * Math.sin(phi) * Math.cos(theta);
            const y = this.radius * Math.sin(phi) * Math.sin(theta);
            const z = this.radius * Math.cos(phi);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        this.material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: THREE.MathUtils.randFloat(0.5, 2.0),
            transparent: true,
            opacity: 0,                // invisible by default (daytime)
            depthWrite: false,
            sizeAttenuation: true
        });

        this.points = new THREE.Points(geometry, this.material);
        this.points.layers.set(1); // exclude from outline pass
        this.group.add(this.points);
    }

    update(delta) {
        const dayThreshold = 0.2;
        const nightThreshold = -0.1;

        if (rawHeight >= dayThreshold) {
            this.material.opacity = 0;
        } else if (rawHeight <= nightThreshold) {
            this.material.opacity = 1;
        } else {
            const factor = (dayThreshold - rawHeight) / (dayThreshold - nightThreshold);
            this.material.opacity = factor;
        }

        this.group.rotation.y += 0.005 * delta;
    }
}
