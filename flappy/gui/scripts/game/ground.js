class Ground {
    LAYER_GROUP = "ground";

    blocks = [];
    img = { src: "img/concrete_2.png", w: 325, h: 55 };
    dx = 0;

    constructor(world, velocity) {
        this.velocity = velocity;

        const num_blocks = Math.ceil(world.width() / this.img.w) + 1;
        const starting_point = this.img.w / 2;

        for (let i = 0; i < num_blocks; ++i) {
            this.blocks.push({
                LAYER_GROUP: this.LAYER_GROUP,
                img: this.img,
                x: starting_point + (i * this.img.w),
                y: world.height() - this.img.h / 2
            });
        }

        this.ground_level = world.height() - this.img.h;
    }

    reposition(t) {
        this.dx = this.velocity * t;

        this.blocks.forEach(b => {
            b.x -= this.dx;
        });

        if (this.blocks[0].x <= 0) {
            this.blocks.shift();

            const last_block = this.blocks[this.blocks.length - 1];
            this.blocks.push({
                LAYER_GROUP: this.LAYER_GROUP,
                img: this.img,
                x: last_block.x + this.img.w,
                y: last_block.y
            });

            return this.blocks[this.blocks.length - 1];
        }

        return null;
    }
}