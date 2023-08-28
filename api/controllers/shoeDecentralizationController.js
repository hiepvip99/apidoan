const db = require("../databases/db");

const shoeDecentralizationController = {
  getById(req, res) {
    const id = req.params.id;

    db.query(
      "SELECT * FROM shoe_decentralization WHERE id = ?",
      [id],
      (err, results) => {
        if (err) {
          console.error("Error executing MySQL query:", err);
          const data = {
            status: 500,
            error: true,
          };
          res.status(500).json(data);

          return;
        }

        if (results.length === 0) {
          const data = {
            status: 404,
            error: true,
          };
          res.status(404).json(data);

          return;
        }
        const data = {
          status: 200,
          object: results[0],
        };
        res.status(200).json(data);
      }
    );
  },

  getAll(req, res) {
    db.query("SELECT * FROM shoe_decentralization", (err, results) => {
      if (err) {
        console.error("Error executing MySQL query:", err);
        const data = {
          status: 500,
          error: true,
        };
        res.status(500).json(data);

        return;
      }
      const data = {
        status: 200,
        data: results,
      };
      res.status(200).json(data);
    });
  },

  add(req, res) {
    const { name } = req.body;

    db.query(
      "INSERT INTO shoe_decentralization (name) VALUES (?)",
      [name],
      (err, results) => {
        if (err) {
          console.error("Error executing MySQL query:", err);
          const data = {
            status: 500,
            error: true,
          };
          res.status(500).json(data);

          return;
        }

        const newDecentralization = {
          id: results.insertId,
          name: name,
        };

        res.status(200).json(newDecentralization);
      }
    );
  },

  update(req, res) {
    const id = req.params.id;
    const { name } = req.body;

    db.query(
      "UPDATE shoe_decentralization SET name = ? WHERE id = ?",
      [name, id],
      (err, results) => {
        if (err) {
          console.error("Error executing MySQL query:", err);
          const data = {
            status: 500,
            error: true,
          };
          res.status(500).json(data);

          return;
        }
        const data = {
          status: 200,
        };
        res.status(200).json(data);
      }
    );
  },

  delete(req, res) {
    const id = req.params.id;

    db.query(
      "DELETE FROM shoe_decentralization WHERE id = ?",
      [id],
      (err, results) => {
        if (err) {
          console.error("Error executing MySQL query:", err);
          const data = {
            status: 500,
            error: true,
          };
          res.status(500).json(data);
          return;
        }

        const data = {
          status: 200,
        };
        res.status(200).json(data);
      }
    );
  },
};

module.exports = shoeDecentralizationController;
