class Game {
    constructor(canvas_id) {
        this.c = $(canvas_id);
        this.renderer = new Renderer(this.c);

        this.bird = new Bird();
    }

    initCanvas() {
        this.renderer.init();
        this.renderer.addSprite(this.bird, 0.333);
        this.renderer.render();
    }

    addPipes() {
        const p = new PairOfPipes(canvas, 100);
    }

    start() {
        this.renderer.render();
    }
}