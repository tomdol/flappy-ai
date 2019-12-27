class Game {
    hyperparams = {
        GRAVITY: 10
    };

    constructor(canvas_id) {
        this.c = $(canvas_id);
        this.renderer = new Renderer(this.c);

        this.bird = new Bird(this.hyperparams.GRAVITY);
        this.ground = new Ground(this.c);
    }

    initCanvas() {
        this.renderer.init();
        this.renderer.addSprite(this.bird, "player", 0.333);

        for (let i = 0; i < this.ground.sprites.length; ++i) {
            this.renderer.addSprite(this.ground.sprites[i], "ground" + i);
        }

        this.renderer.render();
    }

    addPipes() {
        const pipes = new PairOfPipes(this.c, 200, this.renderer.OBJECTS_POSITIONING);
        this.renderer.addSprite(pipes.north_pipe, "north_pipe");
        this.renderer.addSprite(pipes.south_pipe, "south_pipe");

        this.renderer.render();
    }

    start() {
        let t = 0;
        let game_time = 0;
        requestAnimationFrame((time) => {
            t = time;
        });

        let i = 0;

        const game_loop = (time) => {
            const delta_t = time - t;
            t = time;

            game_time += delta_t;

            if (++i > 100) return;

            this.bird.reposition(game_time / 1000);
            console.log(game_time, this.bird.y);
            this.renderer.updateSprite(this.bird, "player");
            this.renderer.render();
            requestAnimationFrame(game_loop);
        };

        requestAnimationFrame(game_loop);
    }
}
