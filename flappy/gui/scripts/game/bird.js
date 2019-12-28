class Bird {
    x = 100;
    y = 100;

    scale = 0.333;
    LAYER_NAME = "player";
    img = { src: "img/bird_transparent.png", h: 110, w: 164 };

    velocity = 0.0;

    constructor(gravity) {
        this.gravity = gravity;
    }

    reposition(dt, flap_energy) {
        const dv = (this.gravity - flap_energy) * dt;
        this.velocity += dv;
        const dy = this.velocity * dt;
        this.y += dy;
    }

    // bottom edge of the bounding box
    bottom() {
        return this.y + this.scale * this.img.h / 2;
    }
}