class Bird {
    x = 100;
    y = 100;

    img = { src: "img/bird_transparent.png", h: 164, w: 110 };

    velocity = 0.0;

    constructor(gravity) {
        this.gravity = gravity;
    }

    reposition(dt) {
        this.y += this.delta_s(dt);
    }

    delta_s(dt) {
        return this.gravity * dt * dt / 2;
    }
}