class Nose {
    angle = 0.0;

    recalc_angle(bird_velocity) {
        const max_diving_velocity = 700;
        const min_climbing_velocity = -300;
        const max_angle = 70;
        const min_angle = -30;

        const vel_range = max_diving_velocity - min_climbing_velocity;
        const angle_range = max_angle - min_angle;

        if (bird_velocity > max_diving_velocity) {
            this.angle = max_angle;
        } else if (bird_velocity < min_climbing_velocity) {
            this.angle = min_angle;
        } else {
            const factor = bird_velocity / vel_range;
            this.angle = angle_range * factor;
        }
    }
}

class Bird {
    x = 100;
    y = 100;
    ceiling_bump_back = 0;

    scale = 0.333;
    LAYER_NAME = "player";
    img = { src: "img/bird_transparent.png", h: 110, w: 164 };
    nose = new Nose();

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

        this.nose.recalc_angle(this.velocity);
    }

    top() {
        return this.y - this.scale * this.img.h / 2;
    }

    bottom() {
        return this.y + this.scale * this.img.h / 2;
    }

    left() {
        return this.x - this.scale * this.img.w / 2 - this.scale * 30; //extra offset for the wings
    }

    right() {
        return this.x + this.scale * this.img.w / 2 - this.scale * 30; //extra offset for the nose
    }
}
