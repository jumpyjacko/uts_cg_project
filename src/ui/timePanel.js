let paused = false;

export function initTimePanel(world) {
    const pauseBtn = document.getElementById('pause-btn');

    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            paused = !paused;

            if (paused) {
                world.timer.setTimescale(0);
            } else {
                world.timer.setTimescale(1);
            }
        })
    }
}
