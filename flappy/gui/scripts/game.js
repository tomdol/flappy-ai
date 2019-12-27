class Game {
    hyperparams = {
        GRAVITY: 15,
        game_time: 0.0
    };

    stop_game = false;

    constructor(canvas_id) {
        this.c = $(canvas_id);
        this.renderer = new Renderer(this.c);

        this.bird = new Bird(this.hyperparams.GRAVITY);
        this.ground = new Ground(this.c);
    }

    initCanvas() {
        this.renderer.init();
        this.renderer.addSprite(this.bird, 0.333);

        for (let i = 0; i < this.ground.sprites.length; ++i) {
            this.renderer.addSprite(this.ground.sprites[i]);
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
        let t = 0;
        requestAnimationFrame((time) => {
            t = time;
        });

        const game_loop = (time) => {
            const delta_t = time - t;
            t = time;

            this.hyperparams.game_time += delta_t / 1000;

            this.repositionGameObjects();
            this.updateRenderer();
            this.renderer.render();

            if (this.endRound()) return;

            requestAnimationFrame(game_loop);
        };

        requestAnimationFrame(game_loop);
    }

    repositionGameObjects() {
        this.bird.reposition(this.hyperparams.game_time);
    }

    updateRenderer() {
        this.renderer.updateSprite(this.bird, "player");
    }

    endRound() {
        const conditions = [
            this.userStoppedTheGame,
            this.birdHitTheGround
        ];

        return conditions.some(fn => {
            return fn.apply(this);
        });
    }

    userStoppedTheGame() {
        return this.stop_game;
    }

    birdHitTheGround() {
        return this.bird.bottom() >= this.ground.ground_level;
    }
}
