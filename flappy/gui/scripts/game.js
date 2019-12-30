class Game extends EventTarget {
    constants = Object.freeze({
        level_time: 5000,
        gravity_increase: 25,
        velocity_increase: 25,
        pipe_gap_shrink: 10
    });
    // game hyperparams - constant during a round/level
    hyperparams = {
        GRAVITY: 500,
        FLAP_ENERGY_REDUCTION_COEFF: 8000,
        FLAP_ENERGY_QUANT: 2000,
        velocity: 250, // horizontal velocity of the world
        pipes_gap: 200,
        pipes_frequency: 3, // number of seconds between new pipes are added
        game_time: 0.0,
        lives: 3,
        level: 1,
        time_left: this.constants.level_time / 1000
    };

    controls = {};

    constructor(canvas_id) {
        super();
        this.c = $(canvas_id);
        this.resetLevelValues();
        this.prepareForTheNextLevel();
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
        this.controls.add_energy = true;
    }

    start() {
        this.controls.ready_to_start = false;

        // the first pair of pipes should be added 1 second after a level starts
        let time_to_add_pipes = 1;

        let t = 0;
        requestAnimationFrame((time) => {
            t = time;
        });

        this.startCountingDown();

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

            if (this.playerLost()) {
                this.stopTheGame();
            } else if (this.controls.player_won) {
                this.stopAndLevelUp();
            } else {
                requestAnimationFrame(game_loop);
            }
        };

        this.controls.animation_loop = requestAnimationFrame(game_loop);
    }

    updateFlapEnergy() {
        if (this.controls.add_energy) {
            this.controls.flap_energy += this.hyperparams.FLAP_ENERGY_QUANT;

            if (this.bird.velocity > 0) {
                this.bird.velocity = 0;
            }
            this.controls.add_energy = false;
        }
    }

    repositionGameObjects(dt) {
        this.bird.reposition(dt, this.controls.flap_energy);

        this.pipes.reposition(dt);

        const added_block = this.ground.reposition(dt);
        if (added_block) {
            this.renderer.addSprite(added_block);
        }
    }

    reduceFlapEnergy(dt) {
        if (this.controls.flap_energy > 0) {
            const dE = this.hyperparams.FLAP_ENERGY_REDUCTION_COEFF * dt;
            this.controls.flap_energy -= dE;
            this.controls.flap_energy = Math.max(this.controls.flap_energy, 0);
        }
    }

    updateRenderer() {
        this.renderer.updateSprite(this.bird);
        this.renderer.updateGroupLayer(this.pipes.LAYER_GROUP, this.pipes.dx);
        this.renderer.updateGroupLayer(this.ground.LAYER_GROUP, this.ground.dx);
    }

    playerLost() {
        const conditions = [
            this.birdHitTheGround
        ];

        return conditions.some(fn => {
            return fn.apply(this);
        });
    }

    stopTheGame() {
        cancelAnimationFrame(this.controls.animation_loop);
        clearTimeout(this.controls.countdown_timer);
        this.resetLevelValues();
        this.hyperparams.lives--;
        this.prepareForTheNextLevel();
    }

    stopAndLevelUp() {
        cancelAnimationFrame(this.controls.animation_loop);
        clearTimeout(this.controls.countdown_timer);
        this.resetLevelValues();
        this.hyperparams.level++;
        this.increaseDifficulty();

        this.prepareForTheNextLevel();
    }

    startCountingDown() {
        const cb = () => {
            this.dispatchEvent(new CustomEvent("tick", { detail: this.hyperparams.time_left }));

            this.controls.countdown_timer = setTimeout(() => {
                this.hyperparams.time_left--;

                if (this.hyperparams.time_left > 0) {
                    cb();
                } else {
                    this.dispatchEvent(new CustomEvent("tick", { detail: 0 }));
                    this.controls.player_won = true;
                }
            }, 1000);
        };

        cb();
    }

    resetLevelValues() {
        this.controls = {
            add_energy: false,
            ready_to_start: true,
            flap_energy: 0,
            countdown_timer: null,
            animation_loop: null
        };

        this.hyperparams.game_time = 0.0,
        this.hyperparams.time_left = this.constants.level_time / 1000;
    }

    prepareForTheNextLevel() {
        this.renderer = new Renderer(this.c);
        this.bird = new Bird(this.hyperparams.GRAVITY);
        this.ground = new Ground(this.c, this.hyperparams.velocity);
        this.pipes = new Pipes(this.hyperparams.velocity);

        this.initCanvas();
    }

    emitLevelValues() {
        this.dispatchEvent(new CustomEvent("level_up", { detail: this.hyperparams.level }));
        this.dispatchEvent(new CustomEvent("tick", { detail: this.hyperparams.time_left }));
    }

    increaseDifficulty() {
        this.hyperparams.GRAVITY += this.constants.gravity_increase;
        this.hyperparams.velocity += this.constants.velocity_increase;
        this.hyperparams.pipes_gap -= this.constants.pipe_gap_shrink;
    }

    birdHitTheGround() {
        return this.bird.bottom() >= this.ground.ground_level;
    }

    readyToStart() {
        return this.controls.ready_to_start;
    }
}
