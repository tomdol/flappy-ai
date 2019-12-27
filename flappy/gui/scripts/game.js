class Game {
    constructor(canvas_id) {
        this.c = $(canvas_id);
        this.renderer = new Renderer(this.c);

        this.bird = new Bird();
        this.ground = new Ground(this.c);
    }

    initCanvas() {
        this.renderer.init();
        this.renderer.addSprite(this.bird, 0.333);

        for (let s of this.ground.sprites) {
            this.renderer.addSprite(s);
        }

        this.renderer.render();
    }

    addPipes() {
        const pipes = new PairOfPipes(this.c, 200, this.renderer.OBJECTS_POSITIONING);
        this.renderer.addSprite(pipes.north_pipe);
        this.renderer.addSprite(pipes.south_pipe);

        this.renderer.render();
    }

    start() {
        this.renderer.render();
    }
}
