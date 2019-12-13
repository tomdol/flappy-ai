/**
 * Driver Entity (ES6 Class)
 */

class DetectResult {
    constructor(id, firstName, email, result, cc, cd, kp, s_p, a_p_y) {
        this.id = id;
        this.firstName = firstName;
        this.email = email;
        this.result = result;
        this.enable_colision = cc;
        this.detect_collision = cd;
        this.key_presed = kp;
        this.pipe_speed = s_p;
        this.actor_position = a_p_y;
    }
}

module.exports = DetectResult;