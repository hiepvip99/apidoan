const db = require("../databases/db");

function getAllShoeSizes(req, res) {
  const query = "SELECT * FROM shoe_size ORDER BY name ASC";

  db.query(query, (error, results) => {
    if (error) {
      const data = {
        status: 500,
        error: true,
      };
      res.status(500).json(data);
    } else {
      const data = {
        status: 200,
        data: results,
      };
      res.status(200).json(data);
    }
  });
}

function getShoeSizeById(req, res) {
  const id = req.params.id;
  const query = "SELECT * FROM shoe_size WHERE id = ?";

  db.query(query, [id], (error, results) => {
    if (error) {
      const data = {
        status: 500,
        error: true,
      };
      res.status(500).json(data);
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: "Không tìm thấy màu giày" });
      } else {
        const data = {
          status: 200,
          object: results[0],
        };
        res.status(200).json(data);
      }
    }
  });
}

function createShoeSize(req, res) {
  const { name } = req.body;
  const query = "INSERT INTO shoe_size (name) VALUES (?)";

  db.query(query, [name], (error, results) => {
    if (error) {
      const data = {
        status: 500,
        error: true,
      };
      res.status(500).json(data);
    } else {
      const data = {
        status: 200,
      };
      res.status(200).json(data);
    }
  });
}

function updateShoeSize(req, res) {
  const id = req.params.id;
  const { name } = req.body;
  const query = "UPDATE shoe_size SET name = ? WHERE id = ?";

  db.query(query, [name, id], (error, results) => {
    if (error) {
      const data = {
        status: 500,
        error: true,
      };
      res.status(500).json(data);
    } else {
      const data = {
        status: 200,
      };
      res.status(200).json(data);
    }
  });
}

function deleteShoeSize(req, res) {
  const id = req.params.id;
  const query = "DELETE FROM shoe_size WHERE id = ?";

  db.query(query, [id], (error, results) => {
    if (error) {
      const data = {
        status: 500,
        error: true,
      };
      res.status(500).json(data);
    } else {
      const data = {
        status: 200,
      };
      res.status(200).json(data);
    }
  });
}

module.exports = {
  getAllShoeSizes,
  getShoeSizeById,
  createShoeSize,
  updateShoeSize,
  deleteShoeSize,
};
