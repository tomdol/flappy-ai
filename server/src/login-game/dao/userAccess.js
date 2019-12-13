/* Load Driver entity */
const UserResult = require('../model/userResult');
const DetectResult = require('../model/DetectResult');

/* Load DAO Common functions */
const userCommonPromise = require('./commons/userCommonPromise');

/**
 * User Data Access Object
 */
class UserAccess {

    constructor() {
        this.common = new userCommonPromise();
    }

    /**
     * Finds all entities.
     * @return all entities
     */
    findAll(User) {
	var date = new Date();
	    var current_hour = date.getHours();
	    var current_minutes = date.getMinutes();
	    var current_seconds = date.getSeconds();
	    var current_data = date.getDate();
	    let sqlRequest = "SELECT * FROM userRes ORDER BY result DESC";
	    let show = false;
	    /*if(current_data >= 5 && current_hour >= 15 && current_minutes >= 0 && current_seconds >= 0) {
		    show = true ;
	    } else if (current_data >= 3 && current_data <= 5 && current_hour >= 15 && current_minutes >= 0 && current_seconds >= 0) { 
		    show = false ;
	    } else if (current_data == 3 || current_data == 4 || current_data == 5) {
		    if(current_data == 3 && current_hour < 15) {
		    	show = true;
		    } else { 
			show  = false;
		    }
	    }
*/

        return this.common.findAll(sqlRequest).then(rows => {
            let userResult = [];
            for (const row of rows) {
		if(show == false  && row.email == User.email) {
                	userResult.push(new UserResult(row.id, row.firstName, row.email, row.result));
			return userResult;
		} else if(show  == true){
                	userResult.push(new UserResult(row.id, row.firstName, row.email, row.result));
		}
            }
            return userResult;
        });
    };

    /**
     * Updates the given entity in the database
     * @params User
     * @return true if the entity has been updated, false if not found and not updated
     */
    update(User) {
        let sqlRequest = "UPDATE userRes SET " +
            "firstName=$firstName, " +
            "email=$email, " +
            "serverResult=$serverResult, " +
            "userResult=$userResult " +
            "WHERE email=$email";

        let sqlParams = {
            $firstName: User.firstName,
            $email: User.email,
            $serverResult: User.serverResult,
            $userResult: User.userResult
        };
        return this.common.run(sqlRequest, sqlParams);
    };

    /**
     * Updates the given entity in the database
     * @params User
     * @return true if the entity has been updateed, false if not found and not updated
     */
    updateScore(User) {
        let sqlRequest = "UPDATE userRes SET " +
            "firstName=$firstName, " +
            "email=$email, " +
            "serverResult=serverResult + 1, " +
            "userResult=$userResult " +
            "WHERE email=$email";

        let sqlParams = {
            $firstName: User.firstName,
            $email: User.email,
            $userResult: User.userResult
        };
        return this.common.run(sqlRequest, sqlParams);
    };
        /**
     * Updates the given entity in the database
     * @params User
     * @return true if the entity has been updateed, false if not found and not updated
     */
    updateMainScore(User) {
        let sqlRequest = "UPDATE userRes SET " +
            "firstName=$firstName, " +
            "email=$email, " +
            "result = serverResult " +
            "WHERE email=$email AND serverResult == userResult AND serverResult > result";

        let sqlParams = {
            $firstName: User.firstName,
            $email: User.email
        };
        return this.common.run(sqlRequest, sqlParams);
    };
    /**
     * Creates the given entity in the database
     * @params userResult
     * returns database insertion status
     */
    create(User) {
        let sqlRequest = "INSERT into userRes (firstName, email, result, serverResult, userResult) " +
            "VALUES ($firstName, $email, $result, $serverResult, $userResult)";
        let sqlParams = {
            $firstName: User.firstName,
            $email: User.email,
            $result: User.result,
            $serverResult: User.serverResult,
            $userResult: User.userResult
        };
        return this.common.run(sqlRequest, sqlParams);
    };

     createDet(User) {
        let sqlRequest = "INSERT into userResult (data, firstName, email, result, enable_colision, detect_collision, key_presed, pipe_speed, actor_position) " +
            "VALUES (datetime('now'), $firstName, $email, $result, $enable_colision, $detect_collision, $key_presed, $pipe_speed, $actor_position)";
        let sqlParams = {
            $firstName: User.firstName,
            $email: User.email,
            $result: User.result,
            $enable_colision: User.enable_colision,
            $detect_collision: User.detect_collision,
            $key_presed: User.key_presed,
            $pipe_speed: User.pipe_speed,
            $actor_position: User.actor_position
        };
        return this.common.run(sqlRequest, sqlParams);
    };


    /**
     * Creates the given entity with a provided in the database
     * @params User
     * returns database insertion status
     */
    createWithId(User) {
        let sqlRequest = "INSERT into userRes (id, firstName, email, result) " +
            "VALUES ($id, $firstName, $email, $result)";
        let sqlParams = {
            $id: User.id,
            $firstName: User.firstName,
            $email: User.email,
            $result: User.result
        };
        return this.common.run(sqlRequest, sqlParams);
    };

    /**
     * Returns true if an entity exists with the given Id / Primary Key
     * @params id
     * returns database entry existence status (true/false)
     */
    exists(email) {
        let sqlRequest = "SELECT (count(*) > 0) as found FROM userRes WHERE email=$email";
        let sqlParams = {$email: email};
        return this.common.existsOne(sqlRequest, sqlParams);
    };
}

module.exports = UserAccess;
