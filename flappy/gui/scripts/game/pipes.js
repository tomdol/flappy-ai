class Pipe {
    LAYER_GROUP = "pipes";

    x = 0;
    y = 0;

    constructor(height, img, positioning) {
        this.height = height;
        this.img = img;
        this.positioning = positioning;
    }

    moveLeft(dx) {
        this.x -= dx;
    }

    top() {
        if (this.positioning === VerticalPositioning.CENTER_POINT) {
            return this.y - this.img.h / 2;
        } else {
            return this.y;
        }
    }

    bottom() {
        if (this.positioning === VerticalPositioning.CENTER_POINT) {
            return this.y + this.img.h / 2;
        } else {
            return this.y + this.img.h;
        }
    }

    left() {
        if (this.positioning === VerticalPositioning.CENTER_POINT) {
            return this.x - this.img.w / 2;
        } else {
            return this.x;
        }
    }

    right() {
        if (this.positioning === VerticalPositioning.CENTER_POINT) {
            return this.x + this.img.w / 2;
        } else {
            return this.x + this.img.w;
        }
    }
}

class NorthPipe extends Pipe {
    constructor(height, initial_x, positioning) {
        super(height, { src: "img/pipe_north_tr.png", h: 742, w: 85 }, positioning);
        this.x = initial_x;
        if (positioning === VerticalPositioning.CENTER_POINT) {
            this.x += this.img.w / 2;
        }
        this.y = this.calc_y(height, positioning);
    }

    calc_y(height, positioning) {
        if (positioning === VerticalPositioning.CENTER_POINT) {
            const y = height - this.img.h / 2;
            return y;
        } else {
            return this.img.h - height;
        }
    }
}

class SouthPipe extends Pipe {
    constructor(height, initial_x, positioning, world_height) {
        super(height, { src: "img/pipe_south_tr.png", h: 742, w: 86 }, positioning);
        this.x = initial_x;
        if (positioning === VerticalPositioning.CENTER_POINT) {
            this.x += this.img.w / 2;
        }
        this.y = this.calc_y(height, positioning, world_height);
    }

    calc_y(height, positioning, world_height) {
        if (positioning === VerticalPositioning.CENTER_POINT) {
            const y = world_height - height + (this.img.h / 2);
            return y;
        } else {
            return world_height - height;
        }
    }
}

class PairOfPipes {
    constructor(world, ground_level, gap, points, positioning) {
        let pipe_height = (world.height() - gap) / 2;

        // calculate a random shift of the gap between pipes (up or down)
        const shift = this.gapShift(world.height(), ground_level, pipe_height);

        // create equal-length pipes
        this.north_pipe = new NorthPipe(pipe_height - shift, world.width(), positioning);
        this.south_pipe = new SouthPipe(pipe_height + shift, world.width(), positioning, world.height());

        this.points = points;
    }

    right() {
        return this.north_pipe.right();
    }

    collectPoints() {
        const pts = this.points;
        this.points = 0;
        return pts;
    }

    gapShift(world_height, ground_level, pipe_height) {
        const ground_height = world_height - ground_level;

        const min_pipe_img_height = 80;
        let min_pipe_height = min_pipe_img_height;
        let sign = 1;

        const shift_down = Math.random() < 0.5;
        if (shift_down) {
            sign = -1;
            min_pipe_height += ground_height;
        }

        const max_shift = pipe_height - min_pipe_height;
        let shift = Math.floor(Math.random() * max_shift);

        const min_shift = 20;
        shift = Math.max(shift, min_shift);

        return shift * sign;
    }

    moveLeft(dx) {
        this.north_pipe.moveLeft(dx);
        this.south_pipe.moveLeft(dx);
    }
}

class Pipes {
    pipes = [];
    // number of pixels that all pipes should be moved left in the current animation frame
    // may vary between frames depending on the elapsed time between them
    dx = 0;

    LAYER_GROUP = "pipes";

    constructor(velocity) {
        this.velocity = velocity;
    }

    addPipes(world, ground_level, gap, points, positioning = VerticalPositioning.CENTER_POINT) {
        const p = new PairOfPipes(world, ground_level, gap, points, positioning);
        this.pipes.push(p);
        return p;
    }

    reposition(t) {
        this.dx = this.velocity * t;

        this.pipes.forEach(p => {
            p.moveLeft(this.dx);
        });

        // remove those pipes that are not visible any more
        if (this.pipes.length > 0 && this.pipes[0].north_pipe.right() <= 0) {
            this.pipes.shift(); //removes the [0] element
        }
    }
}
