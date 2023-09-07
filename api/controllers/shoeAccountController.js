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

  getAllStatusAccount(req, res) {
    db.query("SELECT * FROM shoe_account_status", (error, results) => {
      if (error) {
        console.error("Error retrieving accountStatus: ", error);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "AccountStatus not found" });
      }
      res.json(results[0]);
    });
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
        console.log(countResult);
        const total = countResult[0].total || 0;
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

  addAccount(req, res) {
    const { username, password, decentralization_id, status_id } = req.body;
    console.log("username", username);
    console.log("password", password);
    console.log("decentralization_id", decentralization_id);
    console.log("status_id", status_id);
    if (
      username === undefined ||
      password === undefined ||
      decentralization_id === undefined ||
      status_id === undefined
    ) {
      const data = {
        status: 500,
        detail: "Invalid account infomation",
      };
      return res.status(500).json(data);
    } else {
      // Thực hiện kiểm tra dữ liệu đầu vào (validation)
      db.query(
        `SELECT * FROM shoe_account WHERE username = ?`,
        [username.toLowerCase()],
        (err, result) => {
          if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ error: "Failed to execute query" });
          }

          if (result && result.length > 0) {
            // Người dùng đã tồn tại, thực hiện hành động tương ứng
            const data = {
              status: 500,
              detail: "Username is exist",
            };
            return res.status(500).json(data);
            // ...
          } else {
            // Thực hiện truy vấn để thêm bản ghi mới
            const sql = `INSERT INTO shoe_account (username, password, decentralization_id, status_id) VALUES (?, ?, ?, ?)`;
            const values = [
              username.toLowerCase(),
              password,
              decentralization_id,
              status_id,
            ];

            db.query(sql, values, (err, result) => {
              if (err) {
                console.error("Error adding account:", err);
                // res.status(500).json({ error: "Failed to add account" });
                const data = {
                  status: 500,
                  detail: "Failed to add account",
                };
                res.status(500).json(data);
              } else {
                const data = {
                  status: 200,
                };
                res.status(200).json(data);
                // res.json({ message: "Account added successfully" });
              }
            });
          }
        }
      );
      // ...
    }
  },

  updateAccount(req, res) {
    // const accountId = req.params.id;
    const { username, password, decentralization_id, status_id, id } = req.body;

    // Thực hiện kiểm tra dữ liệu đầu vào (validation)
    // ...

    // Thực hiện truy vấn để cập nhật bản ghi
    const sql = `UPDATE shoe_account SET username = ?, password = ?, decentralization_id = ?, status_id = ? WHERE id = ?`;
    const values = [username, password, decentralization_id, status_id, id];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error updating account:", err);
        res.status(500).json({ error: "Failed to update account" });
      } else {
        res.json({ message: "Account updated successfully" });
      }
    });
  },

  deleteAccount(req, res) {
    const accountId = req.body.id;
    console.log("da vao del accid: ", accountId);
    // Thực hiện truy vấn để xóa bản ghi
    const sql = `DELETE FROM shoe_account WHERE id = ?`;
    const values = [accountId];

    if (accountId === undefined) {
      return;
    }

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error deleting account:", err);
        const data = {
          status: 500,
          detail: "Failed to delete account",
        };
        res.status(500).json(data);
        // res.status(500).json({ error: "Failed to delete account" });
      } else {
        const data = {
          status: 200,
        };
        res.status(200).json(data);
      }
    });
  },
};

module.exports = AccountController;
