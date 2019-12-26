class Pipe {
    x = 0;
    y = 0;

    constructor(height, img) {
        this.height = height;
        this.img = img;
    }
}

class NorthPipe extends Pipe {
    constructor(height, initial_x, positioning) {
        super(height, { src: "img/pipe_north_tr.png", h: 742, w: 85 });
        this.x = initial_x;
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
    constructor(world, gap, positioning = VerticalPositioning.CENTER_POINT) {
        this.north_pipe = new NorthPipe((world.height() - gap) / 2, world.width() - 200, positioning);
        this.south_pipe = new SouthPipe((world.height() - gap) / 2, world.width() - 200, positioning, world.height());
    }
}
