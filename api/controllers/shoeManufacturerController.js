const db = require("../databases/db");

const shoeManufacturerController = {
  getById(req, res) {
    const id = req.query.id;

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
    // console.log("keyword:", keyword);
    db.query(
      `SELECT COUNT(*) AS total FROM shoe_manufacturer WHERE name LIKE '${`%${keyword}%`}'`,
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
        let total = 1;
        if (countResult.length > 0) {
          total = countResult[0].total < 1 ? 1 : countResult[0].total;
        }
        // const total = countResult[0].total || 0;
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
    const selectQuery = 'SELECT * FROM shoe_manufacturer WHERE name = ?';
    const insertQuery = 'INSERT INTO shoe_manufacturer (name) VALUES (?)';

    // Kiểm tra trùng lặp trước khi thêm mới
    db.query(selectQuery, [name], (selectError, selectResults) => {
      if (selectError) {
        console.error('Error executing MySQL query:', selectError);
        const data = {
          status: 500,
          error: true,
        };
        res.status(500).json(data);
      } else if (selectResults.length > 0) {
        // Trả về thông báo lỗi nếu trùng lặp
        const data = {
          status: 400,
          error: true,
          message: 'Tên nhà sản xuất đã tồn tại.',
        };
        res.status(400).json(data);
      } else {
        // Thực hiện truy vấn để thêm mới nếu không có trùng lặp
        db.query(insertQuery, [name], (insertError, insertResults) => {
          if (insertError) {
            console.error('Error executing MySQL query:', insertError);
            const data = {
              status: 500,
              error: true,
            };
            res.status(500).json(data);
          } else {
            const newManufacturer = {
              status: 200,
            };
            res.status(200).json(newManufacturer);
          }
        });
      }
    });
  },
  // add(req, res) {
  //   const { name } = req.body;
  //   db.query(
  //     "INSERT INTO shoe_manufacturer (name) VALUES (?)",
  //     [name],
  //     (err, results) => {
  //       if (err) {
  //         console.error("Error executing MySQL query:", err);
  //         const data = {
  //           status: 500,
  //           error: true,
  //         };
  //         res.status(500).json(data);
  //         return;
  //       }
  //       const newManufacturer = {
  //         status: 200,
  //       };
  //       res.status(200).json(newManufacturer);
  //     }
  //   );
  // },


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
    const id = req.body.id;
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
