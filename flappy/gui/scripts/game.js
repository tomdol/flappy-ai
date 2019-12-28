class Game {
    // game hyperparams - constant during a round/level
    hyperparams = {
        GRAVITY: 500,
        FLAP_ENERGY_REDUCTION_COEFF: 8000,
        FLAP_ENERGY_QUANT: 2000,
        velocity: 250, // horizontal velocity of the world
        pipes_gap: 200,
        pipes_frequency: 3, // number of seconds between new pipes are added
        game_time: 0.0
    };

    stop_game = false;
    add_energy = false;
    flap_energy = 0;

    constructor(canvas_id) {
        this.c = $(canvas_id);
        this.renderer = new Renderer(this.c);

        this.bird = new Bird(this.hyperparams.GRAVITY);
        this.ground = new Ground(this.c, this.hyperparams.velocity);
        this.pipes = new Pipes(this.hyperparams.velocity);
    }

    initCanvas() {
        this.renderer.init();
        this.renderer.addSprite(this.bird);

        for (let i = 0; i < this.ground.blocks.length; ++i) {
            this.renderer.addSprite(this.ground.blocks[i]);
        }

        this.renderer.render();
    }

    addPipes() {
        const p = this.pipes.addPipes(this.c, this.ground.ground_level, this.hyperparams.pipes_gap,
            this.renderer.OBJECTS_POSITIONING, this.hyperparams.velocity);

        this.renderer.addSprite(p.north_pipe);
        this.renderer.addSprite(p.south_pipe);
    }

    flap() {
        this.add_energy = true;
    }

    start() {
        let t = 0;
        requestAnimationFrame((time) => {
            t = time;
        });

        let time_to_add_pipes = this.hyperparams.pipes_frequency;

        const game_loop = (time) => {
            // time between the frames
            const delta_t = (time - t) / 1000;
            t = time;

            this.hyperparams.game_time += delta_t;

            this.updateFlapEnergy(delta_t);
            this.repositionGameObjects(delta_t);
            this.reduceFlapEnergy(delta_t);
            this.updateRenderer();

            if (this.hyperparams.game_time >= time_to_add_pipes) {
                this.addPipes();
                time_to_add_pipes += this.hyperparams.pipes_frequency;
            }

            this.renderer.render();

            if (this.endRound()) return;

            requestAnimationFrame(game_loop);
        };

        requestAnimationFrame(game_loop);
    }

    updateFlapEnergy() {
        if (this.add_energy) {
            this.flap_energy += this.hyperparams.FLAP_ENERGY_QUANT;

            if (this.bird.velocity > 0) {
                this.bird.velocity = 0;
            }
            this.add_energy = false;
        }
    }

    repositionGameObjects(dt) {
        this.bird.reposition(dt, this.flap_energy);

        this.pipes.reposition(dt);

        const added_block = this.ground.reposition(dt);
        if (added_block) {
            this.renderer.addSprite(added_block);
        }
    }

    reduceFlapEnergy(dt) {
        if (this.flap_energy > 0) {
            const dE = this.hyperparams.FLAP_ENERGY_REDUCTION_COEFF * dt;
            this.flap_energy -= dE;
            this.flap_energy = Math.max(this.flap_energy, 0);
        }
    }

    updateRenderer() {
        this.renderer.updateSprite(this.bird);
        this.renderer.updateGroupLayer(this.pipes.LAYER_GROUP, this.pipes.dx);
        this.renderer.updateGroupLayer(this.ground.LAYER_GROUP, this.ground.dx);
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
