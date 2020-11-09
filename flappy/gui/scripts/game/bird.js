class Nose {
    angle = 0.0;

    constants = Object.freeze({
        min_angle: -30,
        max_angle: 70
    });

    recalc_angle(bird_velocity) {

    }
}

class Bird {
    x = 100;
    y = 100;
    ceiling_bump_back = 0;

    scale = 0.333;
    LAYER_NAME = "player";
    img = { src: "img/bird_transparent.png", h: 110, w: 164 };
    nose = NoseDirection.FLIGHT;

    velocity = 0.0;

    constructor(gravity) {
        this.gravity = gravity;
    }

    reposition(dt, flap_energy) {
        if (this.top() < 0) {
            this.y = this.scale * this.img.h / 2;
            this.velocity = 0;
            this.ceiling_bump_back = 10000;
        } else {
            const dv = (this.gravity - flap_energy + this.ceiling_bump_back) * dt;
            this.ceiling_bump_back = 0;
            this.velocity += dv;
            const dy = this.velocity * dt;
            this.y += dy;
        }

        if (this.velocity > 600) {
            this.nose = NoseDirection.DIVING;
        } else if (this.velocity > 400) {
            this.nose = NoseDirection.ALMOST_DIVING;
        } else if (this.velocity > 300) {
            this.nose = NoseDirection.FALLING_FASTER;
        } else if (this.velocity > 250) {
            this.nose = NoseDirection.FALLING;
        } else if (this.velocity < -300.0) {
            this.nose = NoseDirection.CLIMBING;
        } else if (this.velocity < -150.0) {
            this.nose = NoseDirection.CLIMBING_LIGHT;
        } else {
            this.nose = NoseDirection.STRAIGHT_FLIGHT;
        }
    }

    top() {
        return this.y - this.scale * this.img.h / 2;
    }

    bottom() {
        return this.y + this.scale * this.img.h / 2;
    }

    left() {
        return this.x - this.scale * this.img.w / 2 - this.scale * 20; //extra offset for the wings
    }

    right() {
        return this.x + this.scale * this.img.w / 2 - this.scale * 20; //extra offset for the nose
    }
}
