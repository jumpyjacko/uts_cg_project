export function setupRenderPassList(world) {
    document.addEventListener('click', (e) => {
        if (!world.passes) return;
        const pass = e.target.closest('[data-pass]')?.dataset.pass;

        if (pass) {
            const target = world.passes.find(item => item.id === pass);
            if (target) {
                target.enabled = !target.enabled;
            }
            world.updateRenderPasses(world.passes);
        }
    })
}
