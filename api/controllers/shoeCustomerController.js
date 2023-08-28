// shoeCustomerController.js
const db = require("../databases/db");

// Controller để lấy danh sách tất cả khách hàng giày
function getAllShoeCustomers(req, res) {
  const page = req.params.page || 1;
  const step = req.params.step || 10;
  const offset = (page - 1) * step;
  const keyword = req.params.keyword || "";

  // const query = "SELECT * FROM shoe_customer";

  db.query(
    "SELECT COUNT(*) AS total FROM shoe_customer",
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
        `SELECT * FROM shoe_customer where name like 
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


  // Thực hiện truy vấn
  // db.query(query, (error, results) => {
  //   if (error) {
  //     const data = {
  //       status: 500,
  //       error: true,
  //     };
  //     res.status(500).json(data);
  //     // res.status(500).json({ error: "Lỗi truy vấn" });
  //   } else {
  //     const data = {
  //       status: 500,
  //       error: true,
  //     };
  //     res.status(200).json(results);
  //   }
  // });
}

// Controller để lấy một khách hàng giày dựa trên ID
function getShoeCustomerById(req, res) {
  const id = req.param.id;
  const query = "SELECT * FROM shoe_customer WHERE id = ?";

  // Thực hiện truy vấn
  db.query(query, [id], (error, results) => {
    if (error) {
      // res.status(500).json({ error: "Lỗi truy vấn" });
      const data = {
        status: 500,
        error: true,
      };
      res.status(500).json(data);
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: "Không tìm thấy khách hàng giày" });
      } else {
        res.status(200).json(results[0]);
      }
    }
  });
}

// Controller để tạo một khách hàng giày mới
function createShoeCustomer(req, res) {
  const { name, phone_number, date_of_birth, email, id_account } = req.body;
  const query =
    "INSERT INTO shoe_customer (name, phone_number, date_of_birth, email, id_account) VALUES (?, ?, ?, ?, ?)";

  // Thực hiện truy vấn
  db.query(
    query,
    [name, phone_number, date_of_birth, email, id_account],
    (error, results) => {
      if (error) {
        const data = {
          status: 500,
          error: true,
        };
        res.status(500).json(data);
        // res.status(500).json({ error: "Lỗi truy vấn" });
      } else {
        const newCustomerId = results.insertId;
        res.status(201).json({ id: newCustomerId, name: name });
      }
    }
  );
}

// Controller để cập nhật một khách hàng giày dựa trên ID
function updateShoeCustomer(req, res) {
  const id = req.params.id;
  const { name, phone_number, date_of_birth, email, id_account } = req.body;
  const query =
    "UPDATE shoe_customer SET name = ?, phone_number = ?, date_of_birth = ?, email = ?, id_account = ? WHERE id = ?";

  // Thực hiện truy vấn
  db.query(
    query,
    [name, phone_number, date_of_birth, email, id_account, id],
    (error, results) => {
      if (error) {
        const data = {
          status: 500,
          error: true,
        };
        res.status(500).json(data);
        // res.status(500).json({ error: "Lỗi truy vấn" });
      } else {
        res.status(200).json({ id: id, name: name });
      }
    }
  );
}

// Controller để xóa một khách hàng giày dựa trên ID
function deleteShoeCustomer(req, res) {
  const id = req.params.id;
  const query = "DELETE FROM shoe_customer WHERE id = ?";

  // Thực hiện truy vấn
  db.query(query, [id], (error, results) => {
    if (error) {
      const data = {
        status: 500,
        error: true,
      };
      res.status(500).json(data);
      // res.status(500).json({ error: "Lỗi truy vấn" });
    } else {
      res.status(200).json({ message: "Xóa khách hàng giày thành công" });
    }
  });
}

// Controller để lấy danh sách khách hàng giày dựa trên ID tài khoản
function getShoeCustomersByAccountId(req, res) {
  const accountId = req.params.accountId;
  const query = "SELECT * FROM shoe_customer WHERE id_account = ?";

  // Thực hiện truy vấn
  db.query(query, [accountId], (error, results) => {
    if (error) {
      const data = {
        status: 500,
        error: true,
      };
      res.status(500).json(data);
      // res.status(500).json({ error: "Lỗi truy vấn" });
    } else {
      res.status(200).json(results);
    }
  });
}

module.exports = {
  getAllShoeCustomers,
  getShoeCustomerById,
  createShoeCustomer,
  updateShoeCustomer,
  deleteShoeCustomer,
  getShoeCustomersByAccountId,
};
