class Game {
    hyperparams = {
        GRAVITY: 15,
        velocity: 250,
        pipes_gap: 200,
        game_time: 0.0
    };

    stop_game = false;

    constructor(canvas_id) {
        this.c = $(canvas_id);
        this.renderer = new Renderer(this.c);

        this.bird = new Bird(this.hyperparams.GRAVITY);
        this.ground = new Ground(this.c);
        this.pipes = new Pipes(this.hyperparams.velocity);
    }

    initCanvas() {
        this.renderer.init();
        this.renderer.addSprite(this.bird);

        for (let i = 0; i < this.ground.sprites.length; ++i) {
            this.renderer.addSprite(this.ground.sprites[i]);
        }

        this.renderer.render();
    }

    addPipes() {
        const p = this.pipes.addPipes(this.c, this.hyperparams.pipes_gap, this.renderer.OBJECTS_POSITIONING, this.hyperparams.velocity);
        this.renderer.addSprite(p.north_pipe);
        this.renderer.addSprite(p.south_pipe);
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

            this.repositionGameObjects(delta_t / 1000);
            this.updateRenderer();
            this.renderer.render();

            if (this.endRound()) return;

            requestAnimationFrame(game_loop);
        };

        requestAnimationFrame(game_loop);
    }

    repositionGameObjects(dt) {
        this.bird.reposition(this.hyperparams.game_time);
        this.pipes.reposition(dt);
    }

    updateRenderer() {
        this.renderer.updateSprite(this.bird);
        this.renderer.updateGroupLayer(this.pipes.LAYER_GROUP, this.pipes.dx);
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
