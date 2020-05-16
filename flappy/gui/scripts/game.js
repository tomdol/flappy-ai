class Game extends EventTarget {
    constants = Object.freeze({
        level_time: 10000,
        gravity_increase: 30,
        velocity_increase: 25,
        pipes_frequency_increase: 0.3,
        pipe_gap_shrink: 25,
        pipes_points_increase: 5,
        min_gap_size: 175,
        FERC_shrink: 1000
    });
    // game hyperparams - constant during a round/level
    hyperparams = {
        GRAVITY: 500,
        FLAP_ENERGY_REDUCTION_COEFF: 8000,
        FLAP_ENERGY: 2700,
        velocity: 250, // horizontal velocity of the world
        pipes_gap: 300,
        pipes_frequency: 3, // number of seconds between new pipes are added
        pipes_points: 10,
        game_time: 0.0,
        lives: 3,
        level: 1,
        score: 0,
        time_left: this.constants.level_time / 1000
    };

    controls = {};

    constructor(canvas_id) {
        super();
        this.c = $(canvas_id);
        this.resetLevelValues();
        this.prepareForTheNextLevel();
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
            this.updateScore();
            this.updateRenderer();

            if (this.hyperparams.game_time >= time_to_add_pipes) {
                this.addPipes();
                time_to_add_pipes += this.hyperparams.pipes_frequency;
            }

            this.renderer.render();

            if (this.playerLost()) {
                this.stopTheGame();
            } else if (this.controls.end_of_round) {
                this.stopAndLevelUp();
            } else {
                requestAnimationFrame(game_loop);
            }
        };

        this.controls.animation_loop = requestAnimationFrame(game_loop);
    }

    initCanvas() {
        this.renderer.init();
        this.renderer.addSprite(this.bird);

        for (let i = 0; i < this.ground.blocks.length; ++i) {
            this.renderer.addSprite(this.ground.blocks[i]);
        }

        this.renderer.renderScore(this.hyperparams.score);

        this.renderer.render();
    }

    addPipes() {
        const p = this.pipes.addPipes(this.c, this.ground.ground_level, this.hyperparams.pipes_gap,
            this.hyperparams.pipes_points, this.renderer.OBJECTS_POSITIONING);

        this.renderer.addSprite(p.north_pipe);
        this.renderer.addSprite(p.south_pipe);
    }

    flap() {
        this.controls.add_energy = true;
    }

    updateFlapEnergy() {
        if (this.controls.add_energy) {
            this.controls.flap_energy += this.hyperparams.FLAP_ENERGY;

            if (this.bird.velocity > 0) {
                this.bird.velocity = 0;
            }
            this.controls.add_energy = false;
        }
    }

    reduceFlapEnergy(dt) {
        if (this.controls.flap_energy > 0) {
            const dE = this.hyperparams.FLAP_ENERGY_REDUCTION_COEFF * dt;
            this.controls.flap_energy -= dE;
            this.controls.flap_energy = Math.max(this.controls.flap_energy, 0);
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

    updateRenderer() {
        this.renderer.updateSprite(this.bird);
        this.renderer.updateGroupLayer(this.pipes.LAYER_GROUP, this.pipes.dx);
        this.renderer.updateGroupLayer(this.ground.LAYER_GROUP, this.ground.dx);
        this.renderer.renderScore(this.hyperparams.score);
    }

    stopTheGame() {
        cancelAnimationFrame(this.controls.animation_loop);
        clearTimeout(this.controls.countdown_timer);
        this.renderer.wasted();
        this.resetLevelValues();
        this.hyperparams.lives--;

        if (this.hyperparams.lives == 0) {
            this.controls.ready_to_start = false;
            this.dispatchEvent(new Event("bird_died"));
            setTimeout(() => {
                this.dispatchEvent(new Event("end_of_game"));
            }, 2000);
        } else {
            setTimeout(() => {
                this.prepareForTheNextLevel();
                this.dispatchEvent(new Event("bird_died"));
            }, 2000);
        }
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
                    this.controls.end_of_round = true;
                }
            }, 1000);
        };

        cb();
    }

    resetLevelValues() {
        this.controls = {
            add_energy: false,
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

        this.controls.ready_to_start = true;
    }

    emitLevelValues() {
        this.dispatchEvent(new CustomEvent("level_up", { detail: this.hyperparams.level }));
        this.dispatchEvent(new CustomEvent("lives_left", { detail: this.hyperparams.lives }));
        this.dispatchEvent(new CustomEvent("tick", { detail: this.hyperparams.time_left }));
    }

    increaseDifficulty() {
        this.hyperparams.GRAVITY += this.constants.gravity_increase;
        this.hyperparams.velocity += this.constants.velocity_increase;
        this.hyperparams.pipes_points += this.constants.pipes_points_increase;

        // don't shrink the gap any more when it reaches the minimum size
        if (this.hyperparams.pipes_gap != this.constants.min_gap_size) {
            this.hyperparams.pipes_gap -= this.constants.pipe_gap_shrink;
        }

        if (this.hyperparams.level % 2 == 0 && this.hyperparams.pipes_frequency > 1.5) {
            this.hyperparams.pipes_frequency -= this.constants.pipes_frequency_increase;
        }

        if (this.hyperparams.level % 10 == 0 && this.hyperparams.FLAP_ENERGY_REDUCTION_COEFF > 6000) {
            this.hyperparams.FLAP_ENERGY_REDUCTION_COEFF -= this.constants.FERC_shrink;
        }
    }

    playerLost() {
        const conditions = [
            this.birdHitTheGround,
            this.birdHitAPipe
        ];

        return conditions.some(fn => {
            return fn.apply(this);
        });
    }

    birdHitTheGround() {
        return this.bird.bottom() >= this.ground.ground_level;
    }

    birdHitAPipe() {
        if (this.pipes.pipes.length == 0) {
            return false;
        }

        if (this.collision(this.bird, this.pipes.pipes[0].north_pipe)) {
            return true;
        } else if (this.collision(this.bird, this.pipes.pipes[0].south_pipe)) {
            return true;
        }

        return false;
    }

    collision(bird, pipe) {
        return (bird.left() < pipe.right() &&
            bird.right() > pipe.left() &&
            bird.top() < pipe.bottom() &&
            bird.bottom() > pipe.top());
    }

    readyToStart() {
        return this.controls.ready_to_start;
    }

    updateScore() {
        if (this.pipes.pipes.length > 0) {
            const pipes = this.pipes.pipes[0];
            if (pipes.points > 0 && pipes.right() < this.bird.left()) {
                this.hyperparams.score += pipes.collectPoints();
            }
        }
    }
}
