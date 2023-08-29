const db = require("../databases/db");

const shoeManufacturerController = {
  getById(req, res) {
    const id = req.params.id;

    db.query(
      "SELECT * FROM shoe_manufacturer WHERE id = ?",
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
          res.status(404).json({ error: "Shoe manufacturer not found" });
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
    const page = req.query.page || 1;
    const step = req.query.step || 10;
    const offset = (page - 1) * step;
    const keyword = req.query.keyword || "";
    console.log("keyword:", keyword);
    db.query(
      "SELECT COUNT(*) AS total FROM shoe_manufacturer",
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
        db.query(
          `SELECT * FROM shoe_manufacturer where name like 
      '${`%${keyword}%`}' LIMIT ${offset}, ${parseInt(step)} `,
          (err, results) => {
            if (err) {
              console.error("Error executing MySQL query:", err);
              const data = {
                status: 500,
                error: true,
                detail: "Failed to fetch shoe manufacturers",
              };
              res.status(500).json(data);
              return;
            }
            const data = {
              currentPage: parseInt(page),
              step: parseInt(step),
              totalPages: totalPages,
              data: results,
            };
            res.status(200).json(data);
          }
        );
      }
    );
  },

  add(req, res) {
    const { name } = req.body;
    db.query(
      "INSERT INTO shoe_manufacturer (name) VALUES (?)",
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
        const newManufacturer = {
          status: 200,
        };
        res.status(200).json(newManufacturer);
      }
    );
  },

  update(req, res) {
    const id = req.body.id;
    const name = req.body.name;

    db.query(
      "UPDATE shoe_manufacturer SET name = ? WHERE id = ?",
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
      "DELETE FROM shoe_manufacturer WHERE id = ?",
      [id],
      (err, results) => {
        if (err) {
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

module.exports = shoeManufacturerController;
