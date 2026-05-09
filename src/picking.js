export const pickingState = new Proxy({
    activeItem: 'none',
}, {
    set(target, property, value) {
        target[property] = value;
        console.log(`State changed: ${property} -> ${value}`);
        return true;
    }
});

export function setupPicking() {
    document.addEventListener('click', (e) => {
        const action = e.target.closest('[data-action]')?.dataset.action;

        if (action) {
            pickingState.activeItem = action;
            console.log(`Action triggered: ${pickingState.activeItem}`);
        }
    })
}
