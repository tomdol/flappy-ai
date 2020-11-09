class NightSky {
    LAYER_GROUP = "night_sky";
    LAYER_INDEX = 0;

    blocks = [];
    img = { src: "img/night_sky.png", w: 1400, h: 600 };
    parallax_distance = 10;
    dx = 0;

    constructor(world, velocity) {
        this.velocity = velocity / this.parallax_distance;

        const num_blocks = 2;
        const starting_point = this.img.w / 2 - (Math.random() * 200);

        for (let i = 0; i < num_blocks; ++i) {
            this.blocks.push({
                LAYER_GROUP: this.LAYER_GROUP,
                LAYER_INDEX: 0,
                img: this.img,
                x: starting_point + (i * this.img.w),
                y: world.height() - this.img.h / 2
            });
        }
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
                LAYER_INDEX: 0,
                img: this.img,
                x: last_block.x + this.img.w,
                y: last_block.y
            });

            return this.blocks[this.blocks.length - 1];
        }

        return null;
    }
}
