// shoeCustomerController.js
const db = require("../databases/db");

// Controller để lấy danh sách tất cả khách hàng giày
function getAllShoeCustomers(req, res) {
  const page = req.query.page || 1;
  const step = req.query.step || 10;
  const offset = (page - 1) * step;
  const keyword = req.query.keyword || "";

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
      let total = 1;
      if (countResult.length > 0) {
        total = countResult[0].total < 1 ? 1 : countResult[0].total;
      }
      const totalPages = Math.ceil(total / step);
      db.query(
        `SELECT id, name, phone_number, date_of_birth, email, id_account, address FROM shoe_customer WHERE name LIKE '%${keyword}%' LIMIT ${offset}, ${parseInt(
          step
        )}`,
        (err, results) => {
          if (err) {
            console.error("Error executing MySQL query:", err);
            const data = {
              status: 500,
              error: true,
              detail: "Failed to fetch shoe customers",
            };
            res.status(500).json(data);
            return;
          }
          const modifiedResults = results.map((customer) => {
            return {
              ...customer,
              address: JSON.parse(customer.address),
            };
          });

          const data = {
            currentPage: parseInt(page),
            step: parseInt(step),
            totalPages: totalPages,
            data: modifiedResults,
          };
          res.status(200).json(data);
        }
      );
    }
  );
}
// function getAllShoeCustomers(req, res) {
//   const page = req.query.page || 1;
//   const step = req.query.step || 10;
//   const offset = (page - 1) * step;
//   const keyword = req.query.keyword || "";

//   // const query = "SELECT * FROM shoe_customer";

//   db.query(
//     "SELECT COUNT(*) AS total FROM shoe_customer",
//     (err, countResult) => {
//       if (err) {
//         console.error("Error executing MySQL query:", err);
//         const data = {
//           status: 500,
//           error: true,
//         };
//         res.status(500).json(data);
//         return;
//       }
//       let total = 1;
//       if (countResult.length > 0) {
//         total = countResult[0].total < 1 ? 1 : countResult[0].total;
//       }
//       // const total = countResult[0].total || 0;
//       const totalPages = Math.ceil(total / step);
//       db.query(
//         `SELECT * FROM shoe_customer where name like 
//       '${`%${keyword}%`}' LIMIT ${offset}, ${parseInt(step)} `,
//         (err, results) => {
//           if (err) {
//             console.error("Error executing MySQL query:", err);
//             const data = {
//               status: 500,
//               error: true,
//               detail: "Failed to fetch shoe manufacturers",
//             };
//             res.status(500).json(data);
//             return;
//           }
//           const data = {
//             currentPage: parseInt(page),
//             step: parseInt(step),
//             totalPages: totalPages,
//             data: results,
//           };
//           res.status(200).json(data);
//         }
//       );
//     }
//   );


//   // Thực hiện truy vấn
//   // db.query(query, (error, results) => {
//   //   if (error) {
//   //     const data = {
//   //       status: 500,
//   //       error: true,
//   //     };
//   //     res.status(500).json(data);
//   //     // res.status(500).json({ error: "Lỗi truy vấn" });
//   //   } else {
//   //     const data = {
//   //       status: 500,
//   //       error: true,
//   //     };
//   //     res.status(200).json(results);
//   //   }
//   // });
// }

// Controller để lấy một khách hàng giày dựa trên ID
function getShoeCustomerByIdAccount(req, res) {
  const id = req.query.accountId;
  const query = "SELECT * FROM shoe_customer WHERE id_account = ?";

  console.log("đã vào hàm getShoeCustomerByIdAccount này rồi");

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
        const data = {
          status: 404,
          detail: "Không tìm thấy khách hàng",
          error: true,
        };
        res.status(404).json(data);
        // res.status(404).json({ error: "Không tìm thấy khách hàng" });
      } else {
        // res.status(200).json(results[0]);
        const shoeCustomer = results[0];
        shoeCustomer.address = JSON.parse(shoeCustomer.address);
        res.status(200).json(shoeCustomer);
      }
    }
  });
}

