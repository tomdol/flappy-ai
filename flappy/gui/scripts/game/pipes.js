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

    // right edge of the bounding box
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
        super(height, { src: "img/pipe_south_tr.png", h: 742, w: 86 });
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
    constructor(world, gap, positioning) {
        this.north_pipe = new NorthPipe((world.height() - gap) / 2, world.width(), positioning);
        this.south_pipe = new SouthPipe((world.height() - gap) / 2, world.width(), positioning, world.height());
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

    addPipes(world, gap, positioning = VerticalPositioning.CENTER_POINT) {
        const p = new PairOfPipes(world, gap, positioning);
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
