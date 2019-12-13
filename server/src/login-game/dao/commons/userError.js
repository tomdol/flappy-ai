/**
 * Dao Error Entity (ES6 Class)
 */

class UserError {
    constructor(errorCode, message) {
        this.errorCode = errorCode;
        this.message = message;
    }
}

module.exports = UserError;