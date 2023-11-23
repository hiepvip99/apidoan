// shoeColorController.js
const db = require("../databases/db");

// Controller để lấy danh sách tất cả các màu giày
function getAllShoeColors(req, res) {
  const page = req.query.page || 1;
  const step = req.query.step || 10;
  const offset = (page - 1) * step;
  const keyword = req.query.keyword || "";

  // Sử dụng LIKE để thực hiện tìm kiếm theo tên (name)
  const query = `SELECT * FROM shoe_color 
                 WHERE name LIKE ? 
                 ORDER BY name ASC 
                 LIMIT ?, ?`;

  // Thực hiện truy vấn với keyword được thêm vào dạng %keyword% để thực hiện tìm kiếm mềm
  db.query(query, [`%${keyword}%`, offset, parseInt(step)], (error, results) => {
    if (error) {
      const data = {
        status: 500,
        error: true,
      };
      res.status(500).json(data);
    } else {
      // Sử dụng SELECT COUNT để tính tổng số trang
      db.query(`SELECT COUNT(*) AS totalCount FROM shoe_color WHERE name LIKE ?`, [`%${keyword}%`], (countError, countResults) => {
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
          // const totalCount = countResults[0].totalCount;
          // const totalPages = Math.ceil(totalCount / step);
          // Thêm phần thông tin về phân trang vào data
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



// function getAllShoeColors(req, res) {
//   const query = 'SELECT * FROM shoe_color ORDER BY name ASC';
//   // console.log("vao all");
//   // Thực hiện truy vấn
//   db.query(query, (error, results) => {
//     if (error) {
//       const data = {
//         status: 500,
//         error: true,
//       };
//       res.status(500).json(data);
//       // res.status(500).json({ error: 'Lỗi truy vấn' });
//     } else {
//       const data = {
//         status: 200,
//         data: results,
//       };
//       res.status(200).json(data);
//       // res.status(200).json(results);
//     }
//   });
// }

// Controller để lấy một màu giày dựa trên ID
function getShoeColorById(req, res) {
  const id = req.params.id;
  const query = 'SELECT * FROM shoe_color WHERE id = ?';

  // Thực hiện truy vấn
  db.query(query, [id], (error, results) => {
    if (error) {
      // res.status(500).json({ error: 'Lỗi truy vấn' });
      const data = {
        status: 500,
        error: true,
      };
      res.status(500).json(data);
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: 'Không tìm thấy màu giày' });
      } else {
        const data = {
          status: 200,
          object: results[0],
        };
        res.status(200).json(data);
        // res.status(200).json(results[0]);
      }
    }
  });
}

// Controller để tạo một màu giày mới
function createShoeColor(req, res) {
  const { name, color_code } = req.body;
  const query = 'INSERT INTO shoe_color (name, color_code) VALUES (?, ?)';

  // Thực hiện truy vấn
  db.query(query, [name, color_code], (error, results) => {
    if (error) {
      // res.status(500).json({ error: 'Lỗi truy vấn' });
      const data = {
        status: 500,
        error: true,
      };
      res.status(500).json(data);
    } else {
      const data = {
        status: 200,
        // object: results[0],
      };
      res.status(200).json(data);
      // const newColorId = results.insertId;
      // res.status(201).json({ id: newColorId, name: name });
    }
  });
}

// Controller để cập nhật một màu giày dựa trên ID
function updateShoeColor(req, res) {
  // const id = req.bo.id;
  const { id, name, color_code } = req.body;
  const query = 'UPDATE shoe_color SET name = ?, color_code = ? WHERE id = ?';

  // Thực hiện truy vấn
  db.query(query, [name, color_code, id], (error, results) => {
    if (error) {
      // res.status(500).json({ error: 'Lỗi truy vấn' });
      const data = {
        status: 500,
        error: true,
      };
      res.status(500).json(data);
    } else {
      const data = {
        status: 200,
        // object: results[0],
      };
      res.status(200).json(data);
      // res.status(200).json({ id: id, name: name });
    }
  });
}

// Controller để xóa một màu giày dựa trên ID
function deleteShoeColor(req, res) {
  const id = req.body.id;
  const query = 'DELETE FROM shoe_color WHERE id = ?';

  // Thực hiện truy vấn
  db.query(query, [id], (error, results) => {
    if (error) {
      // res.status(500).json({ error: 'Lỗi truy vấn' });
      const data = {
        status: 500,
        error: true,
      };
      res.status(500).json(data);
    } else {
      const data = {
        status: 200,
        // object: results[0],
      };
      res.status(200).json(data);
      // res.status(200).json({ message: 'Xóa màu giày thành công' });
    }
  });
}

// Export các phương thức của controller
module.exports = {
  getAllShoeColors,
  getShoeColorById,
  createShoeColor,
  updateShoeColor,
  deleteShoeColor,
};