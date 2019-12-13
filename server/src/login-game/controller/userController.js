/* Load Driver Data Access Object */
const UserAccess = require('../dao/userAccess');

/* Load Controller Common function */
const ControllerCommon = require('./common/controllerCommon');

/* Load Driver entity */
const UserResult = require('../model/userResult');
const DetectResult = require('../model/detectResult');

/**
 * Driver Controller
 */
class UserController {

    constructor() {
        this.userAccess = new UserAccess();
        this.common = new ControllerCommon();
    }

    /**
     * Finds all entities.
     * @return all entities
     */
    findAll(req, res) {
	     let userResult = new UserResult();
	    userResult.email = req.user.profile.email;
        this.userAccess.findAll(userResult)
            .then(this.common.findSuccess(res))
            .catch(this.common.findError(res));
    };

    /**
     * Updates the given entity in the database
     * @params req, res
     * @return true if the entity has been updated, false if not found and not updated
     */
    update(req, res) {
        let userResult = new UserResult();
        userResult.firstName = req.user.profile.firstName;
        userResult.email = req.user.profile.email;
        userResult.serverResult = 0;
        userResult.userResult = 0;
        return this.userAccess.update(userResult)
            .then(this.common.editSuccess(res))
            .catch(this.common.serverError(res));
    };

    /**
     * Updates the given entity in the database
     * @params req, res
     * @return true if the entity has been updated, false if not found and not updated
     */
    updateScore(req, res) {
        let userResult = new UserResult();
        userResult.firstName = req.user.profile.firstName;
        userResult.email = req.user.profile.email;
        userResult.userResult = req.body.r;
        return this.userAccess.updateScore(userResult)
            .then(this.common.editSuccess(res))
            .catch(this.common.serverError(res));
    };
    /**
     * Updates the given entity in the database
     * @params req, res
     * @return true if the entity has been updated, false if not found and not updated
     */
    updateMainScore(req, res) {
        let userResult = new UserResult();
        userResult.firstName = req.user.profile.firstName;
        userResult.email = req.user.profile.email;
        return this.userAccess.updateMainScore(userResult)
            .then(this.common.editSuccess(res))
            .catch(this.common.serverError(res));
    };


    /**
     * Creates the given entity in the database
     * @params req, res
     * returns database insertion status
     */
    create(req, res) {
        let userResult = new UserResult();
        if (req.body.id) {
            userResult.id = req.body.id;
        }
        userResult.firstName = req.user.profile.firstName;
        userResult.email = req.user.profile.email;
        userResult.result = 0;
        userResult.serverResult = 0;
        userResult.userResult = 0;
        if(res.status(200)) {
            return this.userAccess.create(userResult)
                .then(this.common.editSuccess(res))
                .catch(this.common.serverError(res));
        } else {
            this.update(req, res);
        }

    };

    /**
     * Returns true if an entity exists with the given Id / Primary Key
     * @params req, res
     * @return
     */
    exists(req, res) {
        let email = req.user.profile.email;
        this.userAccess.exists(email)
            .then(result => {
                if(result === false) {
                    this.create(req, res);
                } else {
                    this.update(req,res);
                }
            })
            .catch(this.common.serverError(res));
    };
    /**
     * Returns true if an entity exists with the given Id / Primary Key
     * @params req, res
     * @return
     */
     existAndUpdateResult(req, res) {
        let email = req.user.profile.email;
        this.userAccess.exists(email)
            .then(result => {
                if(result === false){
                    this.create(req, res);
                } else {
                    this.updateScore(req,res);
                }
            })
            .catch(this.common.serverError(res));
    };

    existAndUpdateResultCol(req, res) {
        let userResult = new DetectResult();
        userResult.firstName = req.user.profile.firstName;
        userResult.email = req.user.profile.email;
        userResult.result =  req.body.r;  // userResult
        userResult.enable_colision = req.body.cc; //collisionEanble
        userResult.detect_collision = req.body.cd; // collisioneDetectoion
        userResult.key_presed = req.body.kp;
        userResult.pipe_speed = req.body.s_p;
        userResult.actor_position = req.body.a_p_y;
        //console.log(userResult.firstName + " " + userResult.email + " " + userResult.result + " " + userResult.enable_colision + " " +
        //   userResult.detect_collision + " " +  userResult.key_presed + " " + userResult.pipe_speed + " " + userResult.actor_position);
        if(res.status(200)) {
            return this.userAccess.createDet(userResult)
                .then(this.common.editSuccess(res))
                .catch(this.common.serverError(res));
        } else {
            this.update(req, res);
        }

    };
    /**
     * Returns true if an entity exists with the given Id / Primary Key
     * @params req, res
     * @return
     */
     existAndUpdateMainResult(req, res) {
        let email = req.user.profile.email;
        this.userAccess.exists(email)
            .then(result => {
                if(result === false){
                    this.create(req, res);
                } else {
                    this.updateMainScore(req,res);
                }
            })
            .catch(this.common.serverError(res));
    };
}

module.exports = UserController;
