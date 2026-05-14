import * as THREE from 'three';

export const pickingState = new Proxy({
    activeItem: 'none',
}, {
    set(target, property, value) {
        target[property] = value;
        // console.log(`State changed: ${property} -> ${value}`);

        if (property === 'activeItem') {
            document.querySelectorAll("[data-action]").forEach((el) => {
                if (el.dataset.action === value) {
                    el.classList.add('outline-2', 'outline-offset-2', 'outline-blue-500');
                } else {
                    el.classList.remove('outline-2', 'outline-offset-2', 'outline-blue-500');
                }
            });
        }
        return true;
    }
});

export function setupPicking() {
    document.addEventListener('click', (e) => {
        const action = e.target.closest('[data-action]')?.dataset.action;

        if (action) {
            pickingState.activeItem = (pickingState.activeItem === action) ? null : action;
            // console.log(`Action triggered: ${pickingState.activeItem}`);
        }
    })
}

export function setupRaycast(world) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const markerGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.visible = false;
    world.add(marker);

    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // raycaster.setFromCamera(mouse, world.camera);
        // const intersects = raycaster.intersectObjects(world.scene.children, true);
        //
        // if (intersects.length > 0) {
        //     const hit = intersects[0];
        //
        //     if (hit.object !== marker) {
        //         marker.visible = true;
        //         marker.position.copy(hit.point);
        //     }
        // } else {
        //     marker.visible = false;
        // }
    });

    let mouseStartX = 0;
    let mouseStartY = 0;
    const moveThreshold = 5;
    window.addEventListener('mousedown', (event) => {
        mouseStartX = event.clientX;
        mouseStartY = event.clientY;
    });

    window.addEventListener('mouseup', (event) => {
        if (event.target.id !== 'main-view') {
            return;
        }

        const deltaX = Math.abs(event.clientX - mouseStartX);
        const deltaY = Math.abs(event.clientY - mouseStartY);

        if (deltaX < moveThreshold && deltaY < moveThreshold) {
            raycaster.setFromCamera(mouse, world.camera);
            const intersects = raycaster.intersectObjects(world.scene.children, true);

            if (intersects.length > 0) {
                const hit = intersects[0].object;

                let cell = hit.userData.parentCell;
                if (!cell) return;

                cell.interactStructure(world);
            }
        }
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === "r") {
            raycaster.setFromCamera(mouse, world.camera);
            const intersects = raycaster.intersectObjects(world.scene.children, true);

            if (intersects.length > 0) {
                const hit = intersects[0].object;

                let cell = hit.userData.parentCell;
                if (!cell) return;

                cell.rotateStructure();
            }
        }
    });

    return { raycaster, mouse, marker };
}
