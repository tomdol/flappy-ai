/**
 * Controllers Common functions
 */
class ControllerCommon {

    findSuccess(res) {
        return (result) => {
            res.status(200); // Found
            res.render("result", {
                result_list: result // Show all result on the board
            });
        }
    }

    editSuccess(res) {
        return (result) => {
            res.status(201); // Created/Updated/Deleted
            res.json(result);    // Show current board
        }
    }

    serverError(res) {
        return (error) => {
            res.status(500);
            res.json(error);
        }
    }

    findError(res) {
        return (error) => {
            res.status(404); // Not found
            res.json(error);
        }
    }
}

module.exports = ControllerCommon;
