const db = require("../databases/db");

function getAllShoeSizes(req, res) {
  const page = req.query.page || 1;
  const step = req.query.step || 10;
  const offset = (page - 1) * step;
  const keyword = req.query.keyword || "";

  const query = `SELECT * FROM shoe_size 
                 WHERE name LIKE ? 
                 ORDER BY name ASC 
                 LIMIT ?, ?`;

  db.query(query, [`%${keyword}%`, offset, parseInt(step)], (error, results) => {
    if (error) {
      const data = {
        status: 500,
        error: true,
      };
      res.status(500).json(data);
    } else {
      db.query(`SELECT COUNT(*) AS totalCount FROM shoe_size WHERE name LIKE ? ORDER BY name ASC 
                 LIMIT ?, ?`, [`%${keyword}%`, offset, parseInt(step)], (countError, countResults) => {
        if (countError) {
          console.error("Error executing MySQL query:", countError);
          const data = {
            status: 500,
            error: true,
          };
          res.status(500).json(data);
        } else {
          let total = 1;
          if (countResults.length > 0) {
            total = countResults[0].total < 1 ? 1 : countResults[0].total;
          }
          const totalPages = Math.ceil(total / step);
          // const total = countResult[0].total || 0;

          // const totalCount = countResults[0].totalCount;
          // const totalPages = Math.ceil(totalCount / step);

          const data = {
            currentPage: parseInt(page),
            step: parseInt(step),
            totalPages: totalPages,
            data: results,
          };
          res.status(200).json(data);
        }
      });
    }
  });
}

// function getAllShoeSizes(req, res) {
//   const query = "SELECT * FROM shoe_size ORDER BY name ASC";

//   db.query(query, (error, results) => {
//     if (error) {
//       const data = {
//         status: 500,
//         error: true,
//       };
//       res.status(500).json(data);
//     } else {
//       const data = {
//         status: 200,
//         data: results,
//       };
//       res.status(200).json(data);
//     }
//   });
// }

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

  // Kiểm tra trùng lặp trước khi thêm dữ liệu mới
  const checkDuplicateQuery = "SELECT * FROM shoe_size WHERE name = ?";
  db.query(checkDuplicateQuery, [name], (error, results) => {
    if (error) {
      const data = {
        status: 500,
        error: true,
        message: "Internal Server Error",
      };
      res.status(500).json(data);
    } else {
      if (results.length > 0) {
        // Nếu đã tồn tại giá trị trong bảng, trả về thông báo lỗi
        const data = {
          status: 400,
          error: true,
          message: "Lỗi đã trùng tên",
        };
        res.status(400).json(data);
      } else {
        // Nếu chưa tồn tại giá trị, thêm dữ liệu mới vào bảng
        const insertQuery = "INSERT INTO shoe_size (name) VALUES (?)";
        db.query(insertQuery, [name], (error, results) => {
          if (error) {
            const data = {
              status: 500,
              error: true,
              message: "Internal Server Error",
            };
            res.status(500).json(data);
          } else {
            const data = {
              status: 200,
              message: "Shoe size added successfully",
            };
            res.status(200).json(data);
          }
        });
      }
    }
  });
}

// function createShoeSize(req, res) {
//   const { name } = req.body;
//   const query = "INSERT INTO shoe_size (name) VALUES (?)";

//   db.query(query, [name], (error, results) => {
//     if (error) {
//       const data = {
//         status: 500,
//         error: true,
//       };
//       res.status(500).json(data);
//     } else {
//       const data = {
//         status: 200,
//       };
//       res.status(200).json(data);
//     }
//   });
// }

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
  const id = req.body.id;
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
