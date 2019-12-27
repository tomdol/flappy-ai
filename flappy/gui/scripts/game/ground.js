class Ground {
    sprites = [];
    img = { src: "img/concrete_2.png", w: 325, h: 55 };
    constructor(world) {
        const num_sprites = Math.ceil(world.width() / this.img.w);
        const starting_point = this.img.w / 2;

        for (let i=0; i<num_sprites; ++i) {
            this.sprites.push({
                img: this.img,
                x: starting_point + (i * this.img.w),
                y: world.height() - this.img.h / 2
            });
        }
    }
}