// Controller để tạo một khách hàng giày mới
function createShoeCustomer(req, res) {
  // Lưu ảnh
  upload.single("image")(req, res, function (err) {
    if (err) {
      console.log("error", err);
      const data = {
        status: 500,
        detail: "Lỗi trong quá trình tải ảnh",
      };
      res.status(500).json(data);
      return;
    }

    // Lấy thông tin khách hàng
    const { name, phone_number, date_of_birth, email, address } = req.body;

    // Lấy đường dẫn ảnh
    const imageUrl = req.file ? `api/image/${req.file.filename}` : "";

    // Thực hiện thêm khách hàng vào cơ sở dữ liệu
    const insertQuery =
      "INSERT INTO shoe_customer (name, phone_number, date_of_birth, email, address, image) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(
      insertQuery,
      [name, phone_number, date_of_birth, email, address, imageUrl],
      (error, results, fields) => {
        if (error) {
          console.error("Lỗi khi thêm khách hàng: ", error);
          const data = {
            status: 500,
            detail: "Lỗi khi thêm khách hàng",
          };
          res.status(500).json(data);
        } else {
          const data = {
            status: 200,
            detail: "Thêm khách hàng thành công",
            customer: {
              id: results.insertId,
              name,
              phone_number,
              date_of_birth,
              email,
              address,
              image: imageUrl,
            },
          };
          res.status(200).json(data);
        }
      }
    );
  });
}
// function createShoeCustomer(req, res) {
//   const { name, phone_number, date_of_birth, email, id_account } = req.body;
//   const query =
//     "INSERT INTO shoe_customer (name, phone_number, date_of_birth, email, id_account) VALUES (?, ?, ?, ?, ?)";

//   // Thực hiện truy vấn
//   db.query(
//     query,
//     [name, phone_number, date_of_birth, email, id_account],
//     (error, results) => {
//       if (error) {
//         const data = {
//           status: 500,
//           error: true,
//         };
//         res.status(500).json(data);
//         // res.status(500).json({ error: "Lỗi truy vấn" });
//       } else {
//         const newCustomerId = results.insertId;
//         res.status(201).json({ id: newCustomerId, name: name });
//       }
//     }
//   );
// }

// Controller để cập nhật một khách hàng giày dựa trên ID
function updateShoeCustomer(req, res) {
  // const customerId = req.params.id; // Lấy id khách hàng từ request params
  const { name, phone_number, date_of_birth, email, address , id} = req.body; // Lấy thông tin khách hàng từ request body

  // Thực hiện cập nhật thông tin khách hàng trong cơ sở dữ liệu
  const updateQuery =
    "UPDATE shoe_customer SET name = ?, phone_number = ?, date_of_birth = ?, email = ?, address = ? WHERE id = ?";
  db.query(
    updateQuery,
    [name, phone_number, date_of_birth, email, address, id],
    (error, results, fields) => {
      if (error) {
        console.error("Lỗi khi cập nhật khách hàng: ", error);
        const data = {
          status: 500,
          detail: "Lỗi khi cập nhật khách hàng",
        };
        res.status(500).json(data);
      } else {
        const data = {
          status: 200,
          detail: "Cập nhật thông tin khách hàng thành công",
        };
        res.status(200).json(data);
      }
    }
  );
}

function updateShoeCustomerImage(req, res) {
  const customerId = req.query.id; // Lấy id khách hàng từ request params

  // Lưu ảnh
  upload.single("image")(req, res, function (err) {
    if (err) {
      console.log("error", err);
      const data = {
        status: 500,
        detail: "Lỗi trong quá trình tải ảnh",
      };
      res.status(500).json(data);
      return;
    }

    // Lấy đường dẫn ảnh
    const imageUrl = req.file ? `api/image/${req.file.filename}` : "";

    // Thực hiện cập nhật ảnh cho khách hàng trong cơ sở dữ liệu
    const updateQuery = "UPDATE shoe_customer SET image = ? WHERE id = ?";
    db.query(updateQuery, [imageUrl, customerId], (error, results, fields) => {
      if (error) {
        console.error("Lỗi khi cập nhật ảnh khách hàng: ", error);
        const data = {
          status: 500,
          detail: "Lỗi khi cập nhật ảnh khách hàng",
        };
        res.status(500).json(data);
      } else {
        const data = {
          status: 200,
          detail: "Cập nhật ảnh khách hàng thành công",
        };
        res.status(200).json(data);
      }
    });
  });
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


function getVipCustomer(req, res) {
  const query = `
    SELECT
      c.id,
      c.name,
      c.phone_number,
      c.date_of_birth,
      c.email,
      c.image
    FROM
      shoe_customer AS c
    INNER JOIN (
      SELECT
        account_id,
        COUNT(*) AS order_count
      FROM
        shoe_order
      GROUP BY
        account_id
      HAVING
        order_count >= 5
    ) AS o ON c.id_account = o.account_id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn: ", err);
      res.status(500).send("Lỗi truy vấn cơ sở dữ liệu");
      return;
    }

    res.json(results);
  });
}

module.exports = {
  getAllShoeCustomers,
  getShoeCustomerByIdAccount,
  createShoeCustomer,
  updateShoeCustomer,
  deleteShoeCustomer,
  getShoeCustomersByAccountId,
  getVipCustomer,
  updateShoeCustomerImage,
};
