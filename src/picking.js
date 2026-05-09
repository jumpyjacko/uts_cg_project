export class PickingUI {
    constructor() {
        this.currentlyPicked = null;

        document.addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]')?.dataset.action;

            if (action) {
                console.log(`Action triggered: ${action}`);
            }
        })
    }

    eventHandler() {

    }
}
