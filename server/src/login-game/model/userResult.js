/**
 * Driver Entity (ES6 Class)
 */

class UserResult {
    constructor(id, firstName, email, result, serverRes, userRes) {
        this.id = id;
        this.firstName = firstName;
        this.email = email;
        this.result = result;
        this.serverResult = serverRes;
        this.userResult = userRes;
        //this.distance = dist;
        //this.server_pipe = s_pipe;
        //this.user_pipe = u_pipe;
        //this.collision = col;
    }
}

module.exports = UserResult;