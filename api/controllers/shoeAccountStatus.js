const db = require("../databases/db");

const AccStatusController = {
  getAccountStatusById(req, res) {
    console.log(req.params.id);
    let statusId = req.params.id;
        db.query(
          "SELECT * FROM shoe_account_status WHERE id = ?",
          [statusId],
          (error, results) => {
            if (error) {
              console.error("Error retrieving accountStatus: ", error);
              return res.status(500).json({ error: "Internal server error" });
            }
            if (results.length === 0) {
              return res.status(404).json({ error: "AccountStatus not found" });
            }
            res.json(results[0]);
          }
        );
    },
}

module.exports = AccStatusController;