const db = require("../databases/db");

const AccountController = {
  getAccountStatusById(req, res) {
    console.log(req.query.id);
    let statusId = req.query.id;
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

  getAccountById(req, res) {
    const accountId = req.query.accountId;

    const sql = `
    SELECT a.*, c.name AS customer_name, c.phone_number, c.date_of_birth, c.email
    FROM shoe_account AS a
    JOIN shoe_customer AS c ON a.id = c.id_account
    WHERE a.id = ?
  `;
    db.query(sql, [accountId], (err, result) => {
      if (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({ error: "Failed to retrieve data" });
      } else {
        db.query(
          `SELECT * FROM shoe_decentralization`,
          [accountId],
          (err, result1) => {
            if (err) {
              const data = {
                status: 500,
              };
              res.status(500).json(data);
            } else {
              db.query(
                `SELECT * FROM shoe_account_status`,
                [accountId],
                (err, result2) => {
                  if (err) {
                    const data = {
                      status: 500,
                    };
                    res.status(500).json(data);
                  } else {
                    const data = {
                      status: 200,
                      object: result[0],
                      decentralization: result1,
                      account_status: result2,
                    };
                    res.status(200).json(data);
                  }
                }
              );
            }
          }
        );
      }
    });
  },

  getAllAccount(req, res) {
    const page = req.query.page || 1;
    const step = req.query.step || 10;
    const offset = (parseInt(page) - 1) * parseInt(step);
    const keyword = req.query.keyword || "";
    console.log("keyword:", keyword);
    db.query(
      `SELECT COUNT(*) AS total FROM shoe_account WHERE username LIKE 
      '%${keyword}%' LIMIT ${offset}, ${parseInt(step)}`,
      (err, countResult) => {
        if (err) {
          console.error("Error executing MySQL query:", err);
          const data = {
            status: 500,
            error: true,
          };
          res.status(500).json(data);
          return;
        }
        const total = countResult[0].total;
        const totalPages = Math.ceil(total / step);

        const sql = `
        SELECT a.*, c.name AS customer_name, c.phone_number, c.date_of_birth, c.email
        FROM shoe_account AS a
        LEFT JOIN shoe_customer AS c ON a.id = c.id_account WHERE a.username LIKE 
      '%${keyword}%' ORDER BY a.id ASC LIMIT ${offset}, ${parseInt(step)} 
      `;

        db.query(sql, (err, result) => {
          if (err) {
            console.error("Error retrieving data:", err);
            res.status(500).json({ error: "Failed to retrieve data" });
          } else {
            db.query(`SELECT * FROM shoe_decentralization`, (err, result1) => {
              if (err) {
                const data = {
                  status: 500,
                };
                res.status(500).json(data);
              } else {
                db.query(
                  `SELECT * FROM shoe_account_status`,
                  (err, result2) => {
                    if (err) {
                      const data = {
                        status: 500,
                      };
                      res.status(500).json(data);
                    } else {
                      const data = {
                        status: 200,
                        currentPage: parseInt(page),
                        step: parseInt(step),
                        totalPages: totalPages,
                        data: result,
                        decentralization: result1,
                        account_status: result2,
                      };
                      res.status(200).json(data);
                    }
                  }
                );
              }
            });
          }
        });
      }
    );
  },
};

module.exports = AccountController;
