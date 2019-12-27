class Ground {
    sprites = [];
    img = { src: "img/concrete_2.png", w: 325, h: 55 };
    constructor(world) {
        const num_sprites = Math.ceil(world.width() / this.img.w);
        const starting_point = this.img.w / 2;

        for (let i=0; i<num_sprites; ++i) {
            this.sprites.push({
                LAYER_GROUP: "ground",
                img: this.img,
                x: starting_point + (i * this.img.w),
                y: world.height() - this.img.h / 2
            });
        }

        this.ground_level = world.height() - this.img.h;
    }
}